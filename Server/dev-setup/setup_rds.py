from rds import execute_file
print("Executing RDS setup script...")
execute_file('./setup.sql')
print("RDS setup script executed successfully.")