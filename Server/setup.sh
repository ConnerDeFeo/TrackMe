cd dev-setup
pip install -r requirements.txt
python setup_rds.py
python setup_dynamo.py

: <<'COMMENT'
Insert into coaches (userId, username) values ('81cbd5d0-c0a1-709a-560f-ceb88b7d53d9', 'coachdefeo');
Insert into athletes (userId, username) values ('912b25e0-c091-700b-a580-dbad51f124e6', 'athletedefeo');
COMMENT