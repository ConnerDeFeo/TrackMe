cd dev-setup
pip install -r requirements.txt
python setup_rds.py
python insertData.py
cd ..
sam build
sam local start-api