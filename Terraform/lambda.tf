# Layer definition
resource "aws_lambda_layer_version" "rds" {
  filename         = data.archive_file.rds_layer.output_path
  layer_name       = "rds"
  compatible_runtimes = ["python3.12"]
  source_code_hash = data.archive_file.rds_layer.output_base64sha256
}

resource "aws_lambda_layer_version" "user_auth" {
  filename         = data.archive_file.user_auth_layer.output_path
  layer_name       = "user_auth"
  compatible_runtimes = ["python3.12"]
  source_code_hash = data.archive_file.user_auth_layer.output_base64sha256
}

# Local variables to be reused in multiple lambda functions
locals {
  # Used for lambda for each creation
  lambda_names = [
    # Athlete Lambdas
    "create_athlete",
    "accept_coach_invite",
    "get_coaches",
    "get_coach_invites",
    "input_times",
    "request_coach",
    "search_coaches",
    "update_athlete_profile",
    "view_coach_invites",
    "view_workout_inputs",
    "search_input_history_date",
    "decline_coach_invite",
    "remove_inputs",

    # Coach Lambdas
    "create_coach",
    "create_group",
    "accept_athlete_request",
    "add_athlete_to_group",
    "assign_group_workout_template",
    "create_workout_template",
    "delete_workout_template",
    "get_absent_group_athletes",
    "get_athletes",
    "get_workout_templates",
    "invite_athlete",
    "remove_group_athlete",
    "search_athletes",
    "update_coach_profile",
    "view_athlete_requests",
    "get_available_history_dates",
    "fetch_historical_data",
    "delete_group",
    "delete_group_workout",
    "assign_group_workout",
    "decline_athlete_request",

    # General Lambdas
    "get_athletes_for_group",
    "get_groups",
    "get_user",
    "remove_coach_athlete",
    "view_group_inputs",
    "get_group_workout",
    "get_pending_proposals",
    "mass_input",
  ]
}

resource "aws_lambda_function" "lambdas" {
  for_each = toset(local.lambda_names)

  function_name    = each.value
  role             = aws_iam_role.lambda_role.arn
  handler          = "${each.value}.${each.value}"
  runtime          = "python3.12"
  filename         = data.archive_file.lambda_archives[each.value].output_path
  source_code_hash = data.archive_file.lambda_archives[each.value].output_base64sha256
  depends_on       = [aws_iam_role_policy_attachment.lambda_rds_auth, aws_db_instance.default]
  layers           = [aws_lambda_layer_version.rds.arn, aws_lambda_layer_version.user_auth.arn]
  timeout          = 5

  environment {
    variables = {
      RDS_ENDPOINT = aws_db_instance.default.address
      RDS_DBNAME   = aws_db_instance.default.db_name
      RDS_USER     = aws_db_instance.default.username
      RDS_PORT     = aws_db_instance.default.port
      RDS_PASSWORD = aws_db_instance.default.password
      RDS_REGION   = var.aws_region
      ENVIRONMENT  = "production"
    }
  }

  vpc_config {
    subnet_ids         = [aws_subnet.private_subnet1.id, aws_subnet.private_subnet2.id]
    security_group_ids = [aws_security_group.lambda_sg.id]
  }
}