from rds import execute_file
print("Executing RDS setup script...")
try:
    execute_file('../setup.sql')
    print("RDS setup script executed successfully.")
except Exception as e:
    print(f"Error executing RDS setup script: {e}")