resource "aws_lambda_function" "get_athletes_for_group" {
  function_name    = "get_athletes_for_group"
  role             = local.lambda_common_config.role
  handler          = "get_athletes_for_group.get_athletes_for_group"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.get_athletes_for_group.output_path
  source_code_hash = data.archive_file.get_athletes_for_group.output_base64sha256
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

resource "aws_lambda_function" "get_groups" {
  function_name    = "get_groups"
  role             = local.lambda_common_config.role
  handler          = "get_groups.get_groups"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.get_groups.output_path
  source_code_hash = data.archive_file.get_groups.output_base64sha256
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

resource "aws_lambda_function" "get_user" {
  function_name    = "get_user"
  role             = local.lambda_common_config.role
  handler          = "get_user.get_user"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.get_user.output_path
  source_code_hash = data.archive_file.get_user.output_base64sha256
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

resource "aws_lambda_function" "remove_coach_athlete" {
  function_name    = "remove_coach_athlete"
  role             = local.lambda_common_config.role
  handler          = "remove_coach_athlete.remove_coach_athlete"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.remove_coach_athlete.output_path
  source_code_hash = data.archive_file.remove_coach_athlete.output_base64sha256
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

resource "aws_lambda_function" "view_group_inputs" {
  function_name    = "view_group_inputs"
  role             = local.lambda_common_config.role
  handler          = "view_group_inputs.view_group_inputs"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.view_group_inputs.output_path
  source_code_hash = data.archive_file.view_group_inputs.output_base64sha256
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
