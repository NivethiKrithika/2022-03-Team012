# Import flask and datetime module for showing date and time
from flask import Flask, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
import logging
import pandas as pd
import traceback
import mysql.connector as msql
from mysql.connector import Error
import insert
import load

# Initializing flask app
app = Flask(__name__)
CORS(app)

# refers to application_top
APP_ROOT = os.path.join(os.path.dirname(__file__), '..')
dotenv_path = os.path.join(APP_ROOT, '.env')
load_dotenv(dotenv_path)

QUERY_TIMEOUT = "SET SESSION MAX_EXECUTION_TIME=300000"
GROUP_BY_COMMAND = " SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))"


def connect():
    """
    This first function connects to our mysql data base based on the parameters passed into the .env file
    """
    mysql_host = os.getenv("DB_HOST")
    mysql_dbname = os.getenv("DB_DATABASE")
    mysql_user = os.getenv("DB_USERNAME")
    mysql_password = os.getenv("DB_PASSWORD")

    conn = msql.connect(host=mysql_host, user=mysql_user,
                        password="Aarthy11!")  # give ur username, password
    try:

        if conn.is_connected():
            cursor = conn.cursor()
            schema_query = f"""
            SELECT COUNT(*)
            FROM information_schema.tables
            WHERE table_schema = '{mysql_dbname}';
            """
            cursor.execute(schema_query)
            if_exists = cursor.fetchone()[0]
            cursor.execute(QUERY_TIMEOUT)
            cursor.execute(GROUP_BY_COMMAND)
            if int(if_exists) > 0:
                conn.commit()
            else:
                cursor.execute("CREATE DATABASE " + mysql_dbname)
                print("Database is created")
    except Exception as e:
        print("Error while connecting to MySQL", str(e))

    return conn, mysql_dbname


def insert_location():
    """
    This helper function is used to parse the csv file into the data base and called by def setup()
    """
    conn, db_name = connect()

    table_insert = "Location (postal_code, state, city, longitude, latitude) VALUES (%s, %s, %s, %s, %s);"

    df = pd.read_csv("postal_codes.csv", sep=',',
                     quotechar='\'', encoding='utf8')

    try:
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("USE " + db_name)
            for _, row in df.iterrows():
                sql = "INSERT INTO " + table_insert
                cursor.execute(sql, tuple(row))
                conn.commit()
            return {
                'Status': 200
            }
    except Exception as e:
        print("Error while connecting to MySQL", str(e))


@app.route('/insert/class_data', methods=['GET', 'POST'])
def insert_class_data():
    """
    This function inserts dummy data into the database by utilizing the insert.py file.
    """
    _, db_name = connect()

    HOUSEHOLD_INSERT = " " + db_name + \
        ".Household (email, home_type, square_footage, occupant_count, bedroom_count, postal_code) VALUES (%s, %s, %s, %s, %s, %s);"
    PHONE_INSERT = " " + db_name + \
        ".Phone_Number (area_code, phone_number, phone_type, email) VALUES ('{0}', '{1}', '{2}', '{3}');"
    MANUFACTURER_INSERT = " " + db_name + \
        ".Manufacturer (manufacturer_name) VALUES ('{0}');"
    WASHER_INSERT = " " + db_name + \
        ".Washer (appliance_id, email, manufacturer_name, model_name, loading_type) VALUES ({0}, '{1}', '{2}', '{3}', '{4}');"
    WASHER_INSERT_NULL = " " + db_name + \
        ".Washer (appliance_id, email, manufacturer_name, loading_type) VALUES ({0}, '{1}', '{2}', '{3}');"
    DRYER_INSERT = " " + db_name + \
        ".Dryer (appliance_id, email, manufacturer_name, model_name, heat_source) VALUES ({0}, '{1}', '{2}', '{3}', '{4}');"
    DRYER_INSERT_NULL = " " + db_name + \
        ".Dryer (appliance_id, email, manufacturer_name, heat_source) VALUES ({0}, '{1}', '{2}', '{3}');"
    TV_INSERT = " " + db_name + \
        ".TV (appliance_id, email, model_name, display_type, display_size, max_resolution, manufacturer_name) VALUES ({0}, '{1}', '{2}', '{3}', {4}, '{5}', '{6}');"
    TV_INSERT_NULL = " " + db_name + \
        ".TV (appliance_id, email, display_type, display_size, max_resolution, manufacturer_name) VALUES ({0}, '{1}', '{2}', '{3}', '{4}', '{5}');"
    FRIDGE_INSERT = " " + db_name + \
        ".Refrigerator_Freezer (appliance_id, email, model_name, manufacturer_name, refrigerator_type) VALUES ({0}, '{1}', '{2}', '{3}', '{4}');"
    FRIDGE_INSERT_NULL = " " + db_name + \
        ".Refrigerator_Freezer (appliance_id, email, manufacturer_name, refrigerator_type) VALUES ({0}, '{1}', '{2}', '{3}');"
    COOKER_INSERT = " " + db_name + \
        ".Cooker (appliance_id, email, model_name, manufacturer_name) VALUES ({0}, '{1}', '{2}', '{3}');"
    COOKER_INSERT_NULL = " " + db_name + \
        ".Cooker (appliance_id, email, manufacturer_name) VALUES ({0}, '{1}', '{2}');"
    OVEN_INSERT = " " + db_name + \
        ".Oven (appliance_id, email, oven_type) VALUES ({0}, '{1}', '{2}');"
    OVEN_HS_INSERT = " " + db_name + \
        ".Oven_Heat_Source (appliance_id, email, heat_source) VALUES ({0}, '{1}', '{2}');"
    COOKTOP_INSERT = " " + db_name + \
        ".Cooktop (appliance_id, email, heat_source) VALUES ({0}, '{1}', '{2}');"
    FULL_INSERT = " Full (bathroom_id, email, sink_count, bidet_count, commode_count, is_primary, bathtub_count, shower_count, tub_shower_count) VALUES ({0}, '{1}', {2}, {3}, {4}, {5}, {6}, {7}, {8});"
    HALF_INSERT_NULL = " Half (bathroom_id, email, sink_count, bidet_count, commode_count) VALUES ({0}, '{1}', {2}, {3}, {4});"
    HALF_INSERT = " Half (bathroom_id, email, sink_count, bidet_count, commode_count, `name`) VALUES ({0}, '{1}', {2}, {3}, {4}, '{5}');"

    APPLIANCES = {
        "WASHER_INSERT": WASHER_INSERT,
        "WASHER_INSERT_NULL": WASHER_INSERT_NULL,
        "DRYER_INSERT": DRYER_INSERT,
        "DRYER_INSERT_NULL": DRYER_INSERT_NULL,
        "TV_INSERT": TV_INSERT,
        "TV_INSERT_NULL": TV_INSERT_NULL,
        "FRIDGE_INSERT": FRIDGE_INSERT,
        "FRIDGE_INSERT_NULL": FRIDGE_INSERT_NULL,
        "COOKER_INSERT": COOKER_INSERT,
        "COOKER_INSERT_NULL": COOKER_INSERT_NULL,
        "OVEN_INSERT": OVEN_INSERT,
        "OVEN_HS_INSERT": OVEN_HS_INSERT,
        "COOKTOP_INSERT": COOKTOP_INSERT
    }

    BATHROOM = {
        "FULL_INSERT": FULL_INSERT,
        "HALF_INSERT": HALF_INSERT,
        "HALF_INSERT_NULL": HALF_INSERT_NULL,
    }

    load.load_household(HOUSEHOLD_INSERT)
    load.load_phone(PHONE_INSERT)
    load.load_manufacturers(MANUFACTURER_INSERT)
    load.load_appliances(APPLIANCES)
    load.load_bathroom(BATHROOM)

    return {
        "Status": 200
    }


@app.route('/insert/dummy_data', methods=['GET', 'POST'])
def insert_dummy_data():
    """
    This function inserts dummy data into the database by utilizing the insert.py file.
    """
    conn, db_name = connect()

    HOUSEHOLD_INSERT = "Household (email, home_type, square_footage, occupant_count, bedroom_count, postal_code) VALUES (%s, %s, %s, %s, %s, %s);"
    MANUFACTURER_INSERT = "Manufacturer (manufacturer_name) VALUES (%s);"
    WASHER_INSERT = " " + db_name + \
        ".Washer (appliance_id, email, manufacturer_name, loading_type) VALUES ({0}, '{1}', '{2}', '{3}');"
    DRYER_INSERT = " " + db_name + \
        ".Dryer (appliance_id, email, manufacturer_name, heat_source) VALUES ({0}, '{1}', '{2}', '{3}');"
    TV_INSERT = " " + db_name + \
        ".TV (appliance_id, email, model_name, display_type, display_size, max_resolution, manufacturer_name) VALUES ({0}, '{1}', '{2}', '{3}', {4}, '{5}', '{6}');"
    FRIDGE_INSERT = " " + db_name + \
        ".Refrigerator_Freezer (appliance_id, email, model_name, manufacturer_name, refrigerator_type) VALUES ({0}, '{1}', '{2}', '{3}', '{4}');"
    COOKER_INSERT = " " + db_name + \
        ".Cooker (appliance_id, email, model_name, manufacturer_name) VALUES ({0}, '{1}', '{2}', '{3}');"
    OVEN_INSERT = " " + db_name + \
        ".Oven (appliance_id, email, oven_type) VALUES ({0}, '{1}', '{2}');"
    OVEN_HS_INSERT = " " + db_name + \
        ".Oven_Heat_Source (appliance_id, email, heat_source) VALUES ({0}, '{1}', '{2}');"
    COOKTOP_INSERT = " " + db_name + \
        ".Cooktop (appliance_id, email, heat_source) VALUES ({0}, '{1}', '{2}');"
    FULL_INSERT = " `Full` (email, sink_count, bidet_count, commode_count, is_primary, bathtub_count, shower_count, tub_shower_count) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);"
    HALF_INSERT = " Half (email, sink_count, bidet_count, commode_count, name) VALUES (%s, %s, %s, %s, %s);"

    try:
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("USE " + db_name)

            insert.insert_household(HOUSEHOLD_INSERT, 1000)
            insert.insert_manufacturer(MANUFACTURER_INSERT)
            if insert.insert_washer(WASHER_INSERT) == 100:
                if insert.insert_dryer(DRYER_INSERT) == 100:
                    if insert.insert_tv(TV_INSERT) == 100:
                        if insert.insert_fridge(FRIDGE_INSERT) == 100:
                            if insert.insert_cooker(COOKER_INSERT, OVEN_INSERT, OVEN_HS_INSERT, COOKTOP_INSERT) == 100:
                                print("Completed")
            insert.insert_full_bathroom(FULL_INSERT)
            insert.insert_half_bathroom(HALF_INSERT)

            return {
                "Status": 200
            }

    except Exception as e:
        print("Error while connecting to MySQL", str(e))

        return {
            "Status": 500
        }


@app.route('/setup', methods=['GET', 'POST'])
def setup():
    """
    This function creates the tables if it doesn't exist -- for location, it calls def insert_location() if it needs to be created to input the data
    """
    conn, db_name = connect()

    tables = {
        "Location": "CREATE TABLE Location ( postal_code varchar(5) NOT NULL, state char(2) NOT NULL, city varchar(128) NOT NULL, longitude float NOT NULL, latitude float NOT NULL, PRIMARY KEY (postal_code), UNIQUE KEY (postal_code));",
        "Household": "CREATE TABLE Household (email varchar(250) NOT NULL, home_type varchar(250) NOT NULL, square_footage int NOT NULL, occupant_count int NOT NULL, bedroom_count int NOT NULL, postal_code char(5) NOT NULL, PRIMARY KEY (email), UNIQUE KEY email (email), FOREIGN KEY (postal_code) REFERENCES Location(postal_code) );",
        "Phone_Number": "CREATE TABLE Phone_Number (area_code char(3) NOT NULL, phone_number char(7) NOT NULL, phone_type varchar(6) NOT NULL, email varchar(250) NOT NULL, PRIMARY KEY (area_code, phone_number), FOREIGN KEY (email) REFERENCES Household(email) ON DELETE CASCADE);",
        "Manufacturer": "CREATE TABLE Manufacturer (manufacturer_name varchar(100) NOT NULL, PRIMARY KEY (manufacturer_name), UNIQUE KEY (manufacturer_name));",
        "Refrigerator_Freezer": "CREATE TABLE Refrigerator_Freezer (appliance_id int NOT NULL , email varchar(250) NOT NULL, model_name varchar(100), refrigerator_type varchar(100) NOT NULL, manufacturer_name varchar(100) NOT NULL, PRIMARY KEY (appliance_id, email), UNIQUE KEY (appliance_id, email), FOREIGN KEY (email) REFERENCES Household(email) ON DELETE CASCADE, FOREIGN KEY (manufacturer_name) REFERENCES Manufacturer(manufacturer_name) ON DELETE CASCADE);",
        "Washer": "CREATE TABLE Washer (appliance_id int NOT NULL , email varchar(250) NOT NULL, model_name varchar(100), loading_type varchar(100) NOT NULL, manufacturer_name varchar(100) NOT NULL, PRIMARY KEY (appliance_id, email), UNIQUE KEY (appliance_id, email), FOREIGN KEY (email) REFERENCES Household(email) ON DELETE CASCADE, FOREIGN KEY (manufacturer_name) REFERENCES Manufacturer(manufacturer_name) ON DELETE CASCADE);",
        "Dryer": "CREATE TABLE Dryer (appliance_id int NOT NULL , email varchar(250) NOT NULL, model_name varchar(100), heat_source varchar(100) NOT NULL, manufacturer_name varchar(100) NOT NULL, PRIMARY KEY (appliance_id, email), UNIQUE KEY (appliance_id, email), FOREIGN KEY (email) REFERENCES Household(email) ON DELETE CASCADE, FOREIGN KEY (manufacturer_name) REFERENCES Manufacturer(manufacturer_name) ON DELETE CASCADE);",
        "TV": "CREATE TABLE TV (appliance_id int NOT NULL , email varchar(250) NOT NULL, model_name varchar(100), display_type varchar(100) NOT NULL, display_size double(10, 2) NOT NULL, max_resolution varchar(100) NOT NULL, manufacturer_name varchar(100) NOT NULL, PRIMARY KEY (appliance_id, email), UNIQUE KEY (appliance_id, email), FOREIGN KEY (email) REFERENCES Household(email) ON DELETE CASCADE, FOREIGN KEY (manufacturer_name) REFERENCES Manufacturer(manufacturer_name) ON DELETE CASCADE);",
        "Cooker": "CREATE TABLE Cooker (appliance_id int NOT NULL , email varchar(250) NOT NULL, model_name varchar(100), manufacturer_name varchar(100) NOT NULL, PRIMARY KEY (appliance_id, email), UNIQUE KEY (appliance_id, email), FOREIGN KEY (email) REFERENCES Household(email) ON DELETE CASCADE, FOREIGN KEY (manufacturer_name) REFERENCES Manufacturer(manufacturer_name) ON DELETE CASCADE);",
        "Oven": "CREATE TABLE Oven (appliance_id int NOT NULL, email varchar(250) NOT NULL, oven_type varchar(100) NOT NULL, PRIMARY KEY (appliance_id, email), UNIQUE KEY (appliance_id, email), FOREIGN KEY (appliance_id) REFERENCES Cooker(appliance_id) ON DELETE CASCADE);",
        "Oven_Heat_Source": "CREATE TABLE Oven_Heat_Source (appliance_id int NOT NULL, email varchar(250) NOT NULL, heat_source varchar(100) NOT NULL, PRIMARY KEY (appliance_id, email, heat_source), UNIQUE KEY (appliance_id, email, heat_source), FOREIGN KEY (appliance_id, email) REFERENCES Oven(appliance_id, email) ON DELETE CASCADE);",
        "Cooktop": "CREATE TABLE Cooktop (appliance_id int NOT NULL, email varchar(250) NOT NULL, heat_source varchar(100) NOT NULL, PRIMARY KEY (appliance_id, email), UNIQUE KEY (appliance_id, email), FOREIGN KEY (appliance_id) REFERENCES Cooker(appliance_id) ON DELETE CASCADE);",
        "Full": "CREATE TABLE `Full` (bathroom_id int NOT NULL, email varchar(250) NOT NULL, sink_count int NOT NULL, bidet_count int NOT NULL, commode_count int NOT NULL, is_primary tinyint NOT NULL, bathtub_count int NOT NULL, shower_count int NOT NULL, tub_shower_count int NOT NULL, PRIMARY KEY (bathroom_id, email), UNIQUE KEY (bathroom_id, email), FOREIGN KEY (email) REFERENCES Household(email)  ON DELETE CASCADE);",
        "Half": "CREATE TABLE Half (bathroom_id int NOT NULL, email varchar(250) NOT NULL, sink_count int NOT NULL, bidet_count int NOT NULL, commode_count int NOT NULL, `name` varchar(100), PRIMARY KEY (bathroom_id, email), UNIQUE KEY (bathroom_id, email), FOREIGN KEY (email) REFERENCES Household(email) ON DELETE CASCADE);"
    }

    try:
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("USE " + db_name)
            for k, v in tables.items():
                if k == "Full":
                    check_query = """
                        SELECT COUNT(*)
                        FROM information_schema.tables
                        WHERE table_name = '{0}' and table_schema = '{1}'
                        """.format(k.replace('\'', '\'\''), db_name)
                else:
                    check_query = """
                        SELECT COUNT(*)
                        FROM information_schema.tables
                        WHERE table_name = '{0}' and table_schema = '{1}'
                        """.format(k.replace('\'', '\'\''), db_name)
                cursor.execute(check_query)
                number_of_table = cursor.fetchone()[0]
                if int(number_of_table) == 1:
                    conn.commit()
                    logging.info(k + " table already exists -- skipping")
                else:
                    logging.info('Creating table....' + k)
                    cursor.execute(v)
                    logging.info("table is created....")
                    if k == 'Location':
                        insert_location()
                    logging.info(cursor.fetchone())
                    conn.commit()

            return {
                "Status": 200
            }

    except Exception as e:
        print("Error while connecting to MySQL", str(e))

        return {
            "Status": 500
        }


"""
==================
==================
Insert Household
==================
==================
"""


@app.route('/get/email', methods=['POST', 'GET', 'PUT'])
def get_email():
    """
    Function is used to grab the email address of the user as the input to see if it's valid -- no insert done here.
    """
    conn, db_name = connect()

    data = request.get_json()

    table_query = "SELECT email FROM " + db_name + ".Household WHERE email = '" + \
        str(data['email']) + "';"

    try:
        if conn.is_connected():
            cursor = conn.cursor()

            cursor.execute(table_query)
            fetched_emails = cursor.fetchall()
            conn.commit()
            if len(fetched_emails) == 0:
                return {
                    "Status": 404
                }
            else:
                return {
                    "Status": 200
                }

    except Exception as e:
        print("Error while connecting to MySQL", str(e))


@app.route('/get/postal_code', methods=['POST', 'GET', 'PUT'])
def get_postal_code():
    """
    Function is used to grab the postal code of the location as the input to see if it's valid -- no insert done here.
    """

    conn, db_name = connect()

    data = request.get_json()

    table_query = "SELECT postal_code FROM " + db_name + ".Location WHERE postal_code = '" + \
        str(data['postal_code']) + "';"

    try:
        if conn.is_connected():
            cursor = conn.cursor()

            cursor.execute(table_query)
            fetched_postals = cursor.fetchall()
            conn.commit()
            if len(fetched_postals) == 0:
                return {
                    "Status": 400
                }
            else:
                return {
                    "Status": 200
                }

    except Exception as e:
        print("Error while connecting to MySQL", str(e))


@app.route('/get/location', methods=['POST', 'GET', 'PUT'])
def get_location():

    conn, db_name = connect()

    data = request.get_json()

    table_query = "SELECT city, state FROM " + db_name + ".Location WHERE postal_code = '" + \
        str(data['postal_code']) + "';"

    try:
        if conn.is_connected():
            cursor = conn.cursor()

            cursor.execute(table_query)
            fetched_postals = cursor.fetchall()
            conn.commit()
            if len(fetched_postals) == 0:
                return {
                    "Status": 400
                }
            else:
                return {
                    "Status": 200,
                    "city": fetched_postals[0][0],
                    "state": fetched_postals[0][1]
                }

    except Exception as e:
        print("Error while connecting to MySQL", str(e))


@app.route('/insert/household', methods=['POST', 'GET', 'PUT'])
def insert_household_and_phone():

    conn, db_name = connect()

    data = request.get_json()

    email = data['email']
    postal_code = data['postal_code']
    home_type = data['home_type']
    square_footage = data['sq']
    occupant_count = data['occupant_count']
    bedroom_count = data['bedroom_count']
    phone_number = data['phone_number']
    phone_type = data['type']

    area_code = phone_number[:3]
    phone_number_desired = phone_number[3:]

    table_query1 = "INSERT INTO " + db_name + ".Household(email,home_type,square_footage,occupant_count,bedroom_count,postal_code) VALUES ('" + \
        email + "','" + home_type + "','" + str(square_footage) + "','" + str(
            occupant_count) + "','" + str(bedroom_count) + "','"+postal_code+"');"
    table_query2 = "INSERT INTO " + db_name + ".Phone_Number(area_code,phone_number,phone_type,email) VALUES ('" + \
        area_code + "',REPLACE('" + phone_number_desired + \
        "','-',''),'" + phone_type + "','" + email + "');"
    try:
        if conn.is_connected():
            cursor = conn.cursor()

            cursor.execute(table_query1)
            if (phone_number.lower() != 'na') and (phone_type.lower() != 'na'):
                cursor.execute(table_query2)
            conn.commit()

            return {
                "Status": 200
            }

    except Exception as e:
        print("Error while connecting to MySQL", str(e))
        if 'phone_number.PRIMARY' in str(e):
            message = "Phone number already in use!"
        elif 'household.PRIMARY' in str(e):
            message = "Household already exists!"
        else:
            message = str(e)
        return {
            "Status": 500,
            "Message":  message
        }


@app.route('/get/phone_number', methods=['POST', 'GET', 'PUT'])
def get_phone_number():
    """
    Function is used to check the input phone number to see if it's valid -- no insert done here.
    """

    conn, db_name = connect()

    data = request.get_json()

    table_query = ' '.join([
        "SELECT CONCAT(area_code, phone_number) ",
        f"FROM {db_name}.Phone_Number ",
        f"WHERE area_code = '{str(data['area_code'])}' ",
        f"AND phone_number = REPLACE('{str(data['number'])}', '-', '');"
    ])

    try:
        if conn.is_connected():
            cursor = conn.cursor()

            cursor.execute(table_query)
            fetched_postals = cursor.fetchall()
            conn.commit()
            if len(fetched_postals) == 0:
                return {
                    "Status": 400
                }
            else:
                return {
                    "Status": 200
                }

    except Exception as e:
        print("Error while connecting to MySQL", str(e))


def insert_phone():
    """
    This function will be used in for inserting phone number after the household info is filled and inserted.
    """

    conn, db_name = connect()

    data = request.get_json()

    email = data['email']
    area_code = data['area_code']
    phone_number = data['number']
    phone_type = data['type']

    table_query = ' '.join([
        "INSERT INTO ",
        f"{db_name}.Phone_Number(area_code,phone_number,phone_type,email) ",
        f"VALUES ('{area_code}',REPLACE('{phone_number}','-',''),'{phone_type}','{email}');"
    ])

    return [table_query]


"""
==================
==================
View Reports
==================
==================
"""


@app.route('/get/laundryCenterReport/1', methods=['GET', 'POST', 'PUT'])
def get_laundryCenterReport1():
    """
    Function runs the query for Laundry Center Report
    """
    conn, db_name = connect()

    table_query = """
        SELECT DISTINCT Location.state as States,
        (
            SELECT 
                Washer.loading_type
            FROM
                Household
                LEFT JOIN
                Washer ON Washer.email = Household.email
                LEFT JOIN
                Location ON Household.postal_code = Location.postal_code
            WHERE Location.state = States
            GROUP BY Washer.loading_type
            ORDER BY COUNT(Washer.loading_type) DESC
            LIMIT 1
        ) as "Loading Type",
        (
            SELECT 
                Dryer.heat_source
            FROM
                Household
                    LEFT JOIN
                Dryer ON Dryer.email = Household.email
                    LEFT JOIN
                Location ON Household.postal_code = Location.postal_code
            WHERE Location.state = States
            GROUP BY Dryer.heat_source
            ORDER BY COUNT(Dryer.heat_source) DESC
            LIMIT 1
        ) as "Heat Source"
        FROM Household
        LEFT JOIN Location ON Household.postal_code = Location.postal_code
        ORDER BY States ASC;
    """
    try:
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("USE " + db_name)
            cursor.execute(table_query)
            fetched_rows = cursor.fetchall()

            conn.commit()
            return {
                "Status": 200,
                "Rows": fetched_rows
            }
    except Exception as e:
        print("Error while connecting to MySQL", str(e))


@app.route('/get/laundryCenterReport/2', methods=['GET', 'POST', 'PUT'])
def get_laundryCenterReport2():
    """
    Function runs the query for Laundry Center Report
    """
    conn, db_name = connect()
    table_query = """
        WITH results as (SELECT 
            Location.state AS 'State',
            COUNT(Household.email) AS 'Household Count'
        FROM
            Household
                LEFT JOIN
            Location ON Household.postal_code = Location.postal_code
        WHERE
            NOT EXISTS( SELECT 
                    email
                FROM
                    Dryer
                WHERE
                    Household.email = Dryer.email)
                AND EXISTS( SELECT 
                    email
                FROM
                    Washer
                WHERE
                    Household.email = Washer.email)
        GROUP BY Location.state) 
        SELECT DISTINCT results.state, results.`Household Count`
        from results 
        UNION 
        SELECT Location.state, 0 as `Household Count`
        FROM Location WHERE Location.state not in (SELECT state from results)
        ORDER BY `Household Count` DESC;
    """

    try:
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute(QUERY_TIMEOUT)
            cursor.execute("USE " + db_name)

            cursor.execute(table_query)
            fetched_rows = cursor.fetchall()

            conn.commit()
            return {
                "Status": 200,
                "Rows": fetched_rows
            }
    except Exception as e:
        print("Error while connecting to MySQL", str(e))


@app.route('/get/top25', methods=['GET'])
def get_top_25_manufacturers():
    """Function for Top 25 Manufacturers Report"""
    query = """
            SELECT manufacturer_name as manufacturer,
        (
            SELECT COUNT(*)
            FROM Cooker as c
            WHERE manufacturer_name = manufacturer
        ) + (
            SELECT COUNT(*)
            FROM TV as t
            WHERE t.manufacturer_name = manufacturer
        ) + (
            SELECT COUNT(*)
            FROM Refrigerator_Freezer as r
            WHERE r.manufacturer_name = manufacturer
        ) + (
            SELECT COUNT(*)
            FROM Washer as w
            WHERE w.manufacturer_name = manufacturer
        ) + (
            SELECT COUNT(*)
            FROM Dryer as d
            WHERE d.manufacturer_name = manufacturer
        ) as number_of_appliances
        FROM manufacturer
        ORDER BY number_of_appliances desc
        LIMIT 25;
    """
    try:
        conn, db_name = connect()
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute(QUERY_TIMEOUT)
            cursor.execute("USE " + db_name)

            cursor.execute(query)
            fetched_rows = cursor.fetchall()

            conn.commit()
            return {
                "Status": 200,
                "Rows": fetched_rows
            }
    except Exception as e:
        print("Error while connecting to MySQL", str(e))
        return {
            "Status": 500
        }


@app.route('/get/drilldown/manufacturer', methods=['POST'])
def get_drilldown_report():
    """Function for Top 25 Manufacturers Report - Drilldown"""
    data = request.get_json()
    manufacturer = data["manufacturer"]
    query = f"""
        SELECT "Cooker" as "Type",
        count(*) as raw_count
        FROM Cooker as c
        WHERE c.manufacturer_name = '{manufacturer}'
        UNION
        SELECT "TV" as "Type",
        count(*) as raw_count
        FROM TV as t
        WHERE t.manufacturer_name = '{manufacturer}'
        UNION
        SELECT "Washer" as "Type",
        count(*) as raw_count
        FROM Washer as w
        WHERE w.manufacturer_name = '{manufacturer}'
        UNION
        SELECT "Dryer" as "Type",
        count(*) as raw_count
        FROM Dryer as d
        WHERE d.manufacturer_name = '{manufacturer}' 
        UNION 
        SELECT "Refrigerator/Freezer" as "Type",
            count(*) as raw_count
        FROM refrigerator_freezer as rf
        WHERE rf.manufacturer_name = '{manufacturer}'
        ORDER BY raw_count DESC;
    """
    try:
        conn, db_name = connect()
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("USE " + db_name)

            cursor.execute(query)
            fetched_rows = cursor.fetchall()

            conn.commit()
            return {
                "Status": 200,
                "Rows": fetched_rows
            }
    except Exception as e:
        print("Error while connecting to MySQL", str(e))
        return {
            "Status": 500
        }


@app.route('/get/manufacturer_model_search', methods=['POST'])
def get_manufacturer_model_search():
    """Function for Manufacturer/Model Search"""
    data = request.get_json()
    search = data["search"]
    query = f"""
        SELECT manufacturer_name,
        IFNULL(model_name, '') as model
        FROM Cooker
        WHERE LOWER(manufacturer_name) LIKE LOWER('%{search}%')
        OR LOWER(model_name) LIKE LOWER('%{search}%')
        UNION
        SELECT manufacturer_name,
        IFNULL(model_name, '')
        FROM TV
        WHERE LOWER(manufacturer_name) LIKE LOWER('%{search}%')
        OR LOWER(model_name) LIKE LOWER('%{search}%')
        UNION
        SELECT manufacturer_name,
        IFNULL(model_name, '') as model
        FROM Refrigerator_Freezer
        WHERE LOWER(manufacturer_name) LIKE LOWER('%{search}%')
        OR LOWER(model_name) LIKE LOWER('%{search}%')
        UNION
        SELECT manufacturer_name,
        IFNULL(model_name, '') as model
        FROM Washer
        WHERE LOWER(manufacturer_name) LIKE LOWER('%{search}%')
        OR LOWER(model_name) LIKE LOWER('%{search}%')
        UNION
        SELECT manufacturer_name,
        IFNULL(model_name, '') as model
        FROM Dryer
        WHERE LOWER(manufacturer_name) LIKE LOWER('%{search}%')
        OR LOWER(model_name) LIKE LOWER('%{search}%')
        ORDER BY manufacturer_name ASC,
        model ASC;
    """
    try:
        conn, db_name = connect()
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("USE " + db_name)

            cursor.execute(query)
            fetched_rows = cursor.fetchall()

            conn.commit()
            return {
                "Status": 200,
                "Rows": fetched_rows
            }
    except Exception as e:
        print("Error while connecting to MySQL", str(e))
        return {
            "Status": 500
        }


@app.route('/reports/householdAvg', methods=['GET', 'POST', 'PUT'])
def get_householdAvg():
    conn, db_name = connect()

    data = request.get_json()

    table_query1 = f"SELECT postal_code FROM {db_name}.Location WHERE postal_code = {str(data['postal_code'])};"

    table_query2 = f"""
        with postal_codes as 
	(SELECT house_postal_code2
	FROM 
	(
		Select house_postal_code1, house_postal_code2,
		3958.75*2*atan2(sqrt(sin((Radians(latitude2) - Radians(latitude1))/2)*sin((Radians(latitude2) - Radians(latitude1))/2) + cos(Radians(latitude1))*cos(Radians(latitude2))*sin((Radians(longitude2)-Radians(longitude1))/2)*sin((Radians(longitude2)-Radians(longitude1))/2)), sqrt(1-sin((Radians(latitude2) - Radians(latitude1))/2)*sin((Radians(latitude2) - Radians(latitude1))/2) + cos(Radians(latitude1))*cos(Radians(latitude2))*sin((Radians(longitude2)-Radians(longitude1))/2)*sin((Radians(longitude2)-Radians(longitude1))/2))) as haversinedistance
		FROM
		(
			Select DISTINCT h.postal_code as house_postal_code1 ,  l.latitude as latitude1 , l.longitude as longitude1
			FROM Household h
			INNER JOIN Location l ON h.postal_code = l.postal_code
			WHERE h.postal_code  = {str(data['postal_code'])} 
		) as a
		CROSS JOIN
		(
			Select DISTINCT h.postal_code as house_postal_code2 ,  l.latitude as latitude2 , l.longitude as longitude2
			FROM Household h
			INNER JOIN Location l ON h.postal_code = l.postal_code
		) as b 
		HAVING haversinedistance <= {str(data['radius'])}
	) as c
)
select 
    {str(data['postal_code'])} as postal_code,
    {str(data['radius'])} as search_radius,
	round(sum(bedroom_count)/sum(num_households), 1) as avg_bedroom_count, 
    round(sum(half_count + full_count)/sum(num_households), 1) as avg_bathroom_count,
    round(sum(occupant_count)/sum(num_households), 0) as avg_occupant_count,
    CONCAT("1:", ROUND(sum(occupant_count)/(sum(half_commode_count) + sum(full_commode_count)), 2)) as ratio_commodes_to_occupants,
    round(sum(cooker_count + tv_count + washer_count + dryer_count + fridge_count)/sum(num_households), 1) as avg_appliance_count,
    heat_source as most_common_heat_source
from (select distinct 
(select count(email) from Household where household.postal_code=house_postal_code2) as num_households,
(select sum(bedroom_count) FROM Household Where household.postal_code=house_postal_code2) as bedroom_count,
(select sum(occupant_count) FROM Household Where household.postal_code=house_postal_code2) as occupant_count,
( select sum(Half.commode_count) From Half JOIN Household ON Half.email=Household.email  where household.postal_code=house_postal_code2) as half_commode_count,
( select sum(Full.commode_count) From Full JOIN Household ON Full.email=Household.email where household.postal_code=house_postal_code2) as full_commode_count,
( select count(Half.bathroom_id) From Half JOIN Household ON Half.email=Household.email  where household.postal_code=house_postal_code2) as half_count,
( select count(Full.bathroom_id) From Full JOIN Household ON Full.email=Household.email where household.postal_code=house_postal_code2) as full_count,
( select count(cooker.appliance_id) From Cooker JOIN Household ON cooker.email=Household.email where household.postal_code=house_postal_code2) as cooker_count,
( Select count(tv.appliance_id) From TV JOIN Household on  tv.email=household.email where household.postal_code=house_postal_code2) as tv_count,
( SELECT count(washer.appliance_id) From Washer JOIN Household on  washer.email=household.email where household.postal_code=house_postal_code2) as washer_count,
( SELECT count(dryer.appliance_id) From dryer JOIN Household on  dryer.email=household.email where household.postal_code=house_postal_code2) as dryer_count,
( SELECT count(refrigerator_freezer.appliance_id) From refrigerator_freezer JOIN Household on  refrigerator_freezer.email=household.email where household.postal_code=house_postal_code2) as fridge_count,
(select hs from (
select dryer.heat_source as hs
from dryer JOIN Household on dryer.email=household.email where household.postal_code in (select house_postal_code2 from postal_codes) 
union all
select oven_heat_source.heat_source as hs
from oven_heat_source JOIN Household on oven_heat_source.email=household.email where household.postal_code in (select house_postal_code2 from postal_codes) 
union all
select cooktop.heat_source as hs
from cooktop JOIN Household on cooktop.email=household.email where household.postal_code in (select house_postal_code2 from postal_codes) ) as counts
group by hs order by count(hs) desc limit 1) as heat_source
FROM household JOIN postal_codes ON household.postal_code=house_postal_code2) as nums;

SELECT 	round(sum(bedroom_count)/sum(num_households), 1) as avg_bedroom_count, 

    round(sum(half_count + full_count)/sum(num_households), 1) as avg_bathroom_count,
    round(sum(occupant_count)/sum(num_households), 1) as avg_occupant_count,
    CONCAT("1:", ROUND(sum(occupant_count)/(sum(half_commode_count) + sum(full_commode_count)), 3)) as ratio_commodes_to_occupants,
    round(sum(cooker_count + tv_count + washer_count + dryer_count + fridge_count)/sum(num_households), 1) as avg_appliance_count,
    heat_source as most_common_heat_source
from (select distinct 
(select count(email) from Household where household.postal_code=house_postal_code2) as num_households,
(select sum(bedroom_count) FROM Household Where household.postal_code=house_postal_code2) as bedroom_count,
(select sum(occupant_count) FROM Household Where household.postal_code=house_postal_code2) as occupant_count,
( select sum(Half.commode_count) From Half JOIN Household ON Half.email=Household.email  where household.postal_code=house_postal_code2) as half_commode_count,
( select sum(Full.commode_count) From Full JOIN Household ON Full.email=Household.email where household.postal_code=house_postal_code2) as full_commode_count,
( select count(Half.bathroom_id) From Half JOIN Household ON Half.email=Household.email  where household.postal_code=house_postal_code2) as half_count,
( select count(Full.bathroom_id) From Full JOIN Household ON Full.email=Household.email where household.postal_code=house_postal_code2) as full_count,
( select count(cooker.appliance_id) From Cooker JOIN Household ON cooker.email=Household.email where household.postal_code=house_postal_code2) as cooker_count,
( Select count(tv.appliance_id) From TV JOIN Household on  tv.email=household.email where household.postal_code=house_postal_code2) as tv_count,
( SELECT count(washer.appliance_id) From Washer JOIN Household on  washer.email=household.email where household.postal_code=house_postal_code2) as washer_count,
( SELECT count(dryer.appliance_id) From dryer JOIN Household on  dryer.email=household.email where household.postal_code=house_postal_code2) as dryer_count,
( SELECT count(refrigerator_freezer.appliance_id) From refrigerator_freezer JOIN Household on  refrigerator_freezer.email=household.email where household.postal_code=house_postal_code2) as fridge_count,
(select hs from (
select dryer.heat_source as hs
from dryer JOIN Household on dryer.email=household.email where household.postal_code in (select house_postal_code2 from postal_codes) 
union all
select oven_heat_source.heat_source as hs
from oven_heat_source JOIN Household on oven_heat_source.email=household.email where household.postal_code in (select house_postal_code2 from postal_codes) 
union all
select cooktop.heat_source as hs
from cooktop JOIN Household on cooktop.email=household.email where household.postal_code in (select house_postal_code2 from postal_codes) ) as counts
group by hs order by count(hs) desc limit 1) as heat_source
FROM household JOIN postal_codes ON household.postal_code=house_postal_code2) as nums;"""

    try:
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("USE " + db_name)
            cursor.execute(table_query1)
            fetched_rows = cursor.fetchall()
            cursor.execute(table_query2)
            fetched_rows2 = cursor.fetchall()
            if len(fetched_rows) == 0:
                return {'Status': 404,
                        }
            elif len(fetched_rows) == 1 and len(set(fetched_rows2[0][2:])) == 1 and None in set(fetched_rows2[0][2:]):

                return {'Status': 204,
                        "SQLOUTPUT": fetched_rows2}
            else:

                return {
                    "Status": 200,
                    "SQLOUTPUT": fetched_rows2
                }
    except Exception as e:
        print("Error while connecting to MySQL", traceback.format_exc())
        return {
            "Status": 500,
        }


@app.route('/get/bathroomStatistics', methods=['GET'])
def get_bathroom_statistics():
    """Function for Bathroom Statistics Report"""
    try:
        conn, db_name = connect()
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("USE " + db_name)

            cursor.execute(get_bathroom_statistics_query())
            stat_row = cursor.fetchall()

            cursor.execute(get_bidet_count_per_postal_code_query())
            postal_code_row = cursor.fetchall()
            cursor.execute(get_bidet_count_per_state_query())
            state_row = cursor.fetchall()
            cursor.execute(get_primary_bathroom_count_query())
            primary_cnt_row = cursor.fetchall()
            return {
                "Status": 200,
                "stats_row": stat_row,
                "bidet_postal_code_row": postal_code_row,
                "bidet_state_row": state_row,
                "primary_count_row": primary_cnt_row,
            }
    except Exception as e:
        print("Error while connecting to MySQL", str(e))
        return {
            "Status": 500,
        }


def get_bathroom_statistics_query():
    """Function for Bathroom Statistics query"""
    query = """
            SELECT
            MAX(totalCountTable.total_bathroom_count) AS max_bathroom_count,
            MIN(totalCountTable.total_bathroom_count) AS min_bathroom_count,
            ROUND((SUM(totalCountTable.total_bathroom_count)/COUNT(*)),1) AS avg_bathroom_count,
            MAX(totalCountTable.total_full_bathroom_count) as max_full_bathroom_count,
            MIN(totalCountTable.total_full_bathroom_count) AS min_full_bathroom_count,
            ROUND((SUM(totalCountTable.total_full_bathroom_count)/COUNT(*)),1) AS avg_full_bathroom_count,
            MAX(totalCountTable.total_half_bathroom_count) AS max_half_bathroom_count,
            MIN(totalCountTable.total_half_bathroom_count) AS min_half_bathroom_count,
            ROUND((SUM(totalCountTable.total_half_bathroom_count)/COUNT(*)),1) AS avg_half_bathroom_count,
            MAX(totalCountTable.total_commode_count) as max_commode_count,
            MIN(totalCountTable.total_commode_count) as min_commode_count,
            ROUND((SUM(totalCountTable.total_commode_count)/COUNT(*)),1) as avg_commode_count,
            MAX(totalCountTable.total_sink_count) as max_sink_count,
            MIN(totalCountTable.total_sink_count) as min_sink_count,
            ROUND((SUM(totalCountTable.total_sink_count)/COUNT(*)),1) as avg_sink_count,
            MAX(totalCountTable.total_bidet_count) as max_bidet_count,
            MIN(totalCountTable.total_bidet_count) as min_bidet_count,
            ROUND((SUM(totalCountTable.total_bidet_count)/COUNT(*)),1) as avg_bidet_count,
            MAX(totalCountTable.total_bathtub_count) as max_bathtub_count,
            MIN(totalCountTable.total_bathtub_count) as min_bathtub_count,
            ROUND((SUM(totalCountTable.total_bathtub_count)/COUNT(*)),1) as avg_bathtub_count,
            MAX(totalCountTable.total_shower_count) as max_shower_count,
            MIN(totalCountTable.total_shower_count) as min_shower_count,
            ROUND((SUM(totalCountTable.total_shower_count)/COUNT(*)),1) as avg_shower_count,
            MAX(totalCountTable.total_tub_shower_count) as max_tub_shower_count,
            MIN(totalCountTable.total_tub_shower_count) as min_tub_shower_count,
            ROUND((SUM(totalCountTable.total_tub_shower_count)/COUNT(*)),1) as avg_tub_shower_count
            FROM
            (
            SELECT email as email, SUM(derivedTable.bathroom_count) AS total_bathroom_count,
            SUM(derivedTable.full_bathroom_count) as total_full_bathroom_count,
            SUM(derivedTable.half_bathroom_count) as total_half_bathroom_count,
            SUM(derivedTable.bathroom_commode_count) as total_commode_count,
            SUM(derivedTable.bathroom_sink_count) as total_sink_count,
            SUM(derivedTable.bathroom_bidet_count) as total_bidet_count,
            SUM(derivedTable.bathroom_bathtub_count) as total_bathtub_count,
            SUM(derivedTable.bathroom_shower_count) as total_shower_count,
            SUM(derivedTable.bathroom_tub_shower_count) as total_tub_shower_count
            FROM
            (
            SELECT  email as "email", COUNT(*) as bathroom_count,
            COUNT(*) as full_bathroom_count, 0 as half_bathroom_count,
            SUM(commode_count) as bathroom_commode_count,
            SUM(sink_count) as bathroom_sink_count,
            SUM(bidet_count) as bathroom_bidet_count,
            SUM(bathtub_count) as bathroom_bathtub_count,
            SUM(shower_count) as bathroom_shower_count,
            SUM(tub_shower_count) as bathroom_tub_shower_count
            FROM `Full` GROUP BY email
            UNION ALL
            SELECT email as "email", COUNT(*) as bathroom_count,
            0 as full_bathroom_count, COUNT(*) as half_bathroom_count,
            SUM(commode_count) as bathroom_commode_count,
            SUM(sink_count) as bathroom_sink_count,
            SUM(bidet_count) as bathroom_bidet_count,
            0 as bathroom_bathtub_count,
            0 as bathroom_shower_count,
            0 as bathroom_tub_shower_count
            FROM Half GROUP BY email
            ) derivedTable
            GROUP BY email) totalCountTable;
        """
    return query


def get_bidet_count_per_state_query():
    """Function for calculating bidet count per state"""
    query = """
            SELECT totalBidetCountPerStateTable.state as state,
            totalBidetCountPerStateTable.total_bidet_count_state as max_bidet_count_state   
            FROM
            (
            SELECT Location.state as state, SUM(totalBidetCountPerPostalCode.total_bidet_count_postal_code) as total_bidet_count_state
            FROM
            (SELECT joinedTable.postal_code as postal_code, SUM(joinedTable.total_bidet_count) as total_bidet_count_postal_code
            FROM
            (SELECT Household.postal_code as postal_code, derivedTable.email as email ,
            SUM(derivedTable.bathroom_bidet_count) as total_bidet_count
            FROM 
            (
            SELECT  email as "email", SUM(bidet_count) as bathroom_bidet_count
            FROM `Full` GROUP BY email
            UNION ALL
            SELECT email as "email", SUM(bidet_count) as bathroom_bidet_count
            FROM Half GROUP BY email
            ) derivedTable
            INNER JOIN Household ON Household.email = derivedTable.email
            GROUP BY email) joinedTable
            GROUP BY postal_code ) totalBidetCountPerPostalCode
            INNER JOIN Location ON Location.postal_code = totalBidetCountPerPostalCode.postal_code
            GROUP BY state
            )totalBidetCountPerStateTable
            ORDER BY totalBidetCountPerStateTable.total_bidet_count_state DESC
            LIMIT 1;
            """
    return query


def get_bidet_count_per_postal_code_query():
    """Function for calculating bidet count per postal code"""
    query = """
            SELECT totalBidetCountPerPostalCodeTable.postal_code as postal_code,
            totalBidetCountPerPostalCodeTable.total_bidet_count_postal_code as max_bidet_count_postal_code
            FROM
            (
            SELECT joinedTable.postal_code as postal_code, SUM(joinedTable.total_bidet_count) as total_bidet_count_postal_code
            FROM
            (SELECT Household.postal_code as postal_code, derivedTable.email as email ,
            SUM(derivedTable.bathroom_bidet_count) as total_bidet_count
            FROM 
            (
            SELECT  email as "email", SUM(bidet_count) as bathroom_bidet_count
            FROM `Full` GROUP BY email
            UNION ALL
            SELECT email as "email", SUM(bidet_count) as bathroom_bidet_count
            FROM Half GROUP BY email
            ) derivedTable
            INNER JOIN Household ON Household.email = derivedTable.email
            GROUP BY email) joinedTable
            GROUP BY postal_code 
            ) totalBidetCountPerPostalCodeTable
            ORDER BY totalBidetCountPerPostalCodeTable.total_bidet_count_postal_code DESC
            LIMIT 1;
            """
    return query


def get_primary_bathroom_count_query():
    """Function for calculating primary bathrrom count"""
    query = """
            SELECT count(*) as single_primary_bathroom_count from 
            (SELECT  PrimaryFullTable.primary_bathroom_count as primary_bathroom_count 
            FROM
            (SELECT email as email, count(*)  as primary_bathroom_count, is_primary as is_primary from `Full`	
            where is_primary = 1  and email NOT IN (SELECT email from Half)
            GROUP BY email
            )PrimaryFullTable
            where primary_bathroom_count = 1)singlePrimaryFullTable;
            """
    return query


"""
==================
==================
Insert Appliances
==================
==================
"""


@app.route('/get/manufacturers', methods=['POST'])
def get_manufacturers():
    """
    Function that retrieves all manufacturers
    """
    conn, db_name = connect()
    query = """SELECT manufacturer_name FROM Manufacturer; """
    try:
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("USE " + db_name)
            cursor.execute(query)
            result = cursor.fetchall()
            return {
                "Status": 200,
                "Result": [r[0] for r in result]
            }

    except Exception as e:
        print("Error while connecting to MySQL", str(e))
        return {
            "Status": 500
        }


@app.route('/insert/half', methods=['GET', 'POST'])
def insert_half():
    conn, db_name = connect()
    data = request.get_json()
    bath_id = int(data['bath_id'])
    email = str(data['email'])
    sinks = data['sinks']
    bidets = data['bidets']
    commodes = data['commodes']
    non_unique_name = str(data['non_unique_name'])
    table_insert = ''.join(["INSERT INTO Half (bathroom_id,email,sink_count,bidet_count,commode_count,`name`)VALUES",
                           f"('{bath_id}','{email}','{sinks}','{bidets}','{commodes}','{non_unique_name}');"])
    try:
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("USE " + db_name)
            #sql = "INSERT INTO " + table_insert
            cursor.execute(table_insert)
            conn.commit()
            return {
                'Status': 200
            }
    except Exception as e:
        print("Error while connecting to MySQL", str(e))
        return {
            "Status": 500
        }


@app.route('/insert/full', methods=['GET', 'POST'])
def insert_full():
    conn, db_name = connect()
    data = request.get_json()
    if (data['is_primary'] == 'on'):
        primary = 1
    else:
        primary = 0
    bath_id = int(data['bath_id'])
    email = str(data['email'])
    sinks = data['sinks']
    bidets = data['bidets']
    commodes = data['commodes']
    bathtubs = data['bathtubs']
    showers = data['showers']
    tub_showers = data['tub_showers']
    table_insert = ''.join(["INSERT INTO `Full` (bathroom_id, email, sink_count, bidet_count, commode_count, is_primary, bathtub_count, shower_count,tub_shower_count) VALUES",
                           f"('{bath_id}','{email}','{sinks}','{bidets}','{commodes}','{primary}','{bathtubs}','{showers}','{tub_showers}');"])

    try:
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("USE " + db_name)
            cursor.execute(table_insert)
            conn.commit()
            return {
                'Status': 200
            }
    except Exception as e:
        print("Error while connecting to MySQL", str(e))
        return {
            "Status": 500
        }


@app.route("/get/bathroom_listing", methods=["POST"])
def get_bathroom_listing():
    """Function to get the bathroom listing for a household"""
    data = request.get_json()
    email = data["email"]
    query = f'''
        SELECT bathroom_id as bathroom_id,
        "Full" as "Type",
        CASE
        WHEN is_primary then 'Yes'
        ELSE ''
        END as "Primary"
        FROM `Full`
        WHERE email = '{email}'
        UNION
        SELECT bathroom_id as bathroom_id,
        "Half" as "Type",
        "" as "Primary"
        FROM Half
        WHERE email = '{email}'
        ORDER BY bathroom_id ASC;
    '''
    try:
        conn, db_name = connect()
        if conn.is_connected():
            cursor = conn.cursor()

            cursor.execute("USE " + db_name)
            cursor.execute(query)
            result = cursor.fetchall()
            return {
                "Status": 200,
                "Result": result
            }

    except Exception as e:
        print("Error while connecting to MySQL", str(e))
        return {
            "Status": 500
        }


@app.route("/get/primaryBathroomPresent", methods=["POST"])
def get_primary_bathroom_present():
    """Function to check if primary bathroom is present for a household"""
    data = request.get_json()
    email = data["email"]
    query = f'''
        SELECT * FROM `Full` WHERE is_primary = 1 AND email = '{email}';
    '''
    try:
        conn, db_name = connect()
        if conn.is_connected():
            cursor = conn.cursor()

            cursor.execute("USE " + db_name)
            cursor.execute(query)
            result = cursor.fetchone()
            if result == None:
                disable_primary = 0
            else:
                disable_primary = 1
            return {
                "Status": 200,
                "Result": disable_primary
            }

    except Exception as e:
        print("Error while connecting to MySQL", str(e))
        return {
            "Status": 500
        }


@app.route('/insert/appliances', methods=['GET', 'POST'])
def insert_appliances():
    """
    Function that executes the corresponding appliance subtype insert query
    based on the type of appliance.
    """
    function_map = {
        "TV": generate_tv_insertion_query,
        "Washer": generate_washer_insertion_query,
        "Dryer": generate_dryer_insertion_query,
        "Cooker": generate_cooker_insertion_query,
        "Fridge": generate_fridge_insertion_query

    }
    data = request.get_json()
    if request.method == 'POST':
        conn, db_name = connect()
        query = function_map.get(data['type'])(request)
        if data["manufacturer"] not in get_manufacturers()["Result"]:
            query.insert(
                0, f"INSERT INTO Manufacturer (manufacturer_name) VALUES ('{data['manufacturer']}')")
        try:
            if conn.is_connected():
                cursor = conn.cursor()
                cursor.execute("USE " + db_name)
                for q in query:
                    cursor.execute(q)
                    result = cursor.fetchall()
                    conn.commit()
                return {
                    "Status": 200
                }

        except Exception as e:
            print("Error while connecting to MySQL", str(e))
            return {
                "Status": 500
            }


def generate_tv_insertion_query(request):
    """
    Function to generate the TV insertion query given a set of data.
    """
    data = request.get_json()
    appliance_id = data['appliance_count']
    email = data['email']
    model_name = data['model_name']
    manufacturer_name = data['manufacturer']
    display_type = data['display_type']
    display_size = data['display_size']
    max_resolution = data['max_resolution']
    query = ' '.join([
        "INSERT INTO TV",
        "(appliance_id, email, model_name, manufacturer_name, display_type, display_size, max_resolution)",
        "VALUES",
        f"({appliance_id}, '{email}', '{model_name}', '{manufacturer_name}', '{display_type}', '{display_size}', '{max_resolution}');"
    ])
    return [query]


def generate_washer_insertion_query(request):
    """
    Function to generate the Washer insertion query given a set of data.
    """
    data = request.get_json()
    appliance_id = data['appliance_count']
    email = data['email']
    model_name = data['model_name']
    manufacturer_name = data['manufacturer']
    loading_type = data['loading_type'].lower()
    query = ' '.join([
        "INSERT INTO Washer",
        "(appliance_id, email, model_name, manufacturer_name, loading_type)",
        "VALUES",
        f"({appliance_id}, '{email}', '{model_name}', '{manufacturer_name}', '{loading_type}');"
    ])
    return [query]


def generate_dryer_insertion_query(request):
    """
    Function to generate the Dryer insertion query given a set of data.
    """
    data = request.get_json()
    appliance_id = data['appliance_count']
    email = data['email']
    model_name = data['model_name']
    manufacturer_name = data['manufacturer']
    heat_source = data['heat_source'].lower()
    query = ' '.join([
        "INSERT INTO Dryer",
        "(appliance_id, email, model_name, manufacturer_name, heat_source)",
        "VALUES",
        f"({appliance_id}, '{email}', '{model_name}', '{manufacturer_name}', '{heat_source}');"
    ])
    return [query]


def generate_cooker_insertion_query(request):
    """
    Function to generate the Cooker insertion query given a set of data.
    """
    queries = []

    data = request.get_json()

    is_oven = data['is_oven']
    is_cooktop = data['is_cooktop']

    appliance_id = int(data['appliance_count'])
    email = data['email']
    model_name = data['model_name']
    manufacturer_name = data['manufacturer']
    cooker_query = ' '.join([
        "INSERT INTO Cooker (appliance_id, email, model_name, manufacturer_name)",
        f"VALUES ({appliance_id}, '{email}', '{model_name}', '{manufacturer_name}');"
    ])
    queries.append(cooker_query)
    if is_oven == "Yes":
        oven_type = data['oven_data']['type'].lower()
        oven_heat_source = data['oven_data']['heat_source']
        oven_query = ' '.join([
            "INSERT INTO Oven (appliance_id, email, oven_type)",
            f"VALUES ({appliance_id}, '{email}', '{oven_type}');",
        ])
        queries.append(oven_query)
        for hs in oven_heat_source:
            if hs:
                hs = hs.lower()
            oven_heat_source_query = ' '.join([
                "INSERT INTO Oven_Heat_Source (appliance_id, email, heat_source)",
                f"VALUES ({appliance_id}, '{email}', '{hs}');"
            ])
            queries.append(oven_heat_source_query)

    if is_cooktop == "Yes":

        cooktop_heat_source = data['cooktop_data']['heat_source'].lower()
        cooktop_query = ' '.join([
            "INSERT INTO Cooktop (appliance_id, email, heat_source)",
            f"VALUES ({appliance_id}, '{email}', '{cooktop_heat_source}');"
        ])
        queries.append(cooktop_query)
    appliance_id += 1
    return queries


def generate_fridge_insertion_query(request):
    """
    Function to generate the Fridge insertion query given a set of data.
    """
    data = request.get_json()
    appliance_id = data['appliance_count']
    email = data['email']
    model_name = data['model_name']
    manufacturer_name = data['manufacturer']
    refrigerator_type = data['refrigerator_type'].lower()
    query = ' '.join([
        "INSERT INTO Refrigerator_Freezer",
        "(appliance_id, email, model_name, manufacturer_name, refrigerator_type)",
        "VALUES",
        f"({appliance_id}, '{email}', '{model_name}', '{manufacturer_name}', '{refrigerator_type}');"
    ])
    return [query]


@app.route("/get/appliance_listing", methods=["POST"])
def get_appliance_listing():
    """Function to get the appliance listing for a household"""
    data = request.get_json()
    email = data["email"]
    query = f'''
        SELECT o.appliance_id as appliance_id,
        "Cooker" as "Type",
        manufacturer_name as "Manufacturer",
        model_name as "Model"
        FROM Oven as o
        JOIN Cooker as c ON o.appliance_id = c.appliance_id
        AND o.email = c.email
        WHERE o.email = '{email}'
        UNION
        SELECT ct.appliance_id as appliance_id,
        "Cooker" as "Type",
        manufacturer_name as "Manufacturer",
        model_name as "Model"
        FROM Cooktop as ct
        JOIN Cooker as c ON ct.appliance_id = c.appliance_id
        AND ct.email = c.email
        WHERE ct.email = '{email}'
        UNION
        SELECT appliance_id as appliance_id,
        "TV" as "Type",
        manufacturer_name as "Manufacturer",
        model_name as "Model"
        FROM TV
        WHERE email = '{email}'
        UNION
        SELECT appliance_id as appliance_id,
        "Washer" as "Type",
        manufacturer_name as "Manufacturer",
        model_name as "Model"
        FROM Washer
        WHERE email = '{email}'
        UNION
        SELECT appliance_id as appliance_id,
        "Dryer" as "Type",
        manufacturer_name as "Manufacturer",
        model_name as "Model"
        FROM Dryer
        WHERE email = '{email}'
        UNION
        SELECT appliance_id as appliance_id,
        "Refrigerator/Freezer" as "Type",
        manufacturer_name as "Manufacturer",
        model_name as "Model"
        FROM Refrigerator_Freezer
        WHERE email = '{email}'
        ORDER BY appliance_id ASC;
    '''
    try:
        conn, db_name = connect()
        if conn.is_connected():
            cursor = conn.cursor()

            cursor.execute("USE " + db_name)
            cursor.execute(query)
            result = cursor.fetchall()
            return {
                "Status": 200,
                "Result": result
            }

    except Exception as e:
        print("Error while connecting to MySQL", str(e))
        return {
            "Status": 500
        }


@app.route("/get/avgTVSize", methods=["POST"])
def get_avg_TV_size():
    avgTVquery = """
        SELECT
        Location.state AS states,
        ROUND(AVG(TV.display_size), 1) AS avg_display_size
        FROM TV 
        RIGHT JOIN Household 
        ON TV.email = Household.email 
        RIGHT JOIN Location 
        ON Location.postal_code = Household.postal_code
        GROUP BY states
        ORDER BY states ASC;
    """
    try:
        conn, db_name = connect()
        if conn.is_connected():
            cursor = conn.cursor()

            cursor.execute("USE " + db_name)
            cursor.execute(avgTVquery)
            result1 = cursor.fetchall()
            return {
                "Status": 200,
                "Result1": result1
            }

    except Exception as e:
        print("Error while connecting to MySQL", str(e))
        return {
            "Status": 500
        }


@app.route("/get/avgTVSizeDrilldown", methods=["POST"])
def get_avg_TV_size_drilldown():
    data = request.get_json()
    state = data["state"]
    drilldownQuery = f"""
        SELECT
        Location.state AS states,
        TV.display_type AS display_type,
        TV.max_resolution AS max_resolution,
        ROUND(AVG(TV.display_size),1) AS avg_display_size
        FROM TV 
        INNER JOIN Household 
        ON TV.email = Household.email 
        INNER JOIN Location 
        ON Location.postal_code = Household.postal_code
        WHERE Location.state = '{state}'
        GROUP BY states, display_type, max_resolution
        ORDER BY avg_display_size DESC;
    """
    try:
        conn, db_name = connect()
        if conn.is_connected():
            cursor = conn.cursor()

            cursor.execute("USE " + db_name)
            cursor.execute(drilldownQuery)
            result2 = cursor.fetchall()
            return {
                "Status": 200,
                "Result2": result2
            }

    except Exception as e:
        print("Error while connecting to MySQL", str(e))
        return {
            "Status": 500
        }


@app.route("/get/extraFridge", methods=["POST"])
def get_extra_fridge():
    countquery = """
        SELECT COUNT(*) AS household_count_with_extra_fridge
        FROM (
        SELECT Refrigerator_Freezer.email, COUNT(*) AS fridge_count
        FROM Refrigerator_Freezer
        GROUP BY Refrigerator_Freezer.email
        HAVING fridge_count > 1
        ) AS Fridge_Count_Table;
    """

    toptenquery = """
        SELECT 
        hhc.state, 
        COUNT(hhc.email) AS household_count, 
        FORMAT((COUNT(cfc.email)/COUNT(hhc.email))*100, 'P0') AS chest_freezer_percent, FORMAT((COUNT(ufc.email)/COUNT(hhc.email))*100, 'P0') AS upright_freezer_percent, FORMAT((COUNT(oc.email)/COUNT(hhc.email))*100, 'P0') AS other_percent
        FROM 
        (
        SELECT l.state, ff.email, COUNT(*) AS fridge_count
        FROM Refrigerator_Freezer ff
        INNER JOIN Household h ON ff.email = h.email 
        INNER JOIN Location l ON l.postal_code = h.postal_code
                GROUP BY ff.email
                HAVING fridge_count > 1
        ) AS hhc
        LEFT JOIN
        (
        SELECT l.state, ff.email, 
        COUNT(*) AS fridge_count
                FROM Refrigerator_Freezer ff
        INNER JOIN Household h ON ff.email = h.email 
                INNER JOIN Location l ON l.postal_code = h.postal_code
                WHERE ff.refrigerator_type = 'chest freezer'
                GROUP BY ff.email
        ) AS cfc
        ON hhc.email = cfc.email
        LEFT JOIN
        (
        SELECT l.state, ff.email, COUNT(*) AS fridge_count
        FROM Refrigerator_Freezer ff
        INNER JOIN Household h ON ff.email = h.email 
        INNER JOIN Location l ON l.postal_code = h.postal_code
        WHERE ff.refrigerator_type = 'upright freezer'
        GROUP BY ff.email
        ) AS ufc
        ON hhc.email = ufc.email
        LEFT JOIN
        (
        SELECT l.state, ff.email, COUNT(*) AS fridge_count
        FROM Refrigerator_Freezer ff
        INNER JOIN Household h ON ff.email = h.email 
        INNER JOIN Location l ON l.postal_code = h.postal_code
        WHERE ff.refrigerator_type != 'chest freezer' 
        AND ff.refrigerator_type != 'upright freezer' 
        GROUP BY ff.email
        ) AS oc
        ON hhc.email = oc.email
        GROUP BY hhc.state
        ORDER BY household_count DESC 
        LIMIT 10;
    """

    try:
        conn, db_name = connect()
        if conn.is_connected():
            cursor = conn.cursor()

            cursor.execute("USE " + db_name)
            cursor.execute(countquery)
            result1 = cursor.fetchall()
            cursor.execute(toptenquery)
            result2 = cursor.fetchall()
            return {
                "Status": 200,
                "Result1": result1,
                "Result2": result2
            }

    except Exception as e:
        print("Error while connecting to MySQL", str(e))
        return {
            "Status": 500
        }


# Running app
if __name__ == '__main__':

    app.run(debug=True)
