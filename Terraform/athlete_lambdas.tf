resource "aws_lambda_function" "create_athlete" {
  function_name    = "create_athlete"
  role             = local.lambda_common_config.role
  handler          = "create_athlete.create_athlete"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.create_athlete.output_path
  source_code_hash = data.archive_file.create_athlete.output_base64sha256
  depends_on       = [aws_iam_role_policy_attachment.lambda_rds_auth, aws_db_instance.default]
  layers           = local.lambda_common_config.layers
  timeout          = local.lambda_common_config.timeout

  environment {
    variables = local.lambda_environment_variables
  }

  vpc_config {
    subnet_ids         = local.lambda_vpc_config.subnet_ids
    security_group_ids = local.lambda_vpc_config.security_group_ids
  }
}