# # Create the API Gateway REST API
# resource "aws_api_gateway_rest_api" "main" {
#   name        = "trackme-api"
#   description = "Trackme API Gateway"
  
#   endpoint_configuration {
#     types = ["REGIONAL"]
#   }
# }

# # Create a deployment (required to make the API accessible)
# resource "aws_api_gateway_deployment" "main" {
#   rest_api_id = aws_api_gateway_rest_api.main.id

#   # This forces a new deployment when the API changes
#   triggers = {
#     redeployment = sha1(jsonencode(aws_api_gateway_rest_api.main.body))
#   }

#   lifecycle {
#     create_before_destroy = true
#   }
# }

# # Separate stage resource
# resource "aws_api_gateway_stage" "main" {
#   deployment_id = aws_api_gateway_deployment.main.id
#   rest_api_id   = aws_api_gateway_rest_api.main.id
#   stage_name    = "prod"
# }