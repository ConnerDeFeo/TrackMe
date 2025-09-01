variable "db_password" {
  description = "The database password"
  type        = string
  sensitive   = true
}

variable "aws_region" {
  description = "The AWS region"
  type        = string
  default     = "us-east-2"
}