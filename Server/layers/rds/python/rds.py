import os
import psycopg2

from dotenv import load_dotenv
load_dotenv()

_ENDPOINT=os.getenv("RDS_ENDPOINT")
_PORT=os.getenv("RDS_PORT")
_USER=os.getenv("RDS_USER")
_DBNAME=os.getenv("RDS_DBNAME")


#If in production, connect to RDS using boto3 to generate a token
if os.getenv("ENVIRONMENT") == "production":
    import boto3
    _REGION=os.getenv("RDS_REGION")
    _PROFILE=os.getenv("RDS_PROFILE")

    #gets the credentials from .aws/credentials
    _session = boto3.Session(profile_name=_PROFILE)
    _client = _session.client('rds')
    token = _client.generate_db_auth_token(DBHostname=_ENDPOINT, Port=_PORT, DBUsername=_USER, Region=_REGION)

    _connection = psycopg2.connect(host=_ENDPOINT, port=_PORT, database=_DBNAME, user=_USER, password=token, sslrootcert="SSLCERTIFICATE")

#Else connect locally
else:
    _connection = psycopg2.connect(
        host=_ENDPOINT,
        database=_DBNAME,
        user=_USER,
        password=os.getenv("RDS_PASSWORD"),
        port=_PORT
    )

#Fetches a single row from db
def fetch_one(query, params={}):
    with _connection.cursor() as cursor:
        cursor.execute(query, params)
        return cursor.fetchone()
        
#Fetches all rows from db that match the query
def fetch_all(query, params={}):
    with _connection.cursor() as cursor:
        cursor.execute(query, params)
        return cursor.fetchall()

#Executes a query that does not return any rows (e.g. INSERT, UPDATE, DELETE)
def execute_commit(query, params={}):
    with _connection.cursor() as cursor:
        cursor.execute(query, params)
        _connection.commit()

def execute_commit_fetch_one(query, params={}):
    with _connection.cursor() as cursor:
        cursor.execute(query, params)
        _connection.commit()
        return cursor.fetchone()

def execute_commit_many(query, params):
    with _connection.cursor() as cursor:
        cursor.executemany(query, params)
        _connection.commit()
        
#Executes a SQL file
def execute_file(file_path, params={}):
    with open(file_path, 'r') as file:
        sql = file.read()
    with _connection.cursor() as cursor:
        cursor.execute(sql, params)
        _connection.commit()
