from rds import fetch_all


def debug_table():
    tables = fetch_all("SELECT tablename FROM pg_tables WHERE schemaname = 'public'")
    for (table_name,) in tables:
        rows = fetch_all(f"SELECT * FROM {table_name}")
        print(f"Table: {table_name}")
        for row in rows:
            print(row)