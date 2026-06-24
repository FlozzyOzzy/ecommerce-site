from flask import *
from flask_cors import CORS
import pymysql
import pymysql.cursors
import requests
import datetime
import base64
from requests.auth import HTTPBasicAuth
#Create the Flask application instance
app = Flask(__name__)
CORS(app)

import os
app.config['UPLOAD_FOLDER'] = 'static/images'


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




# add_product API
# creating the route
@app.route("/api/add_product", methods = ['POST'])
# defing the corresponding web application function
def add_product ():
    # get user inputs
    product_name = request.form['title']
    product_description = request.form['description']
    product_category = request.form['category']
    product_cost = request.form['price']
    photo = request.files['image']
    product_quantity = request.form['stock_quantity']

    # get the image filename
    filename = photo.filename
    # specify where the image will be stored
    photo_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    # saving the photo
    photo.save(photo_path)

    # connecting  to the database
    connection = pymysql.connect(user= 'root', host= 'localhost', password='', database= 'ecommerce')
    # defining the cursor
    cursor = connection.cursor()
    # create the sql query
    sql = "insert into products (title, description, category, price, image, stock_quantity) values (%s, %s, %s, %s, %s, %s)"
    # preparing/defing the data
    data = (product_name, product_description, product_category, product_cost, filename, product_quantity)
    # execute the query
    cursor.execute(sql, data)
    # commit/save the changes to the database
    connection.commit()
    # return a response
    return jsonify ({"Message" : "product details added successfully"})




# get_product_details api
# creating the route
@app.route("/api/get_product_details")
# define the corresponding web application function
def get_product_details():
    # establish a connection to the database
    connection = pymysql.connect (user= 'root', password='', host= 'localhost', database= 'ecommerce')
    # define the cursor
    cursor = connection.cursor(pymysql.cursors.DictCursor)
    # defing the sql query
    sql = 'select * from products'
    # executing the sql query
    cursor.execute(sql)
    # fetching all the rows returned after sql execution
    product_details = cursor.fetchall()
    # closing the database connection
    connection.close()
    # returning a response to the user
    return jsonify (product_details)




# cart add API
# creating the route
@app.route('/api/cart/add', methods = ['POST'])
# define the corresponding web application function
def cart_add():
    # get user inputs
    user_id = request.form.get('user_id')
    product_id = request.form.get('product_id')
    quantity = request.form.get('quantity')

    # validate required inputs
    if not user_id or not product_id or not quantity:
        return jsonify({"message": "user_id, product_id and quantity are required"})

    # validate quantity is greater than zero
    if int(quantity) <= 0:
        return jsonify({"message": "quantity must be greater than zero"})

    # connecting to the database
    connection = pymysql.connect(user= 'root', host= 'localhost', password='', database= 'ecommerce')
    # defining the cursor
    cursor = connection.cursor(pymysql.cursors.DictCursor)

    # check if product exists
    sql = "select product_id from products where product_id = %s"
    data = (product_id,)
    cursor.execute(sql, data)
    if cursor.rowcount == 0:
        connection.close()
        return jsonify({"message": "Product not found"})

    # check if cart exists for user
    sql = "select id from cart where user_id = %s"
    data = (user_id,)
    cursor.execute(sql, data)

    # create cart if user does not have one yet
    if cursor.rowcount == 0:
        sql = "insert into cart (user_id) values (%s)"
        data = (user_id,)
        cursor.execute(sql, data)
        connection.commit()
        cart_id = cursor.lastrowid
    else:
        cart = cursor.fetchone()
        cart_id = cart['id']

    # check if product is already in the cart
    sql = "select id, quantity from cart_items where cart_id = %s and product_id = %s"
    data = (cart_id, product_id)
    cursor.execute(sql, data)

    # update quantity if product already exists in cart
    if cursor.rowcount > 0:
        cart_item = cursor.fetchone()
        item_id = cart_item['id']
        new_quantity = int(cart_item['quantity']) + int(quantity)
        sql = "update cart_items set quantity = %s where id = %s"
        data = (new_quantity, item_id)
        cursor.execute(sql, data)
        connection.commit()
    else:
        # insert new cart item if product is not in cart yet
        sql = "insert into cart_items (cart_id, product_id, quantity) values (%s, %s, %s)"
        data = (cart_id, product_id, quantity)
        cursor.execute(sql, data)
        connection.commit()
        item_id = cursor.lastrowid

    # get updated cart item details with product info
    sql = """select cart_items.id, cart_items.product_id, cart_items.quantity,
             products.title, products.description, products.price, products.image
             from cart_items
             join products on cart_items.product_id = products.product_id
             where cart_items.id = %s"""
    data = (item_id,)
    cursor.execute(sql, data)
    item = cursor.fetchone()
    connection.close()

    # return success message with item details
    return jsonify({"message": "Product added to cart", "item": item})




# cart update API
# creating the route
@app.route('/api/cart/items/<item_id>', methods = ['PUT'])
# define the corresponding web application function
def cart_update(item_id):
    # get user input
    quantity = request.form.get('quantity')

    # validate required input
    if not quantity:
        return jsonify({"message": "quantity is required"})

    # validate quantity is greater than zero
    if int(quantity) <= 0:
        return jsonify({"message": "quantity must be greater than zero"})

    # connecting to the database
    connection = pymysql.connect(user= 'root', host= 'localhost', password='', database= 'ecommerce')
    # defining the cursor
    cursor = connection.cursor(pymysql.cursors.DictCursor)

    # check if cart item exists
    sql = "select id from cart_items where id = %s"
    data = (item_id,)
    cursor.execute(sql, data)
    if cursor.rowcount == 0:
        connection.close()
        return jsonify({"message": "Cart item not found"})

    # update cart item quantity
    sql = "update cart_items set quantity = %s where id = %s"
    data = (quantity, item_id)
    cursor.execute(sql, data)
    connection.commit()

    # get updated cart item details with product info
    sql = """select cart_items.id, cart_items.product_id, cart_items.quantity,
             products.title, products.description, products.price, products.image
             from cart_items
             join products on cart_items.product_id = products.product_id
             where cart_items.id = %s"""
    data = (item_id,)
    cursor.execute(sql, data)
    item = cursor.fetchone()
    connection.close()

    # return updated item details
    return jsonify({"message": "Cart item updated", "item": item})




# cart delete API
# creating the route
@app.route('/api/cart/items/<item_id>', methods = ['DELETE'])
# define the corresponding web application function
def cart_delete(item_id):
    # connecting to the database
    connection = pymysql.connect(user= 'root', host= 'localhost', password='', database= 'ecommerce')
    # defining the cursor
    cursor = connection.cursor(pymysql.cursors.DictCursor)

    # check if cart item exists
    sql = "select id from cart_items where id = %s"
    data = (item_id,)
    cursor.execute(sql, data)
    if cursor.rowcount == 0:
        connection.close()
        return jsonify({"message": "Cart item not found"})

    # delete cart item
    sql = "delete from cart_items where id = %s"
    data = (item_id,)
    cursor.execute(sql, data)
    connection.commit()
    connection.close()

    # return success message
    return jsonify({"message": "Cart item removed successfully"})




# cart get API
# creating the route
@app.route('/api/cart', methods = ['GET'])
# define the corresponding web application function
def cart_get():
    # get user input
    user_id = request.args.get('user_id')

    # validate required input
    if not user_id:
        return jsonify({"message": "user_id is required"})

    # connecting to the database
    connection = pymysql.connect(user= 'root', host= 'localhost', password='', database= 'ecommerce')
    # defining the cursor
    cursor = connection.cursor(pymysql.cursors.DictCursor)

    # check if cart exists for user
    sql = "select id, user_id from cart where user_id = %s"
    data = (user_id,)
    cursor.execute(sql, data)

    # return empty cart if user has no cart yet
    if cursor.rowcount == 0:
        connection.close()
        return jsonify({
            "message": "Cart retrieved successfully",
            "cart": {
                "id": None,
                "user_id": user_id,
                "items": []
            }
        })

    cart = cursor.fetchone()

    # get all cart items with product details
    sql = """select cart_items.id, cart_items.product_id, cart_items.quantity,
             products.title, products.description, products.price, products.image
             from cart_items
             join products on cart_items.product_id = products.product_id
             where cart_items.cart_id = %s"""
    data = (cart['id'],)
    cursor.execute(sql, data)
    items = cursor.fetchall()
    connection.close()

    # return cart with all items
    return jsonify({
        "message": "Cart retrieved successfully",
        "cart": {
            "id": cart['id'],
            "user_id": cart['user_id'],
            "items": items
        }
    })




# Mpesa Payment Route/Endpoint 


@app.route('/api/mpesa_payment', methods=['POST'])
def mpesa_payment():
    if request.method == 'POST':
        amount = request.form['amount']
        phone = request.form['phone']
        # GENERATING THE ACCESS TOKEN
        # create an account on safaricom daraja
        consumer_key = "GTWADFxIpUfDoNikNGqq1C3023evM6UH"
        consumer_secret = "amFbAoUByPV2rM5A"

        api_URL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"  # AUTH URL
        r = requests.get(api_URL, auth=HTTPBasicAuth(consumer_key, consumer_secret))

        data = r.json()
        access_token = "Bearer" + ' ' + data['access_token']

        #  GETTING THE PASSWORD
        timestamp = datetime.datetime.today().strftime('%Y%m%d%H%M%S')
        passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'
        business_short_code = "174379"
        data = business_short_code + passkey + timestamp
        encoded = base64.b64encode(data.encode())
        password = encoded.decode('utf-8')

        # BODY OR PAYLOAD
        payload = {
            "BusinessShortCode": "174379",
            "Password": "{}".format(password),
            "Timestamp": "{}".format(timestamp),
            "TransactionType": "CustomerPayBillOnline",
            "Amount": "1",  # use 1 when testing
            "PartyA": phone,  # change to your number
            "PartyB": "174379",
            "PhoneNumber": phone,
            "CallBackURL": "https://modcom.co.ke/api/confirmation.php",
            "AccountReference": "account",
            "TransactionDesc": "account"
        }

        # POPULAING THE HTTP HEADER
        headers = {
            "Authorization": access_token,
            "Content-Type": "application/json"
        }

        url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"  # C2B URL

        response = requests.post(url, json=payload, headers=headers)
        print(response.text)
        return jsonify({"message": "Please Complete Payment in Your Phone and we will deliver in minutes"})



# Run the app if this file is executed directly
if __name__ == '__main__':
    app.run(debug=True)