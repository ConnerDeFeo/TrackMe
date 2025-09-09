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

# Mapping lambda function names to their locations for archive creation
locals {
  lambda_function_locations = {
    # Core functions
    "create_athlete" = {
      source_dir  = "${path.module}/../Server/lambdas/athlete/create_athlete"
      output_path = "${path.module}/../Server/lambdas/athlete/zips/create_athlete.zip"
    }
    "create_coach" = {
      source_dir  = "${path.module}/../Server/lambdas/coach/create_coach"
      output_path = "${path.module}/../Server/lambdas/coach/zips/create_coach.zip"
    }
    "create_group" = {
      source_dir  = "${path.module}/../Server/lambdas/coach/create_group"
      output_path = "${path.module}/../Server/lambdas/coach/zips/create_group.zip"
    }
    
    # Athlete Lambdas
    "accept_coach_invite" = {
      source_dir  = "${path.module}/../Server/lambdas/athlete/accept_coach_invite"
      output_path = "${path.module}/../Server/lambdas/athlete/zips/accept_coach_invite.zip"
    }
    "get_coaches" = {
      source_dir  = "${path.module}/../Server/lambdas/athlete/get_coaches"
      output_path = "${path.module}/../Server/lambdas/athlete/zips/get_coaches.zip"
    }
    "get_coach_requests" = {
      source_dir  = "${path.module}/../Server/lambdas/athlete/get_coach_requests"
      output_path = "${path.module}/../Server/lambdas/athlete/zips/get_coach_requests.zip"
    }
    "input_times" = {
      source_dir  = "${path.module}/../Server/lambdas/athlete/input_times"
      output_path = "${path.module}/../Server/lambdas/athlete/zips/input_times.zip"
    }
    "request_coach" = {
      source_dir  = "${path.module}/../Server/lambdas/athlete/request_coach"
      output_path = "${path.module}/../Server/lambdas/athlete/zips/request_coach.zip"
    }
    "search_coaches" = {
      source_dir  = "${path.module}/../Server/lambdas/athlete/search_coaches"
      output_path = "${path.module}/../Server/lambdas/athlete/zips/search_coaches.zip"
    }
    "update_athlete_profile" = {
      source_dir  = "${path.module}/../Server/lambdas/athlete/update_athlete_profile"
      output_path = "${path.module}/../Server/lambdas/athlete/zips/update_athlete_profile.zip"
    }
    "view_coach_invites" = {
      source_dir  = "${path.module}/../Server/lambdas/athlete/view_coach_invites"
      output_path = "${path.module}/../Server/lambdas/athlete/zips/view_coach_invites.zip"
    }
    "view_workouts_athlete" = {
      source_dir  = "${path.module}/../Server/lambdas/athlete/view_workouts_athlete"
      output_path = "${path.module}/../Server/lambdas/athlete/zips/view_workouts_athlete.zip"
    }
    "view_workout_inputs" = {
      source_dir  = "${path.module}/../Server/lambdas/athlete/view_workout_inputs"
      output_path = "${path.module}/../Server/lambdas/athlete/zips/view_workout_inputs.zip"
    }
    "search_input_history_date" = {
      source_dir  = "${path.module}/../Server/lambdas/athlete/search_input_history_date"
      output_path = "${path.module}/../Server/lambdas/athlete/zips/search_input_history_date.zip"
    }
    
    # Coach Lambdas
    "accept_athlete_request" = {
      source_dir  = "${path.module}/../Server/lambdas/coach/accept_athlete_request"
      output_path = "${path.module}/../Server/lambdas/coach/zips/accept_athlete_request.zip"
    }
    "add_athlete_to_group" = {
      source_dir  = "${path.module}/../Server/lambdas/coach/add_athlete_to_group"
      output_path = "${path.module}/../Server/lambdas/coach/zips/add_athlete_to_group.zip"
    }
    "assign_group_workout" = {
      source_dir  = "${path.module}/../Server/lambdas/coach/assign_group_workout"
      output_path = "${path.module}/../Server/lambdas/coach/zips/assign_group_workout.zip"
    }
    "create_workout" = {
      source_dir  = "${path.module}/../Server/lambdas/coach/create_workout"
      output_path = "${path.module}/../Server/lambdas/coach/zips/create_workout.zip"
    }
    "delete_workout" = {
      source_dir  = "${path.module}/../Server/lambdas/coach/delete_workout"
      output_path = "${path.module}/../Server/lambdas/coach/zips/delete_workout.zip"
    }
    "get_absent_group_athletes" = {
      source_dir  = "${path.module}/../Server/lambdas/coach/get_absent_group_athletes"
      output_path = "${path.module}/../Server/lambdas/coach/zips/get_absent_group_athletes.zip"
    }
    "get_athletes" = {
      source_dir  = "${path.module}/../Server/lambdas/coach/get_athletes"
      output_path = "${path.module}/../Server/lambdas/coach/zips/get_athletes.zip"
    }
    "get_group_workout" = {
      source_dir  = "${path.module}/../Server/lambdas/coach/get_group_workout"
      output_path = "${path.module}/../Server/lambdas/coach/zips/get_group_workout.zip"
    }
    "get_workouts" = {
      source_dir  = "${path.module}/../Server/lambdas/coach/get_workouts"
      output_path = "${path.module}/../Server/lambdas/coach/zips/get_workouts.zip"
    }
    "invite_athlete" = {
      source_dir  = "${path.module}/../Server/lambdas/coach/invite_athlete"
      output_path = "${path.module}/../Server/lambdas/coach/zips/invite_athlete.zip"
    }
    "remove_group_athlete" = {
      source_dir  = "${path.module}/../Server/lambdas/coach/remove_group_athlete"
      output_path = "${path.module}/../Server/lambdas/coach/zips/remove_group_athlete.zip"
    }
    "search_athletes" = {
      source_dir  = "${path.module}/../Server/lambdas/coach/search_athletes"
      output_path = "${path.module}/../Server/lambdas/coach/zips/search_athletes.zip"
    }
    "update_coach_profile" = {
      source_dir  = "${path.module}/../Server/lambdas/coach/update_coach_profile"
      output_path = "${path.module}/../Server/lambdas/coach/zips/update_coach_profile.zip"
    }
    "view_athlete_requests" = {
      source_dir  = "${path.module}/../Server/lambdas/coach/view_athlete_requests"
      output_path = "${path.module}/../Server/lambdas/coach/zips/view_athlete_requests.zip"
    }
    "get_available_history_dates" = {
      source_dir  = "${path.module}/../Server/lambdas/general/get_available_history_dates"
      output_path = "${path.module}/../Server/lambdas/general/zips/get_available_history_dates.zip"
    }
    "fetch_historical_data" = {
      source_dir  = "${path.module}/../Server/lambdas/general/fetch_historical_data"
      output_path = "${path.module}/../Server/lambdas/general/zips/fetch_historical_data.zip"
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
    "remove_coach_athlete" = {
      source_dir  = "${path.module}/../Server/lambdas/general/remove_coach_athlete"
      output_path = "${path.module}/../Server/lambdas/general/zips/remove_coach_athlete.zip"
    }
    "view_group_inputs" = {
      source_dir  = "${path.module}/../Server/lambdas/general/view_group_inputs"
      output_path = "${path.module}/../Server/lambdas/general/zips/view_group_inputs.zip"
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
