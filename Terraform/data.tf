
data "aws_vpc" "default" {
  default = true
}
data  "aws_availability_zones" "available" {
  state = "available"
}
data "aws_security_group" "default" {
  name   = "default"
  vpc_id = data.aws_vpc.default.id
}

data "aws_ami" "amazon_linux"{
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

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