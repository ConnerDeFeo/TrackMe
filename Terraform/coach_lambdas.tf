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

resource "aws_lambda_function" "accept_athlete_request" {
  function_name    = "accept_athlete_request"
  role             = local.lambda_common_config.role
  handler          = "accept_athlete_request.accept_athlete_request"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.accept_athlete_request.output_path
  source_code_hash = data.archive_file.accept_athlete_request.output_base64sha256
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

resource "aws_lambda_function" "add_athlete_to_group" {
  function_name    = "add_athlete_to_group"
  role             = local.lambda_common_config.role
  handler          = "add_athlete_to_group.add_athlete_to_group"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.add_athlete_to_group.output_path
  source_code_hash = data.archive_file.add_athlete_to_group.output_base64sha256
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

resource "aws_lambda_function" "assign_group_workout" {
  function_name    = "assign_group_workout"
  role             = local.lambda_common_config.role
  handler          = "assign_group_workout.assign_group_workout"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.assign_group_workout.output_path
  source_code_hash = data.archive_file.assign_group_workout.output_base64sha256
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

resource "aws_lambda_function" "create_workout" {
  function_name    = "create_workout"
  role             = local.lambda_common_config.role
  handler          = "create_workout.create_workout"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.create_workout.output_path
  source_code_hash = data.archive_file.create_workout.output_base64sha256
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

resource "aws_lambda_function" "delete_workout" {
  function_name    = "delete_workout"
  role             = local.lambda_common_config.role
  handler          = "delete_workout.delete_workout"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.delete_workout.output_path
  source_code_hash = data.archive_file.delete_workout.output_base64sha256
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

resource "aws_lambda_function" "get_absent_group_athletes" {
  function_name    = "get_absent_group_athletes"
  role             = local.lambda_common_config.role
  handler          = "get_absent_group_athletes.get_absent_group_athletes"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.get_absent_group_athletes.output_path
  source_code_hash = data.archive_file.get_absent_group_athletes.output_base64sha256
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

resource "aws_lambda_function" "get_athletes" {
  function_name    = "get_athletes"
  role             = local.lambda_common_config.role
  handler          = "get_athletes.get_athletes"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.get_athletes.output_path
  source_code_hash = data.archive_file.get_athletes.output_base64sha256
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

resource "aws_lambda_function" "get_group_workout" {
  function_name    = "get_group_workout"
  role             = local.lambda_common_config.role
  handler          = "get_group_workout.get_group_workout"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.get_group_workout.output_path
  source_code_hash = data.archive_file.get_group_workout.output_base64sha256
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

resource "aws_lambda_function" "get_workouts" {
  function_name    = "get_workouts"
  role             = local.lambda_common_config.role
  handler          = "get_workouts.get_workouts"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.get_workouts.output_path
  source_code_hash = data.archive_file.get_workouts.output_base64sha256
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

resource "aws_lambda_function" "invite_athlete" {
  function_name    = "invite_athlete"
  role             = local.lambda_common_config.role
  handler          = "invite_athlete.invite_athlete"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.invite_athlete.output_path
  source_code_hash = data.archive_file.invite_athlete.output_base64sha256
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

resource "aws_lambda_function" "remove_group_athlete" {
  function_name    = "remove_group_athlete"
  role             = local.lambda_common_config.role
  handler          = "remove_group_athlete.remove_group_athlete"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.remove_group_athlete.output_path
  source_code_hash = data.archive_file.remove_group_athlete.output_base64sha256
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

resource "aws_lambda_function" "search_athletes" {
  function_name    = "search_athletes"
  role             = local.lambda_common_config.role
  handler          = "search_athletes.search_athletes"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.search_athletes.output_path
  source_code_hash = data.archive_file.search_athletes.output_base64sha256
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

resource "aws_lambda_function" "update_coach_profile" {
  function_name    = "update_coach_profile"
  role             = local.lambda_common_config.role
  handler          = "update_coach_profile.update_coach_profile"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.update_coach_profile.output_path
  source_code_hash = data.archive_file.update_coach_profile.output_base64sha256
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

resource "aws_lambda_function" "view_athlete_requests" {
  function_name    = "view_athlete_requests"
  role             = local.lambda_common_config.role
  handler          = "view_athlete_requests.view_athlete_requests"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.view_athlete_requests.output_path
  source_code_hash = data.archive_file.view_athlete_requests.output_base64sha256
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