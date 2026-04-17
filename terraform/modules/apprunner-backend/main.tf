resource "aws_iam_role" "backend_apprunner_ecr_access" {
  name = "backend-apprunner-ecr-access"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "build.apprunner.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy" "backend_google_client_id" {
  role = aws_iam_role.backend_instance_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "secretsmanager:GetSecretValue"
      ]
      Resource = aws_secretsmanager_secret.google_client_id.arn
    }]
  })
}

resource "aws_iam_role_policy" "backend_google_client_secret" {
  role = aws_iam_role.backend_instance_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "secretsmanager:GetSecretValue"
      ]
      Resource = aws_secretsmanager_secret.google_client_secret.arn
    }]
  })
}

resource "aws_iam_role_policy_attachment" "backend_apprunner_ecr_policy" {
  role       = aws_iam_role.backend_apprunner_ecr_access.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}

resource "aws_iam_role" "backend_instance_role" {
  name = "${var.service_name}-instance-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "tasks.apprunner.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "backend_s3" {
  role       = aws_iam_role.backend_instance_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}

resource "aws_apprunner_auto_scaling_configuration_version" "backend_single_threaded" {
  auto_scaling_configuration_name = "${var.service_name}-as-config"

  max_concurrency = 1

  min_size = 1
  max_size = 2
}

resource "aws_apprunner_service" "backend" {
  service_name = var.service_name

  auto_scaling_configuration_arn = aws_apprunner_auto_scaling_configuration_version.backend_single_threaded.arn

  source_configuration {
    authentication_configuration {
      access_role_arn = aws_iam_role.backend_apprunner_ecr_access.arn
    }

    image_repository {
      image_identifier      = var.image
      image_repository_type = "ECR"

      image_configuration {
        port                          = "3000"
        runtime_environment_variables = var.env

        runtime_environment_secrets = {
          GOOGLE_CLIENT_ID     = aws_secretsmanager_secret.google_client_id.arn
          GOOGLE_CLIENT_SECRET = aws_secretsmanager_secret.google_client_secret.arn
        }
      }
    }

    auto_deployments_enabled = true
  }

  network_configuration {
    egress_configuration {
      egress_type       = "VPC"
      vpc_connector_arn = aws_apprunner_vpc_connector.connector.arn
    }
  }

  instance_configuration {
    instance_role_arn = aws_iam_role.backend_instance_role.arn
    cpu               = "0.25 vCPU"
    memory            = "0.5 GB"
  }
}

resource "aws_apprunner_vpc_connector" "connector" {
  vpc_connector_name = "backend"

  subnets         = var.subnet_ids
  security_groups = [var.sg_id]

  lifecycle {
    create_before_destroy = true
  }
}
