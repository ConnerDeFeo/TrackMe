import os
import psycopg2

_connection = None
def connect():
    global _connection
    if _connection is None:
        #If in production, connect to RDS using boto3 to generate a token
        if os.getenv("ENVIRONMENT") == "production":

            _ENDPOINT=os.getenv("RDS_ENDPOINT")
            _PORT=os.getenv("RDS_PORT")
            _USER=os.getenv("RDS_USER")
            _DBNAME=os.getenv("RDS_DBNAME")
            _PASSWORD=os.getenv("RDS_PASSWORD")
            _connection = psycopg2.connect(
                host=_ENDPOINT, 
                port=_PORT, 
                database=_DBNAME, 
                user=_USER, 
                password=_PASSWORD, 
                sslmode='require'  # Changed from sslrootcert
            )
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


