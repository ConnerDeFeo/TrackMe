# psql -h rds_endpoint -p 5432 -U trackme_admin -d trackme

output "rds_endpoint" {
  description = "The endpoint of the RDS instance for TrackMe application"
  value       = aws_db_instance.default.endpoint
}

output "api_gateway_url" {
  description = "Base URL of the API Gateway"
  value       = "https://${aws_api_gateway_rest_api.main.id}.execute-api.${var.aws_region}.amazonaws.com/${aws_api_gateway_stage.main.stage_name}"
}