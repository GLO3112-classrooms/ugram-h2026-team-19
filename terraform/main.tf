terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

module "ecr" {
  source = "./modules/ecr"
}

module "vpc" {
  source = "./modules/vpc"
}

module "database" {
  source = "./modules/database"

  postgres_db        = var.postgres_db
  postgres_user      = var.postgres_user
  postgres_password  = var.postgres_password
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  sg_id              = module.vpc.app_sg_id
}

module "redis" {
  source             = "./modules/redis"
  private_subnet_ids = module.vpc.private_subnet_ids
  sg_id              = module.vpc.app_sg_id
}

module "storage" {
  source = "./modules/storage"
}

module "backend" {
  source = "./modules/apprunner-backend"

  service_name = "backend-v2"
  image        = module.ecr.backend_url

  private_subnet_ids = module.vpc.private_subnet_ids
  sg_id              = module.vpc.app_sg_id

  env = {
    POSTGRES_USER     = var.postgres_user
    POSTGRES_PASSWORD = var.postgres_password
    POSTGRES_DB       = var.postgres_db
    PGHOST            = module.database.endpoint

    REDIS_HOST = module.redis.endpoint

    S3_BUCKET            = module.storage.bucket
    S3_ACCESS_KEY_ID     = "dummy"
    S3_SECRET_ACCESS_KEY = "dummy"
    S3_REGION            = "us-east-1"
    S3_ENDPOINT          = "https://s3.us-east-1.amazonaws.com"

    DATABASE_URL = "postgresql://${var.postgres_user}:${var.postgres_password}@${module.database.endpoint}:5432/${var.postgres_db}?sslmode=verify-full&sslrootcert=/certs/global-bundle.pem"

    JWT_SECRET     = var.jwt_secret
    JWT_EXPIRES_IN = var.jwt_expires_in

    STATIC_ORIGIN = "http://placeholder"
  }
}

module "frontend" {
  source = "./modules/apprunner-frontend"

  service_name = "frontend-v2"
  image        = module.ecr.frontend_url

  private_subnet_ids = module.vpc.private_subnet_ids
  sg_id              = module.vpc.app_sg_id

  env = {
    API_URL        = module.backend.url
    PUBLIC_API_URL = module.backend.url
  }
}
