variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the VPC"
}

variable "internet_cidr" {
  type        = string
  description = "CIDR block for all IPs"
}

variable "public_subnet_count" {
  type        = number
  default     = 2
  description = "Number of public subnets"
}

variable "region" {
  type        = string
  default     = "us-east-1"
  description = "AWS region"
}
