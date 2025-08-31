//Rds instance
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

//Iam role
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

//iam policies
resource "aws_iam_role_policy" "lambda_policy" {
  name   = "lambda_policy"
  role   = aws_iam_role.lambda_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
//IAM role policy attachment
resource "aws_iam_role_policy_attachment" "attach_iam_policy_to_iam_role" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.aws_iam_policy.arn
}

//Three Lambda Function directories
data "archive_file" "athlete_lambda_function" {
  type        = "zip"
  source_dir  = "${path.module}/../lambdas/athlete/"
  output_path = "${path.module}/../lambdas/athlete/athlete_lambda_function.zip"
}
data "archive_file" "coach_lambda_function" {
  type        = "zip"
  source_dir  = "${path.module}/../lambdas/coach/"
  output_path = "${path.module}/../lambdas/coach/coach_lambda_function.zip"
}
data "archive_file" "general_lambda_function" {
  type        = "zip"
  source_dir  = "${path.module}/../lambdas/general/"
  output_path = "${path.module}/../lambdas/general/general_lambda_function.zip"
}