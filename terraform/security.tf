resource "aws_security_group" "backend" {
  vpc_id = aws_vpc.main.id
}

resource "aws_security_group" "ecs" {
  name        = "ecs-sg"
  description = "Allow outbound traffic to services"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Allow ALB traffic"
    from_port       = 8080
    to_port         = 8080
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

resource "aws_security_group" "postgres" {
  vpc_id = aws_vpc.main.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.backend.id]
  }
}

resource "aws_security_group" "redis" {
  name   = "redis-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "frontend" {
  name        = "frontend-sg"
  description = "Frontend service"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Allow HTTP from internet"
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.lb_frontend.id]
  }

  egress {
    description     = "Allow backend access"
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.lb.id]
  }
}

resource "aws_security_group" "lb_frontend" {
  name        = "frontend-alb-sg"
  description = "Frontend ALB"
  vpc_id      = aws_vpc.main.id

  ingress {
    description      = "HTTP public"
    from_port        = 80
    to_port          = 80
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}