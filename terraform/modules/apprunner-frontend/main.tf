resource "aws_iam_role" "frontend_apprunner_ecr_access" {
  name = "frontend-apprunner-ecr-access"

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

resource "aws_iam_role_policy_attachment" "frontend_apprunner_ecr_policy" {
  role       = aws_iam_role.frontend_apprunner_ecr_access.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}

resource "aws_apprunner_auto_scaling_configuration_version" "frontend_single_threaded" {
  auto_scaling_configuration_name = "${var.service_name}-as-config"

  max_concurrency = 1

  min_size = 1
  max_size = 2
}

resource "aws_apprunner_service" "frontend" {
  service_name = var.service_name

  auto_scaling_configuration_arn = aws_apprunner_auto_scaling_configuration_version.frontend_single_threaded.arn

  source_configuration {
    authentication_configuration {
      access_role_arn = aws_iam_role.frontend_apprunner_ecr_access.arn
    }

    image_repository {
      image_identifier      = var.image
      image_repository_type = "ECR"

      image_configuration {
        port                          = "8080"
        runtime_environment_variables = var.env
      }
    }

    auto_deployments_enabled = true
  }

  instance_configuration {
    cpu    = "0.25 vCPU"
    memory = "0.5 GB"
  }
}

resource "aws_apprunner_custom_domain_association" "ugram_zowks_fr" {
  service_arn = aws_apprunner_service.frontend.arn
  domain_name = "ugram.zowks.fr"
}

resource "aws_apprunner_custom_domain_association" "ugram_whsh_dev" {
  service_arn = aws_apprunner_service.frontend.arn
  domain_name = "ugram.whsh.dev"
}
