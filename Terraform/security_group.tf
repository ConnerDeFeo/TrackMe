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

# Allow batstion to connect to rds instance in the default security group
resource "aws_security_group_rule" "allow_bastion_to_rds" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.bastion_sg.id
  security_group_id        = data.aws_security_group.default.id
}
