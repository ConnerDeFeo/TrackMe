# Layer definition
resource "aws_lambda_layer_version" "rds" {
  filename         = data.archive_file.rds_layer.output_path
  layer_name       = "rds"
  compatible_runtimes = ["python3.12"]
  source_code_hash = data.archive_file.rds_layer.output_base64sha256
}

resource "aws_lambda_function" "create_athlete" {
  function_name    = "create_athlete"
  role             = aws_iam_role.lambda_role.arn
  handler          = "create_athlete.create_athlete"
  runtime          = "python3.12"
  filename         = data.archive_file.create_athlete.output_path
  source_code_hash = data.archive_file.create_athlete.output_base64sha256
  depends_on       = [aws_iam_role_policy_attachment.lambda_rds_auth, aws_db_instance.default]

  layers = [aws_lambda_layer_version.rds.arn]

  environment {
    variables = {
      RDS_ENDPOINT  = aws_db_instance.default.address
      RDS_DBNAME    = aws_db_instance.default.db_name
      RDS_USER      = aws_db_instance.default.username
      RDS_PORT      = aws_db_instance.default.port
      RDS_REGION    = var.aws_region
      ENVIRONMENT   = "production"
    }
  }
}