output "vpc_id" {
  value = aws_vpc.main.id
}

output "private_subnet_ids" {
  value = aws_subnet.private[*].id
}

output "app_sg_id" {
  value = aws_security_group.app_sg.id
}