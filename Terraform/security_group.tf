# Lambda security group allowing access to RDS instance in the default security group
resource "aws_security_group" "lambda_sg" {
  name        = "lambda_sg"
  description = "Security group for Lambda functions"
  vpc_id      = data.aws_vpc.default.id

  # Allow all outbound traffic from the Lambda security group
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

}

# Allow Lambda functions to access the RDS instance in the default security group
resource "aws_security_group_rule" "allow_lambda_to_rds" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.lambda_sg.id
  security_group_id        = data.aws_security_group.default.id
}

# Security group for Bedrock VPC Endpoint
resource "aws_security_group" "bedrock_vpc_endpoint" {
  name        = "bedrock-vpc-endpoint-sg"
  description = "Security group for Bedrock VPC endpoint"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description     = "HTTPS from Lambda"
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [aws_security_group.lambda_sg.id]  # Your Lambda's security group
  }

  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "bedrock-vpc-endpoint-sg"
  }
}

