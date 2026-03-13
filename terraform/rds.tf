resource "aws_db_instance" "postgres" {
  engine         = "postgres"
  instance_class = "db.t3.micro"

  allocated_storage = 10

  db_name  = var.postgres_db
  username = var.postgres_user
  password = var.postgres_password

  vpc_security_group_ids = [aws_security_group.postgres.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  publicly_accessible = false

  skip_final_snapshot = true
}

resource "aws_db_subnet_group" "main" {
  subnet_ids = [aws_subnet.private_a.id, aws_subnet.private_b.id]
}

resource "aws_security_group_rule" "rds_ingress_from_ecs" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = aws_security_group.postgres.id
  source_security_group_id = aws_security_group.ecs.id
}
