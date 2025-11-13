docker compose -f docker-compose-dependencies.yml up -d
Set-Location layers/s3/python
pip install -r requirements.txt -t .
Set-Location ../../../../Terraform
terraform apply -auto-approve
Set-Location ../Server
docker compose -f docker-compose-dependencies.yml down
Set-Location layers/rds/python
Remove-Item -Recurse -Force psycopg2*
Set-Location ../../../layers/s3/python
Remove-Item -Recurse -Force boto3*, botocore*, jmespath*, s3transfer*, urllib3*, six*, dateutil*, bin, python_dateutil* -ErrorAction SilentlyContinue
Set-Location ../../../