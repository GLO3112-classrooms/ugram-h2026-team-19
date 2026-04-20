output "vpc_id" {
  value = aws_vpc.this.id
}

output "public_subnet_ids" {
  value = [for s in aws_subnet.public : s.id]
}

output "private_subnet_ids" {
  value = [for s in aws_subnet.private : s.id]
}

output "app_sg_id" {
  value = aws_security_group.app_sg.id
}

output "public_route_table_ids" {
  value = [aws_route_table.public.id]
}

output "s3_endpoint_id" {
  value = aws_vpc_endpoint.s3.id
}
