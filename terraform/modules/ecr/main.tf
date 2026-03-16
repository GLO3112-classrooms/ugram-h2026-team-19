resource "aws_ecr_repository" "backend" {
  name = "ugram-backend"
}

resource "aws_ecr_repository" "frontend" {
  name = "ugram-frontend"
}

output "backend_url" {
  value = "${aws_ecr_repository.backend.repository_url}:latest"
}

output "frontend_url" {
  value = "${aws_ecr_repository.frontend.repository_url}:latest"
}
