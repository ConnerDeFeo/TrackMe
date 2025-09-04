# Public Ip address of the machine running Terraform for use in security group rules
data "http" "myip" {
  url = "https://ipv4.icanhazip.com"
}

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
  output_path = "${path.module}/../server/lambdas/athlete/create_athlete.zip"
}