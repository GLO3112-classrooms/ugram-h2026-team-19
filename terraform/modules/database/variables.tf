variable "postgres_db" {}
variable "postgres_user" {}
variable "postgres_password" {}

variable "vpc_id" {}

variable "private_subnet_ids" {
  type = list(string)
}

variable "sg_id" {}
