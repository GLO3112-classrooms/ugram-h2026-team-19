variable "postgres_db" {}
variable "postgres_user" {}
variable "postgres_password" {}

resource "aws_db_instance" "postgres" {
  engine         = "postgres"
  instance_class = "db.t3.micro"

  allocated_storage = 10

  db_name  = var.postgres_db
  username = var.postgres_user
  password = var.postgres_password

  publicly_accessible = true

  skip_final_snapshot = true
}

output "endpoint" {
  value = aws_db_instance.postgres.address
}
