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

resource "aws_lambda_function" "accept_coach_invite" {
  function_name    = "accept_coach_invite"
  role             = local.lambda_common_config.role
  handler          = "accept_coach_invite.accept_coach_invite"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.accept_coach_invite.output_path
  source_code_hash = data.archive_file.accept_coach_invite.output_base64sha256
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

resource "aws_lambda_function" "get_coaches" {
  function_name    = "get_coaches"
  role             = local.lambda_common_config.role
  handler          = "get_coaches.get_coaches"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.get_coaches.output_path
  source_code_hash = data.archive_file.get_coaches.output_base64sha256
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

resource "aws_lambda_function" "get_coach_requests" {
  function_name    = "get_coach_requests"
  role             = local.lambda_common_config.role
  handler          = "get_coach_requests.get_coach_requests"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.get_coach_requests.output_path
  source_code_hash = data.archive_file.get_coach_requests.output_base64sha256
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

resource "aws_lambda_function" "input_times" {
  function_name    = "input_times"
  role             = local.lambda_common_config.role
  handler          = "input_times.input_times"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.input_times.output_path
  source_code_hash = data.archive_file.input_times.output_base64sha256
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

resource "aws_lambda_function" "request_coach" {
  function_name    = "request_coach"
  role             = local.lambda_common_config.role
  handler          = "request_coach.request_coach"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.request_coach.output_path
  source_code_hash = data.archive_file.request_coach.output_base64sha256
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

resource "aws_lambda_function" "search_coaches" {
  function_name    = "search_coaches"
  role             = local.lambda_common_config.role
  handler          = "search_coaches.search_coaches"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.search_coaches.output_path
  source_code_hash = data.archive_file.search_coaches.output_base64sha256
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

resource "aws_lambda_function" "update_athlete_profile" {
  function_name    = "update_athlete_profile"
  role             = local.lambda_common_config.role
  handler          = "update_athlete_profile.update_athlete_profile"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.update_athlete_profile.output_path
  source_code_hash = data.archive_file.update_athlete_profile.output_base64sha256
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

resource "aws_lambda_function" "view_coach_invites" {
  function_name    = "view_coach_invites"
  role             = local.lambda_common_config.role
  handler          = "view_coach_invites.view_coach_invites"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.view_coach_invites.output_path
  source_code_hash = data.archive_file.view_coach_invites.output_base64sha256
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

resource "aws_lambda_function" "view_workouts_athlete" {
  function_name    = "view_workouts_athlete"
  role             = local.lambda_common_config.role
  handler          = "view_workouts_athlete.view_workouts_athlete"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.view_workouts_athlete.output_path
  source_code_hash = data.archive_file.view_workouts_athlete.output_base64sha256
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

resource "aws_lambda_function" "view_workout_inputs" {
  function_name    = "view_workout_inputs"
  role             = local.lambda_common_config.role
  handler          = "view_workout_inputs.view_workout_inputs"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.view_workout_inputs.output_path
  source_code_hash = data.archive_file.view_workout_inputs.output_base64sha256
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

