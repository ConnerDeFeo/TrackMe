locals {
  lambdas = {
    # GET Lambdas
    "athletes/view_workout_inputs" = { lambda = aws_lambda_function.lambdas["view_workout_inputs"], method = "GET" }

    "general/get_user" = { lambda = aws_lambda_function.lambdas["get_user"], method = "GET" }
    "general/get_mutual_inputs" = { lambda = aws_lambda_function.lambdas["get_mutual_inputs"], method = "GET" }

    "history/get_available_history_dates" = { lambda = aws_lambda_function.lambdas["get_available_history_dates"], method = "GET" }
    "history/fetch_historical_data" = { lambda = aws_lambda_function.lambdas["fetch_historical_data"], method = "GET" }
    "history/get_earliest_date_available" = { lambda = aws_lambda_function.lambdas["get_earliest_date_available"], method = "GET" }

    "relations/get_mutual_user_relations" = { lambda = aws_lambda_function.lambdas["get_mutual_user_relations"], method = "GET" }
    "relations/get_relation_invites_count" = { lambda = aws_lambda_function.lambdas["get_relation_invites_count"], method = "GET" }
    "relations/get_relation_invites" = { lambda = aws_lambda_function.lambdas["get_relation_invites"], method = "GET" }
    "relations/search_user_relation" = { lambda = aws_lambda_function.lambdas["search_user_relation"], method = "GET" }
    "relations/get_mutual_athletes" = { lambda = aws_lambda_function.lambdas["get_mutual_athletes"], method = "GET" }

    "graph/get_work_rest_ratio" = { lambda = aws_lambda_function.lambdas["get_work_rest_ratio"], method = "GET" }
    "graph/get_avg_velocity" = { lambda = aws_lambda_function.lambdas["get_avg_velocity"], method = "GET" }

    # POST Lambdas
    "athletes/input_times" = { lambda = aws_lambda_function.lambdas["input_times"], method = "POST" }
    "athletes/remove_inputs" = { lambda = aws_lambda_function.lambdas["remove_inputs"], method = "POST" }

    "general/mass_input" = { lambda = aws_lambda_function.lambdas["mass_input"], method = "POST" }
    "general/create_user" = { lambda = aws_lambda_function.lambdas["create_user"], method = "POST" }
    "general/update_user_profile" = { lambda = aws_lambda_function.lambdas["update_user_profile"], method = "POST" }
    "general/update_profile_pic" = { lambda = aws_lambda_function.lambdas["update_profile_pic"], method = "POST" }

    "relations/add_relation" = { lambda = aws_lambda_function.lambdas["add_relation"], method = "POST" }

    # DELETE Lambdas
    "relations/remove_user_relation" = { lambda = aws_lambda_function.lambdas["remove_user_relation"], method = "DELETE" }
  }
}
# Create the API Gateway REST API
resource "aws_api_gateway_rest_api" "main" {
  name        = "trackme-api"
  description = "Trackme API Gateway" 
}

# Create the four different paths
resource "aws_api_gateway_resource" "athletes" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "athletes"
}
resource "aws_api_gateway_resource" "coaches" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "coaches"
}
resource "aws_api_gateway_resource" "general" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "general"
}
resource "aws_api_gateway_resource" "relations" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "relations"
}
resource "aws_api_gateway_resource" "history" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "history"
}
resource "aws_api_gateway_resource" "graph" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "graph"
}

# Create sub-resources for each lambda function based on the defined local variables
resource "aws_api_gateway_resource" "subresources" {
  for_each = local.lambdas

  rest_api_id = aws_api_gateway_rest_api.main.id

  # Choose parent based on the first segment of the key (athletes/coaches/general)
  parent_id = lookup(
    {
      athletes = aws_api_gateway_resource.athletes.id
      coaches  = aws_api_gateway_resource.coaches.id
      general  = aws_api_gateway_resource.general.id
      relations = aws_api_gateway_resource.relations.id
      history = aws_api_gateway_resource.history.id
      graph = aws_api_gateway_resource.graph.id
    },
    split("/", each.key)[0], # first segment
    aws_api_gateway_rest_api.main.root_resource_id
  )

  # Use the second segment as the actual path part
  path_part = split("/", each.key)[1]
}

# Create methods for each lambda function based on the defined local variables
# each method
resource "aws_api_gateway_method" "main" {
  for_each = local.lambdas

  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.subresources[each.key].id
  http_method   = each.value.method
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito_authorizer.id
}

# OPTIONS method for CORS preflight
resource "aws_api_gateway_method" "options" {
  for_each = local.lambdas

  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.subresources[each.key].id
  http_method   = "OPTIONS"
  authorization = "NONE"  # no auth for preflight
}

# Integrations for each lambda function based on the defined local variables
resource "aws_api_gateway_integration" "main" {
  for_each = local.lambdas

  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.subresources[each.key].id
  http_method = aws_api_gateway_method.main[each.key].http_method
  type        = "AWS_PROXY"
  integration_http_method = "POST" # Lambda functions always use POST for integration
  uri = each.value.lambda.invoke_arn
}

# CORS preflight integration
resource "aws_api_gateway_integration" "options" {
  for_each = local.lambdas

  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.subresources[each.key].id
  http_method = "OPTIONS"
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }

  depends_on = [aws_api_gateway_method.options]
}

# Method response for CORS preflight
resource "aws_api_gateway_method_response" "options" {
  for_each = local.lambdas

  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.subresources[each.key].id
  http_method = "OPTIONS"
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }

  depends_on = [
    aws_api_gateway_method.options
  ]
}

# Integration response for CORS preflight
resource "aws_api_gateway_integration_response" "options" {
  for_each = local.lambdas

  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.subresources[each.key].id
  http_method = "OPTIONS"
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [
    aws_api_gateway_integration.options,
    aws_api_gateway_method_response.options
  ]
}

data "aws_caller_identity" "current" {}

# Create permissions for API Gateway to invoke the Lambda functions
resource "aws_lambda_permission" "api_gateway" {
  for_each = local.lambdas

  statement_id  = "AllowAPIGatewayInvoke-${split("/", each.key)[1]}"
  action        = "lambda:InvokeFunction"
  function_name = each.value.lambda.function_name
  # Use the execution ARN of the API Gateway for the source ARN
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.aws_region}:${data.aws_caller_identity.current.account_id}:${aws_api_gateway_rest_api.main.id}/*/*"
}

resource "aws_api_gateway_deployment" "main" {
  # This ensures all methods + integrations exist before deployment
  depends_on = [
    aws_api_gateway_integration.main,
    aws_api_gateway_method.main,
    aws_api_gateway_integration.options,
    aws_api_gateway_method.options,
    aws_api_gateway_method_response.options,
    aws_api_gateway_integration_response.options
  ]
  rest_api_id = aws_api_gateway_rest_api.main.id

  # Force new deployment when configuration changes
  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.subresources,
      aws_api_gateway_method.main,
      aws_api_gateway_method.options,
      aws_api_gateway_integration.main,
      aws_api_gateway_integration.options,
      aws_api_gateway_integration_response.options,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Identify the stage for the API Gateway deployment
resource "aws_api_gateway_stage" "main" {
  stage_name    = "prod"
  deployment_id = aws_api_gateway_deployment.main.id
  rest_api_id   = aws_api_gateway_rest_api.main.id

  lifecycle {
    create_before_destroy = true
  }
}

# Authorization for API Gateway to invoke the Lambda functions
resource "aws_api_gateway_authorizer" "cognito_authorizer" {
  name          = "cognito-authorizer"
  rest_api_id   = aws_api_gateway_rest_api.main.id
  type          = "COGNITO_USER_POOLS"
  provider_arns = [var.cognito_arn]
  identity_source = "method.request.header.Authorization"
}