resource "aws_s3_bucket" "app_bucket" {
  bucket = "ugram-app-bucket-e19-2026"
}

resource "aws_iam_user" "s3_user" {
  name = "app-s3-user"
}

resource "aws_iam_access_key" "s3_key" {
  user = aws_iam_user.s3_user.name
}

resource "aws_iam_user_policy" "s3_policy" {
  user = aws_iam_user.s3_user.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action   = ["s3:*"]
      Effect   = "Allow"
      Resource = "*"
    }]
  })
}
