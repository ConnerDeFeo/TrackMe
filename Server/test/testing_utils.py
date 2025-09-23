from rds import fetch_all
def debug_table():
    tables = fetch_all("SELECT tablename FROM pg_tables WHERE schemaname = 'public'")
    if not tables:
        print("No tables found.")
        return

    for (table_name,) in tables:
        rows = fetch_all(f"SELECT * FROM {table_name}")
        print(f"\nTable: {table_name}")
        if not rows:
            print("No rows found.")
        else:
            for row in rows:
                print(row)

def generate_auth_header(user_id, account_type, username):
    return {
        "Authorization": "test",
        "AuthorizationData": {
            "userId": user_id,
            "accountType": account_type,
            "username": username
        }
    }
