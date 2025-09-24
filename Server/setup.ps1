Set-Location dev-setup
pip install -r requirements.txt
python setup_rds.py
python insertData.py
Set-Location ..
Set-Location layers/rds/python
Remove-Item -Recurse -Force psycopg2*
Set-Location ../../..
sam build
sam local start-api --warm-containers LAZY