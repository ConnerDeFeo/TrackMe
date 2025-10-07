# Default VPC and availability zones for the AWS account
data "aws_vpc" "default" {
  default = true
}

# Default iternet gateway for the default VPC in the AWS account
data "aws_internet_gateway" "default" {
  filter {
    name   = "attachment.vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# Get the available availability zones in the default region for subnet creation
data "aws_availability_zones" "available" {
  state = "available"
}

# Default security group 
data "aws_security_group" "default" {
  name   = "default"
  vpc_id = data.aws_vpc.default.id
}

# Rds layer for lambda functions to connect to RDS database
data "archive_file" "rds_layer" {
  type        = "zip"
  source_dir  = "${path.module}/../Server/layers/rds/"
  output_path = "${path.module}/../Server/layers/rds/rds.zip"
}

data "archive_file" "user_auth_layer" {
  type        = "zip"
  source_dir  = "${path.module}/../Server/layers/user_auth/"
  output_path = "${path.module}/../Server/layers/user_auth/user_auth.zip"
}

# Mapping lambda function names to their locations for archive creation
locals {
  lambda_function_locations = {
    
    # Athlete Lambdas
    "input_times" = {
      source_dir  = "${path.module}/../Server/lambdas/athlete/input_times"
      output_path = "${path.module}/../Server/lambdas/athlete/zips/input_times.zip"
    }
    "view_workout_inputs" = {
      source_dir  = "${path.module}/../Server/lambdas/athlete/view_workout_inputs"
      output_path = "${path.module}/../Server/lambdas/athlete/zips/view_workout_inputs.zip"
    }
    "search_input_history_date" = {
      source_dir  = "${path.module}/../Server/lambdas/athlete/search_input_history_date"
      output_path = "${path.module}/../Server/lambdas/athlete/zips/search_input_history_date.zip"
    }
    "remove_inputs" = {
      source_dir  = "${path.module}/../Server/lambdas/athlete/remove_inputs"
      output_path = "${path.module}/../Server/lambdas/athlete/zips/remove_inputs.zip"
    }
    
    # Coach Lambdas
    "create_group" = {
      source_dir  = "${path.module}/../Server/lambdas/coach/create_group"
      output_path = "${path.module}/../Server/lambdas/coach/zips/create_group.zip"
    }
    "add_athlete_to_group" = {
      source_dir  = "${path.module}/../Server/lambdas/coach/add_athlete_to_group"
      output_path = "${path.module}/../Server/lambdas/coach/zips/add_athlete_to_group.zip"
    }
    "assign_group_workout_template" = {
      source_dir  = "${path.module}/../Server/lambdas/coach/assign_group_workout_template"
      output_path = "${path.module}/../Server/lambdas/coach/zips/assign_group_workout_template.zip"
    }
    "create_workout_template" = {
      source_dir  = "${path.module}/../Server/lambdas/coach/create_workout_template"
      output_path = "${path.module}/../Server/lambdas/coach/zips/create_workout_template.zip"
    }
    "delete_workout_template" = {
      source_dir  = "${path.module}/../Server/lambdas/coach/delete_workout_template"
      output_path = "${path.module}/../Server/lambdas/coach/zips/delete_workout_template.zip"
    }
    "get_absent_group_athletes" = {
      source_dir  = "${path.module}/../Server/lambdas/coach/get_absent_group_athletes"
      output_path = "${path.module}/../Server/lambdas/coach/zips/get_absent_group_athletes.zip"
    }
    "get_workout_templates" = {
      source_dir  = "${path.module}/../Server/lambdas/coach/get_workout_templates"
      output_path = "${path.module}/../Server/lambdas/coach/zips/get_workout_templates.zip"
    }
    "remove_group_athlete" = {
      source_dir  = "${path.module}/../Server/lambdas/coach/remove_group_athlete"
      output_path = "${path.module}/../Server/lambdas/coach/zips/remove_group_athlete.zip"
    }
    "get_available_history_dates" = {
      source_dir  = "${path.module}/../Server/lambdas/coach/get_available_history_dates"
      output_path = "${path.module}/../Server/lambdas/coach/zips/get_available_history_dates.zip"
    }
    "fetch_historical_data" = {
      source_dir  = "${path.module}/../Server/lambdas/coach/fetch_historical_data"
      output_path = "${path.module}/../Server/lambdas/coach/zips/fetch_historical_data.zip"
    }
    "delete_group" = {
      source_dir  = "${path.module}/../Server/lambdas/coach/delete_group"
      output_path = "${path.module}/../Server/lambdas/coach/zips/delete_group.zip"
    }
    "delete_group_workout" = {
      source_dir  = "${path.module}/../Server/lambdas/coach/delete_group_workout"
      output_path = "${path.module}/../Server/lambdas/coach/zips/delete_group_workout.zip"
    }
    "assign_group_workout" = {
      source_dir  = "${path.module}/../Server/lambdas/coach/assign_group_workout"
      output_path = "${path.module}/../Server/lambdas/coach/zips/assign_group_workout.zip"
    }
    "bedrock_workout_generation" = {
      source_dir  = "${path.module}/../Server/lambdas/coach/bedrock_workout_generation"
      output_path = "${path.module}/../Server/lambdas/coach/zips/bedrock_workout_generation.zip"
    }

    # General Lambdas
    "get_athletes_for_group" = {
      source_dir  = "${path.module}/../Server/lambdas/general/get_athletes_for_group"
      output_path = "${path.module}/../Server/lambdas/general/zips/get_athletes_for_group.zip"
    }
    "get_groups" = {
      source_dir  = "${path.module}/../Server/lambdas/general/get_groups"
      output_path = "${path.module}/../Server/lambdas/general/zips/get_groups.zip"
    }
    "get_user" = {
      source_dir  = "${path.module}/../Server/lambdas/general/get_user"
      output_path = "${path.module}/../Server/lambdas/general/zips/get_user.zip"
    }
    "view_group_inputs" = {
      source_dir  = "${path.module}/../Server/lambdas/general/view_group_inputs"
      output_path = "${path.module}/../Server/lambdas/general/zips/view_group_inputs.zip"
    }
    "get_group_workout" = {
      source_dir  = "${path.module}/../Server/lambdas/general/get_group_workout"
      output_path = "${path.module}/../Server/lambdas/general/zips/get_group_workout.zip"
    }
    "mass_input" = {
      source_dir  = "${path.module}/../Server/lambdas/general/mass_input"
      output_path = "${path.module}/../Server/lambdas/general/zips/mass_input.zip"
    }
    "get_weekly_schedule" = {
      source_dir  = "${path.module}/../Server/lambdas/general/get_weekly_schedule"
      output_path = "${path.module}/../Server/lambdas/general/zips/get_weekly_schedule.zip"
    }
    "create_user" = {
      source_dir  = "${path.module}/../Server/lambdas/general/create_user"
      output_path = "${path.module}/../Server/lambdas/general/zips/create_user.zip"
    }
    "update_user_profile" = {
      source_dir  = "${path.module}/../Server/lambdas/general/update_user_profile"
      output_path = "${path.module}/../Server/lambdas/general/zips/update_user_profile.zip"
    }

    # Relations Lambdas
    "add_relation" = {
      source_dir  = "${path.module}/../Server/lambdas/relations/add_relation"
      output_path = "${path.module}/../Server/lambdas/relations/zips/add_relation.zip"
    }
    "get_relation_invites" = {
      source_dir  = "${path.module}/../Server/lambdas/relations/get_relation_invites"
      output_path = "${path.module}/../Server/lambdas/relations/zips/get_relation_invites.zip"
    }
    "search_user_relation" = {
      source_dir  = "${path.module}/../Server/lambdas/relations/search_user_relation"
      output_path = "${path.module}/../Server/lambdas/relations/zips/search_user_relation.zip"
    }
    "get_mutual_user_relations" = {
      source_dir  = "${path.module}/../Server/lambdas/relations/get_mutual_user_relations"
      output_path = "${path.module}/../Server/lambdas/relations/zips/get_mutual_user_relations.zip"
    }
    "remove_user_relation" = {
      source_dir  = "${path.module}/../Server/lambdas/relations/remove_user_relation"
      output_path = "${path.module}/../Server/lambdas/relations/zips/remove_user_relation.zip"
    }
    "get_relation_invites_count" = {
      source_dir  = "${path.module}/../Server/lambdas/relations/get_relation_invites_count"
      output_path = "${path.module}/../Server/lambdas/relations/zips/get_relation_invites_count.zip"
    }
  }
}

# Archive files using for_each
data "archive_file" "lambda_archives" {
  for_each = local.lambda_function_locations
  
  type        = "zip"
  source_dir  = each.value.source_dir
  output_path = each.value.output_path
}
