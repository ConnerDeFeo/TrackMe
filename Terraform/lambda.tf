# Layer definition
resource "aws_lambda_layer_version" "rds" {
  filename         = data.archive_file.rds_layer.output_path
  layer_name       = "rds"
  compatible_runtimes = ["python3.12"]
  source_code_hash = data.archive_file.rds_layer.output_base64sha256
}

# Local variables to be reused in multiple lambda functions
# Define reusable configurations using locals
locals {
  lambda_environment_variables = {
    RDS_ENDPOINT = aws_db_instance.default.address
    RDS_DBNAME   = aws_db_instance.default.db_name
    RDS_USER     = aws_db_instance.default.username
    RDS_PORT     = aws_db_instance.default.port
    RDS_PASSWORD = aws_db_instance.default.password
    RDS_REGION   = var.aws_region
    ENVIRONMENT  = "production"
  }

  lambda_vpc_config = {
    subnet_ids         = [aws_subnet.private_subnet1.id, aws_subnet.private_subnet2.id]
    security_group_ids = [aws_security_group.lambda_sg.id]
  }

  lambda_common_config = {
    layers     = [aws_lambda_layer_version.rds.arn]
    runtime    = "python3.12"
    timeout    = 5
    role       = aws_iam_role.lambda_role.arn
  }
}

resource "aws_lambda_function" "create_athlete" {
  function_name    = "create_athlete"
  role             = local.lambda_common_config.role
  handler          = "create_athlete.create_athlete"
  runtime          = local.lambda_common_config.runtime
  filename         = data.archive_file.create_athlete.output_path
  source_code_hash = data.archive_file.create_athlete.output_base64sha256
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