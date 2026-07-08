from flask import *
from flask_cors import CORS
import pymysql
import pymysql.cursors
import requests
import datetime
import base64
from requests.auth import HTTPBasicAuth
from werkzeug.security import generate_password_hash, check_password_hash
#Create the Flask application instance
app = Flask(__name__)
CORS(app)

import os
app.config['UPLOAD_FOLDER'] = 'static/images'


# AlwaysData MySQL connection settings
DB_HOST = 'mysql-florencemacharia.alwaysdata.net'
DB_USER = 'florencemacharia'
DB_PASSWORD = 'Modcom123'
DB_NAME = 'florencemacharia_ecommercedatabase'


# create a database connection
def get_db_connection():
    return pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )


# format phone number for M-Pesa
def format_mpesa_phone(phone):
    phone = phone.strip().replace(' ', '').replace('-', '')
    if phone.startswith('+'):
        phone = phone[1:]
    if phone.startswith('0'):
        phone = '254' + phone[1:]
    elif phone.startswith('7') or phone.startswith('1'):
        phone = '254' + phone
    return phone


# check if user is admin
def is_admin(user_id):
    connection = get_db_connection()
    cursor = connection.cursor(pymysql.cursors.DictCursor)
    sql = "select role from users where id = %s"
    data = (user_id,)
    cursor.execute(sql, data)
    if cursor.rowcount == 0:
        connection.close()
        return False
    user = cursor.fetchone()
    connection.close()
    return user['role'] == 'admin'


# Define the sign up Endpoint
@app.route('/api/signup', methods = ['POST'])
def signup():
    # Extract values POSTED in the request, store them in varibles 
    firstname = request.form['firstname']
    lastname = request.form['lastname']
    email = request.form['email']
    phone = request.form['phone']
    password = request.form['password']

    # hash password before saving to database
    hashed_password = generate_password_hash(password)
            
    # COnnect to DB
    connection = get_db_connection()
    # Do the Cursor, initialize the connection
    cursor = connection.cursor()

    # Do SQL Query with 4 placeholders, Confirm table name and columns are as per your DB
    sql = 'insert into users(firstname, lastname, email, phone, password) values (%s,%s,%s,%s,%s)'

    # Prepare data to replace above placeholders
    data = (firstname, lastname, email, phone, hashed_password)

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
    connection = get_db_connection()
            
    # Create a cursor to return results a dictionary, initialize connection
    cursor = connection.cursor(pymysql.cursors.DictCursor)
    # find user by email only
    sql = "select * from users where email = %s"
    data = (email,)
    cursor.execute(sql, data)
            
    # If no user found, login failed
    if cursor.rowcount == 0:
        connection.close()
        return jsonify({"message": "Login Failed"})

    user = cursor.fetchone()
    stored_password = user['password']

    # verify hashed password
    if check_password_hash(stored_password, password):
        password_valid = True
    # support old plain-text passwords and upgrade them to hashed
    elif stored_password == password:
        password_valid = True
        hashed_password = generate_password_hash(password)
        update_sql = "update users set password = %s where id = %s"
        cursor.execute(update_sql, (hashed_password, user['id']))
        connection.commit()
    else:
        password_valid = False

    connection.close()

    if not password_valid:
        return jsonify({"message": "Login Failed"})

    # remove password before returning user details
    user.pop('password', None)

    # Return login success message with user details as a dictionary
    return jsonify({"message": "Login Success", "user": user})




# profile API
# creating the route
@app.route('/api/profile', methods = ['GET'])
# define the corresponding web application function
def get_profile():
    # get user input
    user_id = request.args.get('user_id')

    # validate required input
    if not user_id:
        return jsonify({"message": "user_id is required"}), 400

    # connecting to the database
    connection = get_db_connection()
    # defining the cursor
    cursor = connection.cursor(pymysql.cursors.DictCursor)

    # fetch user profile without password
    sql = "select id, firstname, lastname, email, phone, role from users where id = %s"
    data = (user_id,)
    cursor.execute(sql, data)

    # return error if user not found
    if cursor.rowcount == 0:
        connection.close()
        return jsonify({"message": "User not found"}), 404

    user = cursor.fetchone()
    connection.close()

    # return user profile
    return jsonify({"message": "Profile retrieved successfully", "user": user}), 200




# logout API
# creating the route
@app.route('/api/logout', methods = ['POST'])
# define the corresponding web application function
def logout():
    # get user input
    user_id = request.form.get('user_id')

    # validate required input
    if not user_id:
        return jsonify({"message": "user_id is required"}), 400

    # return logout success message
    return jsonify({"message": "Logged out successfully"}), 200




# add_product API
# creating the route
@app.route("/api/add_product", methods = ['POST'])
# defing the corresponding web application function
def add_product ():
    # get user id for admin check
    user_id = request.form.get('user_id')

    # validate required input
    if not user_id:
        return jsonify({"message": "user_id is required"}), 400

    # only admins can add products
    if not is_admin(user_id):
        return jsonify({"message": "Admin access required"}), 403

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
    connection = get_db_connection()
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
    # get query parameters
    search = request.args.get('search', '').strip()
    page = request.args.get('page', 1)
    per_page = request.args.get('per_page', 6)

    # validate pagination values
    try:
        page = int(page)
        per_page = int(per_page)
    except ValueError:
        return jsonify({"message": "page and per_page must be numbers"}), 400

    if page < 1:
        page = 1
    if per_page < 1:
        per_page = 6

    offset = (page - 1) * per_page

    # establish a connection to the database
    connection = get_db_connection()
    # define the cursor
    cursor = connection.cursor(pymysql.cursors.DictCursor)

    # build search filter
    where_clause = ""
    data = []
    if search:
        where_clause = " where title like %s or description like %s or category like %s"
        search_term = f"%{search}%"
        data = [search_term, search_term, search_term]

    # get total number of matching products
    count_sql = f"select count(*) as total from products{where_clause}"
    cursor.execute(count_sql, data)
    total = cursor.fetchone()['total']

    # get paginated products
    sql = f"select * from products{where_clause} order by product_id desc limit %s offset %s"
    cursor.execute(sql, data + [per_page, offset])
    product_details = cursor.fetchall()

    # closing the database connection
    connection.close()

    total_pages = (total + per_page - 1) // per_page if total > 0 else 0

    # returning products with pagination info
    return jsonify({
        "products": product_details,
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total": total,
            "total_pages": total_pages
        }
    })




# get single product api
# creating the route
@app.route("/api/products/<product_id>", methods = ['GET'])
# define the corresponding web application function
def get_product(product_id):
    # establish a connection to the database
    connection = get_db_connection()
    # define the cursor
    cursor = connection.cursor(pymysql.cursors.DictCursor)
    # define the sql query
    sql = "select * from products where product_id = %s"
    data = (product_id,)
    # executing the sql query
    cursor.execute(sql, data)

    # return error if product not found
    if cursor.rowcount == 0:
        connection.close()
        return jsonify({"message": "Product not found"}), 404

    product = cursor.fetchone()
    # closing the database connection
    connection.close()
    # returning a response to the user
    return jsonify({"message": "Product retrieved successfully", "product": product}), 200




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
    connection = get_db_connection()
    # defining the cursor
    cursor = connection.cursor(pymysql.cursors.DictCursor)

    # check if product exists
    sql = "select product_id from products where product_id = %s"
    data = (product_id,)
    cursor.execute(sql, data)
    if cursor.rowcount == 0:
        connection.close()
        return jsonify({"message": "Product not found"}), 404

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
    connection = get_db_connection()
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
    connection = get_db_connection()
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
    connection = get_db_connection()
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




# process M-Pesa STK push payment
def process_mpesa_payment(phone, amount):
    # format phone to M-Pesa required format
    phone = format_mpesa_phone(phone)

    try:
        # GENERATING THE ACCESS TOKEN
        consumer_key = "GTWADFxIpUfDoNikNGqq1C3023evM6UH"
        consumer_secret = "amFbAoUByPV2rM5A"

        api_URL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        r = requests.get(api_URL, auth=HTTPBasicAuth(consumer_key, consumer_secret), timeout=30)

        if r.status_code != 200:
            return {"ResponseCode": "1", "errorMessage": "Failed to connect to M-Pesa"}

        data = r.json()
        if 'access_token' not in data:
            return {"ResponseCode": "1", "errorMessage": data.get('errorMessage', 'M-Pesa authentication failed')}

        access_token = "Bearer" + ' ' + data['access_token']

        # GETTING THE PASSWORD
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
            "Amount": "1",
            "PartyA": phone,
            "PartyB": "174379",
            "PhoneNumber": phone,
            "CallBackURL": "https://modcom.co.ke/api/confirmation.php",
            "AccountReference": "account",
            "TransactionDesc": "account"
        }

        headers = {
            "Authorization": access_token,
            "Content-Type": "application/json"
        }

        url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        return response.json()
    except Exception as e:
        return {"ResponseCode": "1", "errorMessage": str(e)}




# checkout initiate API
# creating the route
@app.route('/api/checkout/initiate', methods = ['POST'])
# define the corresponding web application function
def checkout_initiate():
    # get user inputs
    user_id = request.form.get('user_id')
    shipping_address = request.form.get('shipping_address')
    phone = request.form.get('phone')

    # validate required inputs
    if not user_id or not shipping_address or not phone:
        return jsonify({"message": "user_id, shipping_address and phone are required"}), 400

    # validate shipping address and phone are not empty
    if not shipping_address.strip() or not phone.strip():
        return jsonify({"message": "shipping_address and phone cannot be empty"}), 400

    # connecting to the database
    connection = get_db_connection()
    # defining the cursor
    cursor = connection.cursor(pymysql.cursors.DictCursor)

    # check if cart exists for user
    sql = "select id, user_id from cart where user_id = %s"
    data = (user_id,)
    cursor.execute(sql, data)

    # return error if user has no cart
    if cursor.rowcount == 0:
        connection.close()
        return jsonify({"message": "Cart is empty"}), 400

    cart = cursor.fetchone()

    # get all cart items with product prices
    sql = """select cart_items.id, cart_items.product_id, cart_items.quantity,
             products.title, products.description, products.price, products.image
             from cart_items
             join products on cart_items.product_id = products.product_id
             where cart_items.cart_id = %s"""
    data = (cart['id'],)
    cursor.execute(sql, data)
    cart_items = cursor.fetchall()

    # validate cart has items
    if len(cart_items) == 0:
        connection.close()
        return jsonify({"message": "Cart is empty"}), 400

    # calculate total amount from product price and quantity
    total_amount = 0
    for item in cart_items:
        total_amount += float(item['price']) * int(item['quantity'])

    # create order with pending status
    sql = "insert into orders (user_id, shipping_address, phone, total_amount, status) values (%s, %s, %s, %s, %s)"
    data = (user_id, shipping_address, phone, total_amount, 'pending')
    cursor.execute(sql, data)
    connection.commit()
    order_id = cursor.lastrowid

    # copy cart items to order_items with locked product prices
    for item in cart_items:
        sql = "insert into order_items (order_id, product_id, product_name, quantity, price) values (%s, %s, %s, %s, %s)"
        data = (order_id, item['product_id'], item['title'], item['quantity'], item['price'])
        cursor.execute(sql, data)
    connection.commit()

    # delete all items from cart after order is created
    sql = "delete from cart_items where cart_id = %s"
    data = (cart['id'],)
    cursor.execute(sql, data)
    connection.commit()

    # get order details with items
    sql = "select id, user_id, shipping_address, phone, total_amount, status, created_at from orders where id = %s"
    data = (order_id,)
    cursor.execute(sql, data)
    order = cursor.fetchone()

    sql = """select order_items.id, order_items.product_id, order_items.quantity, order_items.price,
             products.title, products.description, products.image
             from order_items
             join products on order_items.product_id = products.product_id
             where order_items.order_id = %s"""
    data = (order_id,)
    cursor.execute(sql, data)
    order_items = cursor.fetchall()
    connection.close()

    # return order id, total amount and order details
    return jsonify({
        "message": "Order created successfully",
        "order_id": order_id,
        "total_amount": total_amount,
        "order": {
            "id": order['id'],
            "user_id": order['user_id'],
            "shipping_address": order['shipping_address'],
            "phone": order['phone'],
            "total_amount": float(order['total_amount']),
            "status": order['status'],
            "created_at": str(order['created_at']),
            "items": order_items
        }
    }), 200




# checkout payment API
# creating the route
@app.route('/api/checkout/payment', methods = ['POST'])
# define the corresponding web application function
def checkout_payment():
    # get user inputs
    order_id = request.form.get('order_id')
    phone = request.form.get('phone')
    amount = request.form.get('amount')

    # validate required inputs
    if not order_id or not phone or not amount:
        return jsonify({"message": "order_id, phone and amount are required"}), 400

    # validate phone is not empty
    if not phone.strip():
        return jsonify({"message": "phone cannot be empty"}), 400

    # connecting to the database
    connection = get_db_connection()
    # defining the cursor
    cursor = connection.cursor(pymysql.cursors.DictCursor)

    # check if order exists
    sql = "select id, user_id, total_amount, status from orders where id = %s"
    data = (order_id,)
    cursor.execute(sql, data)
    if cursor.rowcount == 0:
        connection.close()
        return jsonify({"message": "Order not found"}), 404

    order = cursor.fetchone()

    # validate amount matches order total
    if abs(float(amount) - float(order['total_amount'])) > 0.01:
        connection.close()
        return jsonify({"message": "Amount does not match order total"}), 400

    # format phone for M-Pesa
    phone = format_mpesa_phone(phone)

    # call M-Pesa payment API
    mpesa_response = process_mpesa_payment(phone, amount)

    # check if M-Pesa payment was successful
    if mpesa_response.get('ResponseCode') == '0':
        # update order status to paid
        sql = "update orders set status = %s where id = %s"
        data = ('paid', order_id)
        cursor.execute(sql, data)
        connection.commit()
        connection.close()

        # return success message with order id
        return jsonify({
            "message": "Payment successful",
            "order_id": order_id,
            "mpesa_response": mpesa_response
        }), 200
    else:
        connection.close()

        # keep order status as pending and return error
        return jsonify({
            "message": "Payment failed",
            "order_id": order_id,
            "mpesa_response": mpesa_response,
            "error": mpesa_response.get('errorMessage') or mpesa_response.get('ResponseDescription', 'Payment failed')
        }), 400




# orders list API
# creating the route
@app.route('/api/orders', methods = ['GET'])
# define the corresponding web application function
def orders_list():
    # get user input
    user_id = request.args.get('user_id')

    # validate required input
    if not user_id:
        return jsonify({"message": "user_id is required"}), 400

    # connecting to the database
    connection = get_db_connection()
    # defining the cursor
    cursor = connection.cursor(pymysql.cursors.DictCursor)

    # fetch all orders for user ordered by created_at
    sql = "select id, user_id, shipping_address, phone, total_amount, status, created_at from orders where user_id = %s order by created_at desc"
    data = (user_id,)
    cursor.execute(sql, data)
    orders = cursor.fetchall()

    # fetch order items with product details for each order
    orders_with_items = []
    for order in orders:
        sql = """select order_items.product_id as id, products.title, order_items.price,
                 order_items.quantity, (order_items.price * order_items.quantity) as total
                 from order_items
                 join products on order_items.product_id = products.product_id
                 where order_items.order_id = %s"""
        data = (order['id'],)
        cursor.execute(sql, data)
        items = cursor.fetchall()

        orders_with_items.append({
            "id": order['id'],
            "user_id": order['user_id'],
            "shipping_address": order['shipping_address'],
            "phone": order['phone'],
            "total_amount": float(order['total_amount']),
            "status": order['status'],
            "created_at": str(order['created_at']),
            "items": items
        })

    connection.close()

    # return list of orders with items
    return jsonify({
        "message": "Orders retrieved successfully",
        "orders": orders_with_items
    }), 200




# order details API
# creating the route
@app.route('/api/orders/<order_id>', methods = ['GET'])
# define the corresponding web application function
def order_get(order_id):
    # connecting to the database
    connection = get_db_connection()
    # defining the cursor
    cursor = connection.cursor(pymysql.cursors.DictCursor)

    # check if order exists
    sql = "select id, user_id, shipping_address, phone, total_amount, status, created_at from orders where id = %s"
    data = (order_id,)
    cursor.execute(sql, data)
    if cursor.rowcount == 0:
        connection.close()
        return jsonify({"message": "Order not found"}), 404

    order = cursor.fetchone()

    # fetch all order items with product details
    sql = """select order_items.product_id as id, products.title, order_items.price,
             order_items.quantity, (order_items.price * order_items.quantity) as total
             from order_items
             join products on order_items.product_id = products.product_id
             where order_items.order_id = %s"""
    data = (order_id,)
    cursor.execute(sql, data)
    items = cursor.fetchall()
    connection.close()

    # return complete order with all details
    return jsonify({
        "message": "Order retrieved successfully",
        "order": {
            "id": order['id'],
            "user_id": order['user_id'],
            "shipping_address": order['shipping_address'],
            "phone": order['phone'],
            "total_amount": float(order['total_amount']),
            "status": order['status'],
            "created_at": str(order['created_at']),
            "items": items
        }
    }), 200




# Mpesa Payment Route/Endpoint 


@app.route('/api/mpesa_payment', methods=['POST'])
def mpesa_payment():
    if request.method == 'POST':
        amount = request.form['amount']
        phone = request.form['phone']
        mpesa_response = process_mpesa_payment(phone, amount)
        print(mpesa_response)
        return jsonify({"message": "Please Complete Payment in Your Phone and we will deliver in minutes"})



# Run the app if this file is executed directly
# if __name__ == '__main__':
#     app.run(debug=True)