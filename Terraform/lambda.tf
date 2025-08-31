resource "aws_lambda_function" "get_groups" {
  function_name = "my_lambda_function"
  role         = aws_iam_role.lambda_role.arn
  handler     = "index.handler"
  runtime     = "nodejs14.x"

  source_code_hash = filebase64sha256("lambda.zip")

  environment {
    db_password = var.db_password
  }
}
