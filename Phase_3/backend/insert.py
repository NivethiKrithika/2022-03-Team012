import math
import random
import pandas as pd
import mysql.connector as msql
from mysql.connector import Error
import os
from dotenv import load_dotenv

# Database Name
APP_ROOT = os.path.join(os.path.dirname(__file__), '.')
dotenv_path = os.path.join(APP_ROOT, '.env')
load_dotenv(dotenv_path)


def connect():
    try:
        mysql_host = os.getenv("DB_HOST")
        mysql_dbname = os.getenv("DB_DATABASE")
        mysql_user = os.getenv("DB_USERNAME")
        mysql_password = os.getenv("DB_PASSWORD")
        conn = msql.connect(host=mysql_host, user=mysql_user,
                            password=mysql_password)

        if conn.is_connected():
            cursor = conn.cursor()
            schema_query = """
            SELECT COUNT(*)
            FROM information_schema.tables
            WHERE table_schema = '{0}';
            """.format(mysql_dbname)
            cursor.execute(schema_query)
            if_exists = cursor.fetchone()[0]
            if int(if_exists) > 0:
                conn.commit()
                # print(mysql_dbname + " schema already exists")
            else:
                cursor.execute("CREATE DATABASE " + mysql_dbname)
                print("Database is created")

    except Error as e:
        print("Error while connecting to MySQL", e)

    return conn, mysql_dbname


def setup():
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

    # when selecting oven --> goes cooker, oven, oven_heat_source
    # generate_cooker_insertion_query

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
                else:
                    cursor.execute(v)
                    if k == 'Location':
                        insert_location()
                    print(cursor.fetchone())
                    conn.commit()

            return {
                "Status": 200
            }

    except Exception as e:
        print("Error while connecting to MySQL", str(e))

        return {
            "Status": 500
        }


def insert_household(table_insert, inserts):
    conn, db_name = connect()
    names = ['jagat', 'thakkar', 'suchi', 'kapur', 'tyler', 'kevin',
             'tady', 'nive', 'jeyraj', 'jt', 'sk', 't', 'kt', 'nj']
    domain = ['@email', '@mail',
              '@google', '@yahoo', '@gatech', '@purdue', '@leo']

    tlds = ['.com', '.org', '.edu', '.io', '.ca', '.in']

    states = ['TX', 'IL', 'CA', 'NY', 'NJ', 'GA']
    postal_code_list = []

    home_type = ['apartment', 'house']

    emails = []

    try:
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("USE " + db_name)

            # Find Zips
            for state in states:
                cursor.execute(
                    'SELECT postal_code FROM ' + db_name + '.Location WHERE Location.state = \'' + state + '\'')
                zips = cursor.fetchall()
                for val in zips:
                    postal_code_list.append(str(val[0]))

            # Insert's
            for i in range(inserts):
                email_generated = random.choice(
                    names) + str(random.randint(1, 1000)) + random.choice(domain) + random.choice(tlds)

                if email_generated in emails:
                    print("Email inside table already. Query will be ran\t" +
                          str(inserts - 1) + " times")
                    continue
                else:
                    emails.append(email_generated)

                house_generated = random.choice(home_type)
                occupant_count_generated = random.randint(1, 4)
                square_footage_generated = random.randint(
                    650, 900) * occupant_count_generated

                bedroom_count_generated = math.ceil(
                    occupant_count_generated / random.randint(1, 2))

                postal_code_generated = random.choice(postal_code_list)

                sql = "INSERT INTO " + table_insert
                cursor.execute(sql, (email_generated, house_generated, square_footage_generated,
                               occupant_count_generated, bedroom_count_generated, postal_code_generated))
                conn.commit()

    except Error as e:
        print("Error while connecting to MySQL", e)


def insert_location(table_query, table_insert):

    df = pd.read_csv(csv_name, sep=',', quotechar='\'', encoding='utf8')

    try:
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("USE " + db_name)
            record = cursor.fetchone()

            print('Creating table....')
            cursor.execute("CREATE TABLE " + table_query)
            print("table is created....")
            for i, row in df.iterrows():
                sql = "INSERT INTO " + table_insert
                cursor.execute(sql, tuple(row))
                conn.commit()
    except Error as e:
        print("Error while connecting to MySQL", e)


def insert_manufacturer(table_insert):
    conn, db_name = connect()

    names = ['Whirlpool', 'GE', 'Bosch', 'Samsung',
             'LG', 'Vizio', 'Panasonic', 'Haier', 'Gree']

    try:
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("USE " + db_name)

            # Iterates through names of list
            for val in names:
                sql = "INSERT INTO " + table_insert
                cursor.execute(sql, [val])
                conn.commit()

            return names

    except Error as e:
        print("Error while connecting to MySQL", e)


def get_appliance_id(db_name, email):
    return """
            SELECT COUNT(appliance_id) as appliance_id
                FROM {0}.Cooker
                WHERE email = '{1}'
                UNION
                SELECT COUNT(appliance_id) as appliance_id
                FROM {0}.TV
                WHERE email = '{1}'
                UNION
                SELECT COUNT(appliance_id) as appliance_id
                FROM {0}.Washer
                WHERE email = '{1}'
                UNION
                SELECT COUNT(appliance_id) as appliance_id
                FROM {0}.Dryer
                WHERE email = '{1}'
                UNION
                SELECT COUNT(appliance_id) as appliance_id
                FROM {0}.Refrigerator_Freezer
                WHERE email = '{1}'
                ORDER BY appliance_id DESC
                LIMIT 1
            """.format(db_name, email.format('\'', '\'\''))


def insert_washer(table_insert):
    conn, db_name = connect()

    loading_type_list = ["Top", "Front"]
    emails = []
    manufacturers = []

    try:
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("USE " + db_name)

            # Find Emails
            cursor.execute('SELECT email FROM Household')
            fetched_emails = cursor.fetchall()
            for val in fetched_emails:
                emails.append(str(val[0]))

            # Find manufactuer names
            cursor.execute('SELECT manufacturer_name FROM Manufacturer')
            fetched_names = cursor.fetchall()
            for val in fetched_names:
                manufacturers.append(str(val[0]))

            # Iterates through names of list
            for email in emails:
                id_queried = get_appliance_id(db_name, email)
                cursor.execute(id_queried)
                id = cursor.fetchone()
                id = int(id[0])
                if id == None or id == 0:
                    id = 1
                loading_type = random.choice(loading_type_list)
                manufacturer = random.choice(manufacturers)
                sql = "INSERT INTO " + table_insert
                sql = sql.format(id, email.replace('\'', '\'\''), manufacturer.replace(
                    '\'', '\'\''), loading_type.replace('\'', '\'\''))
                cursor.execute(sql)
                conn.commit()
        return 100
    except Error as e:
        print("Error while connecting to MySQL", e)


def insert_dryer(table_insert):
    conn, db_name = connect()

    heat_source_list = ["Gas", "Electric", "None"]
    emails = []
    manufacturers = []

    try:
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("USE " + db_name)

            # Find Emails
            cursor.execute('SELECT email FROM Household')
            fetched_emails = cursor.fetchall()
            for val in fetched_emails:
                emails.append(str(val[0]))

            # Find manufactuer names
            cursor.execute('SELECT manufacturer_name FROM Manufacturer')
            fetched_names = cursor.fetchall()
            for val in fetched_names:
                manufacturers.append(str(val[0]))

            # Iterates through names of list
            for email in emails:
                binary = random.choice([0, 1])
                if binary:
                    id_queried = get_appliance_id(db_name, email)
                    cursor.execute(id_queried)
                    id = cursor.fetchone()
                    id = int(id[0]) + 1
                    heat_type = random.choice(heat_source_list)
                    manufacturer = random.choice(manufacturers)
                    sql = "INSERT INTO " + table_insert
                    sql = sql.format(id, email.replace('\'', '\'\''), manufacturer.replace(
                        '\'', '\'\''), heat_type.replace('\'', '\'\''))
                    cursor.execute(sql)
                    conn.commit()
        return 100
    except Error as e:
        print("Error while connecting to MySQL", e)


def insert_tv(table_insert):
    conn, db_name = connect()

    model_name = ["x100", "x200", "x300", "x400", "x500"]
    display_type = ["LED", "LCD", "Plasma", "Tube", "DLP"]
    display_size = [35.00, 50.00, 65.00, 45.00, 42]
    max_resolution = ["1080p", "4K", "8K",
                      "480i", "576i", "720p", "1080i", "1440p"]

    emails = []
    manufacturers = ['Samsung', 'LG', 'Vizio', 'Panasonic']

    try:
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("USE " + db_name)

            # Find Emails
            cursor.execute('SELECT email FROM Household')
            fetched_emails = cursor.fetchall()
            for val in fetched_emails:
                emails.append(str(val[0]))

            # Iterates through names of list
            for email in emails:
                quanity = random.choice([1, 2])
                id_queried = get_appliance_id(db_name, email)
                cursor.execute(id_queried)
                id = cursor.fetchone()
                id = int(id[0]) + 1

                for i in range(id, id + quanity):
                    model_name_generated = random.choice(model_name)
                    display_type_generated = random.choice(display_type)
                    display_size_generated = random.choice(display_size)
                    max_resolution_generated = random.choice(max_resolution)
                    manufacturer_generated = random.choice(manufacturers)
                    sql = "INSERT INTO " + table_insert
                    sql = sql.format(i, email.replace('\'', '\'\''), model_name_generated.replace('\'', '\'\''), display_type_generated.replace('\'', '\'\''),
                                     display_size_generated, max_resolution_generated.replace('\'', '\'\''), manufacturer_generated.replace('\'', '\'\''))
                    cursor.execute(sql)
                    cursor.fetchall()
                    conn.commit()
        return 100
    except Error as e:
        print("Error while connecting to MySQL", e)


def insert_fridge(table_insert):
    conn, db_name = connect()

    fridge_type = ["Bottom freezer refrigerator", "French door refrigerator",
                   "Side-by-side refrigerator", "Top freezer refrigerator", "Chest freezer", "Upright freezer"]

    emails = []
    manufacturers = []

    try:
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("USE " + db_name)

            # Find Emails
            cursor.execute('SELECT email FROM Household')
            fetched_emails = cursor.fetchall()
            for val in fetched_emails:
                emails.append(str(val[0]))

            # Find manufactuer names
            cursor.execute('SELECT manufacturer_name FROM Manufacturer')
            fetched_names = cursor.fetchall()
            for val in fetched_names:
                manufacturers.append(str(val[0]))

            # Iterates through names of list
            for email in emails:
                quanity = random.choice([1, 2, 3])
                id_queried = get_appliance_id(db_name, email)
                cursor.execute(id_queried)
                id = cursor.fetchone()
                id = int(id[0]) + 1

                for i in range(id, id + quanity):
                    manufacturer_generated = random.choice(manufacturers)
                    model_name_generated = manufacturer_generated + \
                        str(random.randint(10, 20))
                    fridge_type_generated = random.choice(fridge_type)

                    sql = "INSERT INTO " + table_insert
                    sql = sql.format(i, email.replace('\'', '\'\''), model_name_generated.replace(
                        '\'', '\'\''), manufacturer_generated.replace('\'', '\'\''), fridge_type_generated.replace('\'', '\'\''))
                    cursor.execute(sql)
                    cursor.fetchall()
                    conn.commit()
        return 100
    except Error as e:
        print("Error while connecting to MySQL", e)


def insert_cooker(cooker_insert, oven_insert, oven_hs_insert, cooktop_insert):
    conn, db_name = connect()

    cooker_type = ["Oven", "Cooktop", "Both"]
    oven_type = ["Convection", "Conventional"]
    oven_heat_sources = ["Gas", "Electric", "Microwave"]
    cooker_heat_sources = ["Electric", "Radiant Electric", "Induction"]

    emails = []
    manufacturers = []

    try:
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("USE " + db_name)

            # Find Emails
            cursor.execute('SELECT email FROM Household')
            fetched_emails = cursor.fetchall()
            for val in fetched_emails:
                emails.append(str(val[0]))

            # Find manufactuer names
            cursor.execute('SELECT manufacturer_name FROM Manufacturer')
            fetched_names = cursor.fetchall()
            for val in fetched_names:
                manufacturers.append(str(val[0]))

            # Iterates through names of list
            for email in emails:
                quanity = random.choice([1, 2, 3])
                id_queried = get_appliance_id(db_name, email)
                cursor.execute(id_queried)
                id = cursor.fetchone()
                id = int(id[0]) + 1

                for i in range(id, id + quanity):
                    manufacturer_generated = random.choice(manufacturers)
                    model_name_generated = manufacturer_generated + \
                        str(random.randint(10, 20))
                    cooker_type_generated = random.choice(cooker_type)

                    sql = "INSERT INTO " + cooker_insert
                    sql = sql.format(i, email.replace('\'', '\'\''), model_name_generated.replace(
                        '\'', '\'\''), manufacturer_generated.replace('\'', '\'\''))
                    cursor.execute(sql)
                    if cooker_type_generated == "Oven" or cooker_type_generated == "Both":
                        oven_type_generated = random.choice(oven_type)

                        sql = "INSERT INTO " + oven_insert
                        sql = sql.format(i, email.replace(
                            '\'', '\'\''), oven_type_generated.replace('\'', '\'\''))
                        cursor.execute(sql)
                        heat_source = random.choice(oven_heat_sources)
                        sql = "INSERT INTO " + oven_hs_insert
                        sql = sql.format(i, email.replace(
                            '\'', '\'\''), heat_source.replace('\'', '\'\''))
                        cursor.execute(sql)
                    if cooker_type_generated == "Cooktop" or cooker_type_generated == "Both":
                        heat_source = random.choice(cooker_heat_sources)
                        sql = "INSERT INTO " + cooktop_insert
                        sql = sql.format(i, email.replace(
                            '\'', '\'\''), heat_source.replace('\'', '\'\''))
                        cursor.execute(sql)

                    cursor.fetchall()
                    conn.commit()
        return 100
    except Error as e:
        print("Error while connecting to MySQL", e)


def insert_full_bathroom(table_insert):
    conn, db_name = connect()

    emails = []

    try:
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("USE " + db_name)

            # Find Emails and Square Footage
            cursor.execute(
                'SELECT email, square_footage, occupant_count FROM Household')
            fetched_emails = cursor.fetchall()
            for val in fetched_emails:
                emails.append(val)

            # Iterates through names of list
            for email in emails:
                if 1000 <= email[1] <= 1200:
                    quanity = 2
                elif email[1] > 1200 and email[2] > 2:
                    quanity = email[2]
                else:
                    quanity = 1

                for i in range(quanity):
                    if i == 0:
                        is_primary = 1
                    else:
                        is_primary = 0
                    which_option = random.choice(
                        ["1", "12", "13", "123", "2", "21", "23", "3"])
                    if "1" in which_option:
                        sinks_generated = random.choice([1, 2])
                    else:
                        sinks_generated = 0
                    if "2" in which_option:
                        bidets_generated = random.choice([1, 2])
                    else:
                        bidets_generated = 0
                    if "3" in which_option:
                        commodes_generated = random.choice([1, 2])
                    else:
                        commodes_generated = 0

                    which_shower = random.choice(["1", "2", "3", "12", "13"])
                    if "1" in which_shower:
                        shower_generated = 1
                    else:
                        shower_generated = 0
                    if "2" in which_shower:
                        bathtub_generated = 1
                    else:
                        bathtub_generated = 0
                    if "3" in which_shower:
                        tub_showers_generated = 1
                    else:
                        tub_showers_generated = 0

                    sql = "INSERT INTO " + table_insert
                    cursor.execute(sql, (email[0], sinks_generated, bidets_generated, commodes_generated,
                                   is_primary, bathtub_generated, shower_generated, tub_showers_generated))
                    conn.commit()
                else:
                    continue

    except Error as e:
        print("Error while connecting to MySQL", e)


def insert_half_bathroom(table_insert):
    conn, db_name = connect()

    emails = []

    try:
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("USE " + db_name)

            # Find Emails and Square Footage
            cursor.execute(
                'SELECT email, square_footage FROM Household')
            fetched_emails = cursor.fetchall()
            for val in fetched_emails:
                emails.append(val)

            # Iterates through names of list
            for email in emails:
                if email[1] < 1500:
                    quanity = 0
                else:
                    quanity = random.choice([1, 0])

                for i in range(quanity):

                    which_option = random.choice(
                        ["1", "12", "13", "123", "2", "21", "23", "3"])
                    if "1" in which_option:
                        sinks_generated = random.choice([1, 2])
                    else:
                        sinks_generated = 0
                    if "2" in which_option:
                        bidets_generated = random.choice([1, 2])
                    else:
                        bidets_generated = 0
                    if "3" in which_option:
                        commodes_generated = random.choice([1, 2])
                    else:
                        commodes_generated = 0

                    name = email[0][:email[0].index("@")]

                    sql = "INSERT INTO " + table_insert
                    cursor.execute(
                        sql, (email[0], sinks_generated, bidets_generated, commodes_generated, name))
                    conn.commit()
                else:
                    continue

    except Error as e:
        print("Error while connecting to MySQL", e)


def laundry_center_report(conn, db_name):
    try:
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("USE " + db_name)

            # Washer Type and Heat Source
            # cursor.execute(
            #   '''
            #   SELECT Location.state,
            #   (
            #     SELECT loading_type
            #     FROM Washer
            #     GROUP BY loading_type
            #     ORDER BY COUNT(*) DESC
            #   ) as "Washer Type",
            #   + (
            #     SELECT heat_source
            #     FROM Dryer
            #     GROUP BY heat_source
            #     ORDER BY COUNT(*) DESC
            #   ) as "Heat Source"
            #   FROM Household
            #     LEFT JOIN Location ON Household.postal_code = Location.postal_code
            #   ORDER BY Location.state ASC;
            #   '''
            # )
            # fetched_values_1 = cursor.fetchall()
            # print("\nGet Washer Type and Heat Source:\n")
            # print(fetched_values_1)
            # print()

            # Households with no dryer
            cursor.execute(
                '''
        SELECT Location.state as "State",
          COUNT(Household.email) as "Household Count"
        FROM Household
          LEFT JOIN Location ON Household.postal_code = Location.postal_code
        WHERE Household.postal_code = Location.postal_code
          and NOT EXISTS(
            SELECT email
            FROM Dryer
            WHERE Household.email = Dryer.email
          )
          and EXISTS (
            SELECT email
            FROM Washer
            WHERE Household.email = Washer.email
          )
        GROUP BY Location.state
        ORDER BY "Household Count" DESC;
        '''
            )
            fetched_values = cursor.fetchall()
            print("\nHouseholds with No Dryers:\n")
            print(fetched_values)
            print()

    except Error as e:
        print("Error while connecting to MySQL", e)


def validate(conn, db_name, table, limit):
    sql = "SELECT * FROM " + db_name + "." + table + " LIMIT " + str(limit)
    try:
        if conn.is_connected():
            cursor = conn.cursor()
        cursor.execute(sql)
        # Fetch all the records
        result = cursor.fetchall()
        for i in result:
            print(i)
    except Error as e:
        print("Error while connecting to MySQL", e)


def insert_phone_number(table_insert):
    conn, db_name = connect()

    types = ["Home", "Mobile", "Work", "Other"]
    emails = []

    try:
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("USE " + db_name)

            # Find Emails
            cursor.execute('SELECT email FROM Household')
            fetched_emails = cursor.fetchall()
            for val in fetched_emails:
                emails.append(str(val[0]))

            # Iterates through names of list
            for email in emails:
                binary = random.choice([0, 1])
                if binary:
                    quanity = random.choice([1, 2])

                    for i in range(quanity):
                        area_code_generated = random.randint(100, 999)
                        number_generated = random.randint(1000000, 9999999)
                        type_generated = random.choice(types)

                        sql = "INSERT INTO " + table_insert
                        cursor.execute(
                            sql, (area_code_generated, number_generated, type_generated, email))
                        conn.commit()
                else:
                    continue

    except Error as e:
        print("Error while connecting to MySQL", e)


'''
Python3 version used: 3.9.6
Usage: python3 insert.py or /usr/bin/python3 insert.py

Things to change:
  1) Change DB_NAME if desired
  2) Change the host, user, password, database
'''
if __name__ == "__main__":

    # Connection to MYSQL is done here:
    #               host        user    password  database
    con, DB_NAME = connect()
    # setup()

    LOCATION_TABLE = "Location ( postal_code varchar(5) NOT NULL, state char(2) NOT NULL, city varchar(128) NOT NULL, longitude float NOT NULL, latitude float NOT NULL, PRIMARY KEY (postal_code), UNIQUE KEY (postal_code));"
    LOCATION_INSERT = "Location (postal_code, state, city, longitude, latitude) VALUES (%s, %s, %s, %s, %s);"
    insert_location(con, DB_NAME, "postal_codes.csv",
                    "Location", LOCATION_TABLE, LOCATION_INSERT)
    # validate(con, DB_NAME, "Location", "1")

    HOUSEHOLD_TABLE = "Household (email varchar(250) NOT NULL, home_type varchar(250) NOT NULL, square_footage int NOT NULL, occupant_count int NOT NULL, bedroom_count int NOT NULL, postal_code char(5) NOT NULL, PRIMARY KEY (email), UNIQUE KEY email (email), FOREIGN KEY (postal_code) REFERENCES Location(postal_code) );"
    HOUSEHOLD_INSERT = "Household (email, home_type, square_footage, occupant_count, bedroom_count, postal_code) VALUES (%s, %s, %s, %s, %s, %s);"
    insert_household(HOUSEHOLD_INSERT, 1000)
    # validate(con, DB_NAME, "Household", "5")

    PHONE_NUMBER_TABLE = "Phone_Number (area_code char(3) NOT NULL, phone_number char(7) NOT NULL, phone_type varchar(6) NOT NULL, email varchar(250) NOT NULL, PRIMARY KEY (area_code, phone_number), FOREIGN KEY (email) REFERENCES Household(email) ON DELETE CASCADE);"
    PHONE_NUMBER_INSERT = "Phone_Number (area_code, phone_number, phone_type, email) VALUES (%s, %s, %s, %s);"
    insert_phone_number(PHONE_NUMBER_INSERT)

    MANUFACTUER_TABLE = "Manufacturer (manufacturer_name varchar(100) NOT NULL, PRIMARY KEY (manufacturer_name));"
    MANUFACTUER_INSERT = "Manufacturer (manufacturer_name) VALUES (%s);"
    manufacturers = insert_manufacturer(MANUFACTUER_INSERT)
    # validate(con, DB_NAME, "Manufacturer", "5")

    WASHER_TABLE = "Washer (appliance_id int NOT NULL AUTO_INCREMENT, email varchar(250) NOT NULL, model_name varchar(100), loading_type varchar(100) NOT NULL, manufacturer_name varchar(100) NOT NULL, PRIMARY KEY (appliance_id, email), UNIQUE KEY (appliance_id, email), FOREIGN KEY (email) REFERENCES Household(email) ON DELETE CASCADE, FOREIGN KEY (manufacturer_name) REFERENCES Manufacturer(manufacturer_name) ON DELETE CASCADE);"
    WASHER_INSERT = "Washer (email, manufacturer_name, loading_type) VALUES (%s, %s, %s);"
    insert_washer(WASHER_INSERT)
    # validate(con, DB_NAME, "Washer", "5")

    DRYER_TABLE = "Dryer (appliance_id int NOT NULL AUTO_INCREMENT, email varchar(250) NOT NULL, model_name varchar(100), heat_source varchar(100) NOT NULL, manufacturer_name varchar(100) NOT NULL, PRIMARY KEY (appliance_id, email), UNIQUE KEY (appliance_id, email), FOREIGN KEY (email) REFERENCES Household(email) ON DELETE CASCADE, FOREIGN KEY (manufacturer_name) REFERENCES Manufacturer(manufacturer_name) ON DELETE CASCADE);"
    DRYER_INSERT = "Dryer (email, manufacturer_name, heat_source) VALUES (%s, %s, %s);"
    insert_dryer(DRYER_INSERT)
    # validate(con, DB_NAME, "Dryer", "5")

    TV_TABLE = "TV (appliance_id int NOT NULL AUTO_INCREMENT, email varchar(250) NOT NULL, model_name varchar(100), display_type varchar(100) NOT NULL, display_size double(10, 2) NOT NULL, max_resolution varchar(100) NOT NULL, manufacturer_name varchar(100) NOT NULL, PRIMARY KEY (appliance_id, email), UNIQUE KEY (appliance_id, email), FOREIGN KEY (email) REFERENCES Household(email) ON DELETE CASCADE, FOREIGN KEY (manufacturer_name) REFERENCES Manufacturer(manufacturer_name) ON DELETE CASCADE);"
    TV_INSERT = "TV (email, model_name, display_type, display_size, max_resolution, manufacturer_name) VALUES (%s, %s, %s, %s, %s, %s);"
    insert_tv(TV_INSERT)
    # validate(con, DB_NAME, "Dryer", "5")

    FRIDGE_TABLE = ""
    FRIDGE_INSERT = " Refrigerator_Freezer (email, model_name, manufacturer_name, refrigerator_type) VALUES (%s, %s, %s, %s);"
    insert_fridge(FRIDGE_INSERT)

    FULL_TABLE = ""
    FULL_INSERT = " Full (email, sink_count, bidet_count, commode_count, is_primary, bathtub_count, shower_count, tub_shower_count) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);"
    insert_full_bathroom(FULL_INSERT)
    # validate(con, DB_NAME, "Dryer", "5")

    HALF_TABLE = ""
    HALF_INSERT = " Half (email, sink_count, bidet_count, commode_count, `name`)VALUES (%s, %s, %s, %s, %s);"
    insert_half_bathroom(HALF_INSERT)
    # validate(con, DB_NAME, "Dryer", "5")

    laundry_center_report(con, DB_NAME)
