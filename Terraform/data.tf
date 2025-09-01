data "archive_file" "rds_layer" {
  type        = "zip"
  source_dir  = "${path.module}/../server/layers/rds/"
  output_path = "${path.module}/../server/layers/rds/rds.zip"
}

data "archive_file" "create_athlete" {
  type        = "zip"
  source_dir  = "${path.module}/../server/lambdas/athlete/create_athlete"
  output_path = "${path.module}/../server/lambdas/athlete/create_athlete.zip"
}