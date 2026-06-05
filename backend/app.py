from flask import *
from flask_cors import CORS
import pymysql
import pymysql.cursors
#Create the Flask application instance
app = Flask(__name__)
CORS(app)


# Define the sign up Endpoint
@app.route('/api/signup', methods = ['POST'])
def signup():
    # Extract values POSTED in the request, store them in varibles 
    firstname = request.form['firstname']
    lastname = request.form['lastname']
    email = request.form['email']
    phone = request.form['phone']
    password = request.form['password']
    
            
    # COnnect to DB
    connection = pymysql.connect(host='localhost', user='root', password='', database='ecommerce')
    # Do the Cursor, initialize the connection
    cursor = connection.cursor()

    # Do SQL Query with 4 placeholders, Confirm table name and columns are as per your DB
    sql = 'insert into users(firstname, lastname, email, phone, password) values (%s,%s,%s,%s,%s)'

    # Prepare data to replace above placeholders
    data = (firstname, lastname, email, phone, password)

    #use Cursor to execute SQL together with the data to replace the 4 placeholders indicated by %s in sql
    cursor.execute(sql, data)
                
    # we need to make a commit to changes to dbase
    connection.commit()

    # Return a message to show a success/data is saved in users table
    return jsonify({"success": "Thank you for Joining"})




@app.route('/api/signin', methods = ['POST'])
def signin():
    # Extract POST data
    email = request.form['email']
    password = request.form['password']
            
    # Connect to DB
    connection = pymysql.connect(host='localhost', user='root', password='',database='ecommerce')
            
    # Create a cursor to return results a dictionary, initialize connection
    cursor = connection.cursor(pymysql.cursors.DictCursor)
    # Do select SQL,test ghis SQL first in phpmyadmin
    sql = "select * from users where email = %s and password = %s"
    # Prepare data to replace placeholders %s
    data = (email, password)
    # use cursor to execute SQL providing the data to replace placeholders
    cursor.execute(sql,data)
            
    #  Check how many rows are found
    count = cursor.rowcount
    # If rows a zero, Invalid Credentials - No user Found
    if count == 0:
        return jsonify({"message": "Login Failed"})
    else:
    # else there is a user, return a message to say login success and all user details,fetchone gets the logged in user details
        user = cursor.fetchone()
                
    # Return login success message with user details as a dictionary
    return jsonify({"message": "Login Success", "user": user})



# Run the app if this file is executed directly
if __name__ == '__main__':
    app.run(debug=True)