resource "aws_lambda_function" "create_coach" {
  function_name    = "create_coach"
  role             = local.lambda_common_config.role
  handler          = "create_coach.create_coach"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.create_coach.output_path
  source_code_hash = data.archive_file.create_coach.output_base64sha256
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

resource "aws_lambda_function" "create_group" {
  function_name    = "create_group"
  role             = local.lambda_common_config.role
  handler          = "create_group.create_group"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.create_group.output_path
  source_code_hash = data.archive_file.create_group.output_base64sha256
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