resource "aws_s3_bucket" "app_bucket" {
  bucket        = "ugram-app-bucket-e19-2026"
  force_destroy = true
}

output "bucket" {
  value = aws_s3_bucket.app_bucket.bucket
}