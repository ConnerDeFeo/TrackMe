import os
import logging
import boto3

logger = logging.getLogger()
logger.setLevel(logging.INFO)
#If in development, force use regular package
if not os.getenv("ENVIRONMENT") == "production":
    import sys
    sys.path.insert(0, r"C:\Users\cjack\AppData\Local\Programs\Python\Python312\Lib\site-packages")

import psycopg2
_connection = None
def connect():
    global _connection
    if _connection is None:
        logger.info(f"Environment: {os.getenv('ENVIRONMENT')}")
        #If in production, connect to RDS using boto3 to generate a token
        if os.getenv("ENVIRONMENT") == "production":

            _ENDPOINT=os.getenv("RDS_ENDPOINT")
            logger.info(f"RDS Endpoint: {_ENDPOINT}")
            _PORT=os.getenv("RDS_PORT")
            logger.info(f"RDS Port: {_PORT}")
            _USER=os.getenv("RDS_USER")
            logger.info(f"RDS User: {_USER}")
            _DBNAME=os.getenv("RDS_DBNAME")
            logger.info(f"RDS DBName: {_DBNAME}")
            _REGION=os.getenv("RDS_REGION")
            logger.info(f"RDS Region: {_REGION}")

            logger.info("Generating auth token")
            # Remove profile - Lambda uses execution role automatically
            _client = boto3.client('rds', region_name=_REGION)
            token = _client.generate_db_auth_token(
                DBHostname=_ENDPOINT, 
                Port=_PORT, 
                DBUsername=_USER, 
                Region=_REGION
            )
            logger.info("Auth token generated")
            _connection = psycopg2.connect(
                host=_ENDPOINT, 
                port=_PORT, 
                database=_DBNAME, 
                user=_USER, 
                password=token, 
                sslmode='require'  # Changed from sslrootcert
            )
            logger.info("Connected to RDS")
        #Else connect locally
        else:
            #Load vars from env file
            from dotenv import load_dotenv
            load_dotenv()
            _ENDPOINT=os.getenv("RDS_ENDPOINT")
            _PORT=os.getenv("RDS_PORT")
            _USER=os.getenv("RDS_USER")
            _DBNAME=os.getenv("RDS_DBNAME")
            _connection = psycopg2.connect(
                host=_ENDPOINT,
                database=_DBNAME,
                user=_USER,
                password=os.getenv("RDS_PASSWORD"),
                port=_PORT
            )
    return _connection

#Executes a functions and reestablishes the connection if it fails
def execute_function(func,*args, **kwargs):
    try:
        return func(*args, **kwargs)
    except (psycopg2.OperationalError, psycopg2.InterfaceError):
        connect()
        try:
            return func(*args, **kwargs)
        except:
            raise Exception("Failed to execute function after reconnecting to the database")


#Fetches a single row from db
def fetch_one(query, params={}):
    conn = connect()
    def _fetch_one(query, params={}):
        with conn.cursor() as cursor:
            try:
                cursor.execute(query, params)
                return cursor.fetchone()
            except:
                conn.rollback()
    return execute_function(_fetch_one, query, params)

#Fetches all rows from db that match the query
def fetch_all(query, params={}):
    conn = connect()
    def _fetch_all(query, params={}):
        with conn.cursor() as cursor:
            try:
                cursor.execute(query, params)
                return cursor.fetchall()
            except:
                conn.rollback()

    return execute_function(_fetch_all, query, params)

#Executes a query that does not return any rows (e.g. INSERT, UPDATE, DELETE)
def execute_commit(query, params={}):
    conn = connect()
    def _execute_commit(query, params={}):
        with conn.cursor() as cursor:
            try:
                cursor.execute(query, params)
                conn.commit()
                return True
            except:
                conn.rollback()
                return False
    return execute_function(_execute_commit, query, params)

#Executes a query that commits and fetches a single row
def execute_commit_fetch_one(query, params={}):
    conn = connect()
    def _execute_commit_fetch_one(query, params={}):
        with conn.cursor() as cursor:
            try:
                cursor.execute(query, params)
                conn.commit()
            except:
                conn.rollback()
                return False
            return cursor.fetchone()

    return execute_function(_execute_commit_fetch_one, query, params)

#Executes a query that commits and fetches all rows
def execute_commit_many(query, params):
    conn = connect()
    def _execute_commit_many(query, params):
        with conn.cursor() as cursor:
            try:
                cursor.executemany(query, params)
                conn.commit()
                return True
            except:
                conn.rollback()
                return False

    return execute_function(_execute_commit_many, query, params)

#Executes a SQL file
def execute_file(file_path, params={}):
    conn = connect()
    with open(file_path, 'r') as file:
        sql = file.read()
    with conn.cursor() as cursor:
        try:
            cursor.execute(sql, params)
            conn.commit()
            return True
        except Exception as e:
            conn.rollback()
            print(f"Error executing SQL file {file_path}: {e}")
            return False


