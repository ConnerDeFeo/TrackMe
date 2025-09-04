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

variable "private_subnet_cidr" {
  description = "CIDR block for the private subnet"
  type        = list(string)
  default     = ["172.31.48.0/20", "172.31.64.0/20"]
}

variable "public_subnet_cidr" {
  description = "CIDR block for the public subnet"
  type        = string
  default     = "172.31.80.0/20"
}

variable "keypair_name" {
  description = "The name of the key pair to use for the bastion host"
  type        = string
  default     = "TrackMe-RDS-Bastion"
}

variable "keypair_path" {
  description = "The path to the key pair file for the bastion host"
  type        = string
  default     = "C:/Personal/TrackMe/keys/TrackMe-RDS-Bastion.pem"
}