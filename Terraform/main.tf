resource "aws_db_instance" "default" {
  identifier = "trackmedb"
  engine     = "postgres"
  username   = "ConnerDeFeo"
  engine_version = "17.5"
  password   = var.db_password
  db_name    = "trackme"
  instance_class = "db.t3.micro"
  allocated_storage = 20

  skip_final_snapshot = false
  final_snapshot_identifier = "trackmedb-final-snapshot"
}

resource "aws_iam_role" "lambda_role" {
  name = "lambda_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Effect = "Allow"
        Sid    = ""
      }
    ]
  })
}