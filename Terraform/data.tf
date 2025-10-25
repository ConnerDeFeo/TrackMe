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
    "remove_inputs" = {
      source_dir  = "${path.module}/../Server/lambdas/athlete/remove_inputs"
      output_path = "${path.module}/../Server/lambdas/athlete/zips/remove_inputs.zip"
    }

    # General Lambdas
    "get_user" = {
      source_dir  = "${path.module}/../Server/lambdas/general/get_user"
      output_path = "${path.module}/../Server/lambdas/general/zips/get_user.zip"
    }
    "mass_input" = {
      source_dir  = "${path.module}/../Server/lambdas/general/mass_input"
      output_path = "${path.module}/../Server/lambdas/general/zips/mass_input.zip"
    }
    "create_user" = {
      source_dir  = "${path.module}/../Server/lambdas/general/create_user"
      output_path = "${path.module}/../Server/lambdas/general/zips/create_user.zip"
    }
    "update_user_profile" = {
      source_dir  = "${path.module}/../Server/lambdas/general/update_user_profile"
      output_path = "${path.module}/../Server/lambdas/general/zips/update_user_profile.zip"
    }
    "get_mutual_inputs" = {
      source_dir  = "${path.module}/../Server/lambdas/general/get_mutual_inputs"
      output_path = "${path.module}/../Server/lambdas/general/zips/get_mutual_inputs.zip"
    }

    # History Lambdas
    "get_available_history_dates" = {
      source_dir  = "${path.module}/../Server/lambdas/history/get_available_history_dates"
      output_path = "${path.module}/../Server/lambdas/history/zips/get_available_history_dates.zip"
    }
    "fetch_historical_data" = {
      source_dir  = "${path.module}/../Server/lambdas/history/fetch_historical_data"
      output_path = "${path.module}/../Server/lambdas/history/zips/fetch_historical_data.zip"
    }
    "get_earliest_date_available" = {
      source_dir  = "${path.module}/../Server/lambdas/history/get_earliest_date_available"
      output_path = "${path.module}/../Server/lambdas/history/zips/get_earliest_date_available.zip"
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
    "get_mutual_athletes" = {
      source_dir  = "${path.module}/../Server/lambdas/relations/get_mutual_athletes"
      output_path = "${path.module}/../Server/lambdas/relations/zips/get_mutual_athletes.zip"
    }

    # Graph Lambdas
    "get_work_rest_ratio" = {
      source_dir  = "${path.module}/../Server/lambdas/graph/get_work_rest_ratio"
      output_path = "${path.module}/../Server/lambdas/graph/zips/get_work_rest_ratio.zip"
    }
    "get_avg_velocity" = {
      source_dir  = "${path.module}/../Server/lambdas/graph/get_avg_velocity"
      output_path = "${path.module}/../Server/lambdas/graph/zips/get_avg_velocity.zip"
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
