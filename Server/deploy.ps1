docker compose -f docker-compose-dependencies.yml up -d
Set-Location ../Terraform
terraform apply -auto-approve
Set-Location ../Server
docker compose -f docker-compose-dependencies.yml down
Set-Location layers/rds/python
Remove-Item -Recurse -Force psycopg2*
Set-Location ../../..