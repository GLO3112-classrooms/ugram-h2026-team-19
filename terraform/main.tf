terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

module "ecr" {
  source = "./modules/ecr"
}

module "vpc" {
  source = "./modules/vpc"

  public_subnet_count = 2
  region              = var.aws_region
  vpc_cidr            = var.vpc_cidr
  internet_cidr       = var.internet_cidr
}

module "database" {
  source = "./modules/database"

  postgres_db       = var.postgres_db
  postgres_user     = var.postgres_user
  postgres_password = var.postgres_password
  vpc_id            = module.vpc.vpc_id
  subnet_ids        = module.vpc.private_subnet_ids
  sg_id             = module.vpc.app_sg_id
}

module "redis" {
  source     = "./modules/redis"
  subnet_ids = module.vpc.private_subnet_ids
  sg_id      = module.vpc.app_sg_id
}

module "storage" {
  source = "./modules/storage"
}

module "backend" {
  source = "./modules/apprunner-backend"

  service_name = "backend"
  image        = module.ecr.backend_url

  subnet_ids = module.vpc.private_subnet_ids
  sg_id      = module.vpc.app_sg_id

  google_client_id     = var.google_client_id
  google_client_secret = var.google_client_secret

  env = {
    POSTGRES_USER     = var.postgres_user
    POSTGRES_PASSWORD = var.postgres_password
    POSTGRES_DB       = var.postgres_db
    PGHOST            = module.database.endpoint

    REDIS_HOST = module.redis.endpoint

    S3_BUCKET   = module.storage.bucket
    S3_REGION   = var.aws_region
    S3_ENDPOINT = "https://s3.${var.aws_region}.amazonaws.com"

    DATABASE_URL = "postgresql://${var.postgres_user}:${var.postgres_password}@${module.database.endpoint}:5432/${var.postgres_db}?sslmode=verify-full&sslrootcert=/certs/global-bundle.pem"

    JWT_SECRET     = var.jwt_secret
    JWT_EXPIRES_IN = var.jwt_expires_in

    STATIC_ORIGIN       = "https://2mwpsg4nxd.${var.aws_region}.awsapprunner.com"
    GOOGLE_CALLBACK_URL = "https://ujumf5vnfq.${var.aws_region}.awsapprunner.com/auth/google/callback"
  }
}

module "frontend" {
  source = "./modules/apprunner-frontend"

  service_name = "frontend"
  image        = module.ecr.frontend_url

  subnet_ids = module.vpc.public_subnet_ids
  sg_id      = module.vpc.app_sg_id

  env = {
    API_URL         = "https://${module.backend.url}"
    PUBLIC_API_URL  = "https://${module.backend.url}"
    FRONTEND_ORIGIN = "https://ujumf5vnfq.${var.aws_region}.awsapprunner.com"
    BODY_SIZE_LIMIT = "50M"
  }
}
