from rds import execute_file
print("Executing RDS mockData script...")
try:
    execute_file('./mockData.sql')
    print("data inserted successfully.")
except Exception as e:
    print(f"Error executing RDS script: {e}")