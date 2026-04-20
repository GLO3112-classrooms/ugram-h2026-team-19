resource "aws_ecr_repository" "backend" {
  name         = "ugram-backend"
  force_delete = true
}

resource "aws_ecr_repository" "frontend" {
  name         = "ugram-frontend"
  force_delete = true
}

output "backend_url" {
  value = "${aws_ecr_repository.backend.repository_url}:latest"
}

output "frontend_url" {
  value = "${aws_ecr_repository.frontend.repository_url}:latest"
}
