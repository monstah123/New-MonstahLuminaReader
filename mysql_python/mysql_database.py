import mysql.connector

# Establishing the connection
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="Linksys_1921",
    database="chatdb"  # Fixed: Changed spaces to underscores
)

# Print the connection object
print(mydb)

# Check if the connection was successful
if mydb.is_connected():
    print("Connection successful!")
else:
    print("Connection failed.")

# Creating a cursor object
my_cursor = mydb.cursor()

# Uncomment the following line if you want to create a database
# my_cursor.execute("CREATE DATABASE chatdb")

# Show databases
my_cursor.execute("SHOW DATABASES")
for db in my_cursor:
    print(db[0])

# Closing the cursor and connection
my_cursor.close()
mydb.close()