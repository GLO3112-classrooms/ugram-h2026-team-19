resource "aws_ecs_cluster" "main" {
  name = "nestjs-backend-cluster"
}

resource "aws_security_group" "ecs" {
  name        = "ecs-sg"
  description = "Allow outbound traffic to services"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Allow ALB traffic"
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.lb.id] # allow ALB SG
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_iam_role" "ecs_execution" {
  name = "ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution" {
  role       = aws_iam_role.ecs_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_cloudwatch_log_group" "nestjs_backend" {
  name              = "/ecs/nestjs-backend"
  retention_in_days = 3
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "nestjs-backend"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  network_mode             = "awsvpc"

  execution_role_arn = aws_iam_role.ecs_execution.arn

  container_definitions = jsonencode([
    {
      name  = "backend"
      image = "237614677978.dkr.ecr.us-east-1.amazonaws.com/nestjs-backend"

      repositoryCredentials = null

      portMappings = [{
        containerPort = 3000
      }]

      environment = [
        { name = "POSTGRES_USER", value = var.postgres_user },
        { name = "POSTGRES_PASSWORD", value = var.postgres_password },
        { name = "POSTGRES_DB", value = var.postgres_db },
        { name = "PGHOST", value = aws_db_instance.postgres.address },
        {
          name  = "DATABASE_URL"
          value = "postgresql://${var.postgres_user}:${var.postgres_password}@${aws_db_instance.postgres.address}:5432/${var.postgres_db}"
        },

        { name = "REDIS_HOST", value = aws_elasticache_cluster.redis.cache_nodes[0].address },

        { name = "S3_ACCESS_KEY_ID", value = aws_iam_access_key.s3_key.id },
        { name = "S3_SECRET_ACCESS_KEY", value = aws_iam_access_key.s3_key.secret },
        { name = "S3_ENDPOINT", value = aws_s3_bucket.app_bucket.bucket_regional_domain_name },

        { name = "REDIS_HOST", value = aws_elasticache_cluster.redis.cache_nodes[0].address },

        { name = "JWT_SECRET", value = var.jwt_secret },
        { name = "JWT_EXPIRES_IN", value = var.jwt_expires_in },

        { name = "STATIC_ORIGIN", value = var.static_origin }
      ],

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.nestjs_backend.name
          "awslogs-region"        = "us-east-1"
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])

  depends_on = [
    aws_db_instance.postgres,
    aws_elasticache_cluster.redis,
    aws_s3_bucket.app_bucket
  ]
}

resource "aws_security_group" "lb" {
  name        = "alb-sg"
  description = "Allow HTTP/HTTPS to ALB"
  vpc_id      = aws_vpc.main.id

  # Allow inbound HTTP from anywhere
  ingress {
    description      = "HTTP from anywhere"
    from_port        = 80
    to_port          = 80
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  # Allow inbound HTTPS if needed
  ingress {
    description      = "HTTPS from anywhere"
    from_port        = 443
    to_port          = 443
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  # Allow all outbound (default for ALB is fine)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_lb" "backend" {
  name               = "tf-lb-backend"
  load_balancer_type = "application"
  security_groups    = [aws_security_group.lb.id]
  subnets            = [aws_subnet.public_a.id, aws_subnet.public_b.id]
}

resource "aws_lb_target_group" "backend" {
  name        = "backend-tg"
  port        = 3000
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.main.id

  health_check {
    path                = "/openapi"
    protocol            = "HTTP"
    port                = "traffic-port"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_lb_listener" "backend" {
  load_balancer_arn = aws_lb.backend.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }
}

resource "aws_ecs_service" "backend" {
  name            = "nestjs-backend"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    assign_public_ip = false
    subnets          = [aws_subnet.public_a.id, aws_subnet.public_b.id]
    security_groups  = [aws_security_group.ecs.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend.arn
    container_name   = "backend"
    container_port   = 3000
  }

  depends_on = [aws_lb_listener.backend]
}
