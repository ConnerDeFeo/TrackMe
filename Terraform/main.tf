// RDS instance
resource "aws_db_instance" "default" {
  identifier           = "trackmedb"
  engine               = "postgres"
  engine_version       = "17.5"
  instance_class       = "db.t3.micro"
  allocated_storage    = 20
  username             = "trackme_admin"
  password             = var.db_password
  db_name              = "trackme"
  skip_final_snapshot  = true
}

// IAM role for Lambda
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
      }
    ]
  })
}

// Attach AWSLambdaBasicExecutionRole so it can log to CloudWatch
resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

// Attach AWS managed RDS access policy
resource "aws_iam_role_policy_attachment" "lambda_rds_auth" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonRDSFullAccess"
}