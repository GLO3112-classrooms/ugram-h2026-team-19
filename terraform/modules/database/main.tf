resource "aws_db_subnet_group" "main" {
  name       = "db-subnet-group"
  subnet_ids = var.private_subnet_ids
}

resource "aws_db_instance" "postgres" {
  engine         = "postgres"
  instance_class = "db.t3.micro"

  allocated_storage = 10

  db_name  = var.postgres_db
  username = var.postgres_user
  password = var.postgres_password

  publicly_accessible    = true
  skip_final_snapshot    = true
  vpc_security_group_ids = [var.sg_id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
}
