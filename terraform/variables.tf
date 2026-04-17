variable "aws_region" {
  type        = string
  default     = "us-east-1"
  description = "The AWS region to deploy into"
}

variable "vpc_cidr" {
  type        = string
  default     = "10.0.0.0/16"
  description = "The base CIDR block for the VPC"
}

variable "internet_cidr" {
  type        = string
  default     = "0.0.0.0/0"
  description = "CIDR block representing all internet traffic"
}

variable "postgres_db" {
  type        = string
  description = "PostgreSQL database name"
}

variable "postgres_user" {
  type        = string
  description = "PostgreSQL username"
}

variable "postgres_password" {
  type        = string
  description = "PostgreSQL password"
  sensitive   = true
}

variable "jwt_secret" {
  type        = string
  sensitive   = true
  description = "The JWT secret used by the backend to sign tokens"
}

variable "jwt_expires_in" {
  type        = string
  description = "The time to live for a JWT token (ex: 12h, 1d, ...)"
}

variable "google_client_id" {
  type        = string
  sensitive   = true
  description = "Google OAuth2.0 client credential"
}

variable "google_client_secret" {
  type        = string
  sensitive   = true
  description = "Google OAuth2.0 secret credential"
}
