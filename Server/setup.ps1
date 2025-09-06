cd dev-setup
pip install -r requirements.txt
python setup_rds.py
python insertData.py
cd ..
cd layers/rds/python
Remove-Item -Recurse -Force psycopg2*
cd ../../..
sam build
sam local start-api