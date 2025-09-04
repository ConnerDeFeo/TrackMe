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

# rds layer archive file for use in Lambda functions
data "archive_file" "rds_layer" {
  type        = "zip"
  source_dir  = "${path.module}/../server/layers/rds/"
  output_path = "${path.module}/../server/layers/rds/rds.zip"
}

data "archive_file" "create_athlete" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/athlete/create_athlete"
  output_path = "${path.module}/../server/lambdas/athlete/zips/create_athlete.zip"
}

data "archive_file" "create_coach" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/coach/create_coach"
  output_path = "${path.module}/../server/lambdas/coach/zips/create_coach.zip"
}

data "archive_file" "create_group" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/coach/create_group"
  output_path = "${path.module}/../server/lambdas/coach/zips/create_group.zip"
}

# Athlete Lambdas
data "archive_file" "accept_coach_invite" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/athlete/accept_coach_invite"
  output_path = "${path.module}/../server/lambdas/athlete/zips/accept_coach_invite.zip"
}

data "archive_file" "get_coaches" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/athlete/get_coaches"
  output_path = "${path.module}/../server/lambdas/athlete/zips/get_coaches.zip"
}

data "archive_file" "get_coach_requests" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/athlete/get_coach_requests"
  output_path = "${path.module}/../server/lambdas/athlete/zips/get_coach_requests.zip"
}

data "archive_file" "input_times" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/athlete/input_times"
  output_path = "${path.module}/../server/lambdas/athlete/zips/input_times.zip"
}

data "archive_file" "request_coach" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/athlete/request_coach"
  output_path = "${path.module}/../server/lambdas/athlete/zips/request_coach.zip"
}

data "archive_file" "search_coaches" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/athlete/search_coaches"
  output_path = "${path.module}/../server/lambdas/athlete/zips/search_coaches.zip"
}

data "archive_file" "update_athlete_profile" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/athlete/update_athlete_profile"
  output_path = "${path.module}/../server/lambdas/athlete/zips/update_athlete_profile.zip"
}

data "archive_file" "view_coach_invites" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/athlete/view_coach_invites"
  output_path = "${path.module}/../server/lambdas/athlete/zips/view_coach_invites.zip"
}

data "archive_file" "view_workouts_athlete" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/athlete/view_workouts_athlete"
  output_path = "${path.module}/../server/lambdas/athlete/zips/view_workouts_athlete.zip"
}

data "archive_file" "view_workout_inputs" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/athlete/view_workout_inputs"
  output_path = "${path.module}/../server/lambdas/athlete/zips/view_workout_inputs.zip"
}

# Coach Lambdas
data "archive_file" "accept_athlete_request" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/coach/accept_athlete_request"
  output_path = "${path.module}/../server/lambdas/coach/zips/accept_athlete_request.zip"
}

data "archive_file" "add_athlete_to_group" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/coach/add_athlete_to_group"
  output_path = "${path.module}/../server/lambdas/coach/zips/add_athlete_to_group.zip"
}

data "archive_file" "assign_group_workout" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/coach/assign_group_workout"
  output_path = "${path.module}/../server/lambdas/coach/zips/assign_group_workout.zip"
}

data "archive_file" "create_workout" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/coach/create_workout"
  output_path = "${path.module}/../server/lambdas/coach/zips/create_workout.zip"
}

data "archive_file" "delete_workout" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/coach/delete_workout"
  output_path = "${path.module}/../server/lambdas/coach/zips/delete_workout.zip"
}

data "archive_file" "get_absent_group_athletes" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/coach/get_absent_group_athletes"
  output_path = "${path.module}/../server/lambdas/coach/zips/get_absent_group_athletes.zip"
}

data "archive_file" "get_athletes" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/coach/get_athletes"
  output_path = "${path.module}/../server/lambdas/coach/zips/get_athletes.zip"
}

data "archive_file" "get_group_workout" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/coach/get_group_workout"
  output_path = "${path.module}/../server/lambdas/coach/zips/get_group_workout.zip"
}

data "archive_file" "get_workouts" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/coach/get_workouts"
  output_path = "${path.module}/../server/lambdas/coach/zips/get_workouts.zip"
}

data "archive_file" "invite_athlete" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/coach/invite_athlete"
  output_path = "${path.module}/../server/lambdas/coach/zips/invite_athlete.zip"
}

data "archive_file" "remove_group_athlete" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/coach/remove_group_athlete"
  output_path = "${path.module}/../server/lambdas/coach/zips/remove_group_athlete.zip"
}

data "archive_file" "search_athletes" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/coach/search_athletes"
  output_path = "${path.module}/../server/lambdas/coach/zips/search_athletes.zip"
}

data "archive_file" "update_coach_profile" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/coach/update_coach_profile"
  output_path = "${path.module}/../server/lambdas/coach/zips/update_coach_profile.zip"
}

data "archive_file" "view_athlete_requests" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/coach/view_athlete_requests"
  output_path = "${path.module}/../server/lambdas/coach/zips/view_athlete_requests.zip"
}

# General Lambdas
data "archive_file" "get_athletes_for_group" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/general/get_athletes_for_group"
  output_path = "${path.module}/../server/lambdas/general/zips/get_athletes_for_group.zip"
}

data "archive_file" "get_groups" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/general/get_groups"
  output_path = "${path.module}/../server/lambdas/general/zips/get_groups.zip"
}

data "archive_file" "get_user" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/general/get_user"
  output_path = "${path.module}/../server/lambdas/general/zips/get_user.zip"
}

data "archive_file" "remove_coach_athlete" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/general/remove_coach_athlete"
  output_path = "${path.module}/../server/lambdas/general/zips/remove_coach_athlete.zip"
}

data "archive_file" "view_group_inputs" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/general/view_group_inputs"
  output_path = "${path.module}/../server/lambdas/general/zips/view_group_inputs.zip"
}

