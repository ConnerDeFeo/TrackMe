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
    "input_times",
    "remove_inputs",
    "view_workout_inputs",

    # Coach Lambdas
    "create_group",
    "add_athlete_to_group",
    "get_absent_group_athletes",
    "remove_group_athlete",
    "delete_group",
    "update_group_athletes",

    # Workout Lambdas
    "create_section_template",
    "get_section_template",
    "preview_section_templates",
    "get_workout",
    "delete_group_workout",
    "assign_group_workout",
    "assign_group_workout_template",
    "create_workout_template",
    "delete_workout_template",
    "get_workout_templates",
    "delete_section_template",

    # General Lambdas
    "get_athletes_for_group",
    "get_groups",
    "get_user",
    "get_group_workout",
    "mass_input",
    "get_weekly_schedule",
    "create_user",
    "update_user_profile",

    # History Lambdas
    "get_available_history_dates",
    "fetch_historical_data",

    # Relation lambdas,
    "get_relation_invites",
    "search_user_relation",
    "add_relation",
    "remove_user_relation",
    "get_mutual_user_relations",
    "get_relation_invites_count",
    "get_mutual_athletes",
  ]
  public_lambda_names = [
    "bedrock_workout_generation",
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

resource "aws_lambda_function" "public_lambdas" {
  for_each = toset(local.public_lambda_names)

  function_name    = each.value
  role             = aws_iam_role.lambda_role.arn
  handler          = "${each.value}.${each.value}"
  runtime          = "python3.12"
  filename         = data.archive_file.lambda_archives[each.value].output_path
  source_code_hash = data.archive_file.lambda_archives[each.value].output_base64sha256
  layers           = [aws_lambda_layer_version.user_auth.arn]
  timeout          = 5

  environment {
    variables = {
      RDS_REGION   = var.aws_region
      ENVIRONMENT  = "production"
    }
  }
}