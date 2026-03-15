output "backend_url" {
  value       = aws_lb.backend.dns_name
  description = "Public URL of the backend through the ALB"
}

output "frontend_url" {
  value       = aws_lb.frontend.dns_name
  description = "Public URL of the frontend through the ALB"
}
