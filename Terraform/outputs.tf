# ssh -i key_pair_name.pem -L 5433:rds_endpoint:5432 ec2-user@bastion_host_public_ip
# psql -h rds_endpoint -p 5433 -U trackme_admin -d trackme

output "rds_endpoint" {
  description = "The endpoint of the RDS instance for TrackMe application"
  value       = aws_db_instance.default.endpoint
}

output "bastion_host_public_ip" {
  description = "The public IP address of the bastion host"
  value       = aws_instance.bastion_host.public_ip
}

output "api_gateway_url" {
  description = "Base URL of the API Gateway"
  value       = "https://${aws_api_gateway_rest_api.main.id}.execute-api.${var.aws_region}.amazonaws.com/${aws_api_gateway_stage.main.stage_name}"
}