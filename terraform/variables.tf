variable "postgres_db" {
  type        = string
  description = "PostgreSQL database name"
}

variable "postgres_user" {
  type        = string
  description = "PostgreSQL username"
}

variable "postgres_password" {
  type        = string
  description = "PostgreSQL password"
  sensitive   = true
}

variable "ghcr_username" {
  type        = string
  description = "GitHub username for GHCR"
}

variable "ghcr_pat" {
  type        = string
  description = "GitHub Personal Access Token for GHCR"
  sensitive   = true
}

variable "jwt_secret" {
  type        = string
  sensitive   = true
  description = "The JWT secret used by the backend to sign tokens"
}

variable "jwt_expires_in" {
  type        = string
  description = "The time to live for a JWT token (ex: 12h, 1d, ...)"
}

variable "static_origin" {
  type        = string
  description = "The static origin used by the backend to compute static media URL"
}
