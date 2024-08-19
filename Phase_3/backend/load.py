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
                            password="Aarthy11!")

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
        print("connect: Error while connecting to MySQL", e)

    return conn, mysql_dbname


def load_household(table_insert):
    conn, db_name = connect()

    df = pd.read_csv("Household.tsv", sep='\t',
                     quotechar='\'', encoding='utf8')

    try:
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("USE " + db_name)

            # Insert's
            for i, row in df.iterrows():
                sql = "INSERT INTO " + table_insert
                row = tuple(row)
                cursor.execute(sql, (row[0], row[1], row[4],
                               row[2], row[3], row[8]))
                conn.commit()

    except Error as e:
        print("load household: Error while connecting to MySQL", e)


def load_phone(table_insert):
    conn, db_name = connect()

    df = pd.read_table("Household.tsv", sep='\t',
                       quotechar='\'', encoding='utf8', dtype='str')

    try:
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("USE " + db_name)

            # Insert's
            for i, row in df.iterrows():
                row = tuple(row)
                if row[5] == '' or str(row[5]) == 'nan' or row[5] == None:
                    continue
                sql = "INSERT INTO " + table_insert
                sql = sql.format(str(row[5]).replace('\'', '\'\''), str(row[6]).replace(
                    '\'', '\'\''), str(row[7]).replace('\'', '\'\''), row[0].replace('\'', '\'\''))

                cursor.execute(sql)
                conn.commit()

    except Error as e:
        print("load phone: Error while connecting to MySQL", e)


def load_manufacturers(table_insert):
    conn, db_name = connect()

    df = pd.read_table("Manufacturer.tsv", sep='\t',
                       quotechar='\'', encoding='utf8', dtype='str')

    try:
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("USE " + db_name)

            # Insert's
            for i, row in df.iterrows():
                row = tuple(row)

                sql = "INSERT INTO " + table_insert
                sql = sql.format(str(row[0]).strip().replace('\'', '\'\''))

                cursor.execute(sql)
                conn.commit()

    except Error as e:
        print("load manufacturers: Error while connecting to MySQL", e)


def load_appliances(table_insert_map):
    conn, db_name = connect()

    df = pd.read_csv("Appliance.tsv", sep='\t',
                     quotechar='\'', encoding='utf8', dtype='str')

    try:
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("USE " + db_name)

            # Insert's
            for i, row in df.iterrows():

                email = str(row['household_email']).replace('\'', '\'\'')
                id = int(row['appliance_number'])
                manufacturer_name = str(
                    row['manufacturer_name']).strip().replace('\'', '\'\'')
                model = str(row['model']).strip().replace('\'', '\'\'')

                # Cooktop and Cooker
                if str(row[4]) != '' and str(row[4]) != 'nan' and row[4] != None:
                    ''' Cooktop and Cooker '''
                    if model == 'nan':
                        cooker_sql = "INSERT INTO " + \
                            table_insert_map["COOKER_INSERT_NULL"]
                        cooker_sql = cooker_sql.format(
                            id, email, manufacturer_name)
                    else:
                        cooker_sql = "INSERT INTO " + \
                            table_insert_map["COOKER_INSERT"]
                        cooker_sql = cooker_sql.format(
                            id, email, model, manufacturer_name)

                    cursor.execute(cooker_sql)
                    result1 = cursor.fetchall()
                    conn.commit()

                    cooktop_sql = "INSERT INTO " + \
                        table_insert_map["COOKTOP_INSERT"]
                    cooktop_sql = cooktop_sql.format(
                        id, email, str(row[4]).strip().replace('\'', '\'\''))

                    cursor.execute(cooktop_sql)
                    result2 = cursor.fetchall()
                    conn.commit()

                # Dryer
                elif str(row[5]) != '' and str(row[5]) != 'nan' and row[5] != None:
                    ''' Dryer '''
                    if model == 'nan':
                        dryer_sql = "INSERT INTO " + \
                            table_insert_map["DRYER_INSERT_NULL"]
                        dryer_sql = dryer_sql.format(id, email, manufacturer_name,  str(
                            row[5]).strip().replace('\'', '\'\''))
                    else:
                        dryer_sql = "INSERT INTO " + \
                            table_insert_map["DRYER_INSERT"]
                        dryer_sql = dryer_sql.format(id, email, manufacturer_name, model, str(
                            row[5]).strip().replace('\'', '\'\''))
                    cursor.execute(dryer_sql)
                    result1 = cursor.fetchall()
                    conn.commit()

                # Oven, Oven Heat Source, Cooker
                elif str(row[6]) != '' and str(row[6]) != 'nan' and row[6] != None:
                    ''' Cooker, Oven, and Oven Heat Source'''
                    if model == 'nan':
                        cooker_sql = "INSERT INTO " + \
                            table_insert_map["COOKER_INSERT_NULL"]
                        cooker_sql = cooker_sql.format(
                            id, email, manufacturer_name)
                    else:
                        cooker_sql = "INSERT INTO " + \
                            table_insert_map["COOKER_INSERT"]
                        cooker_sql = cooker_sql.format(
                            id, email, model, manufacturer_name)

                    cursor.execute(cooker_sql)
                    result1 = cursor.fetchall()
                    conn.commit()

                    ''' Oven '''
                    oven_sql = "INSERT INTO " + table_insert_map["OVEN_INSERT"]
                    oven_sql = oven_sql.format(id, email, str(
                        row[6]).strip().replace('\'', '\'\''))

                    cursor.execute(oven_sql)
                    result2 = cursor.fetchall()
                    conn.commit()

                    heat_sources = str(row[7]).split(';')
                    for hs in heat_sources:
                        oven_hs_sql = "INSERT INTO " + \
                            table_insert_map["OVEN_HS_INSERT"]
                        oven_hs_sql = oven_hs_sql.format(
                            id, email, hs.strip().replace('\'', '\'\''))

                        cursor.execute(oven_hs_sql)
                        result3 = cursor.fetchall()
                        conn.commit()

                # Fridge
                elif str(row[8]) != '' and str(row[8]) != 'nan' and row[8] != None:
                    ''' Refrigerator '''
                    if model == 'nan':
                        fridge_sql = "INSERT INTO " + \
                            table_insert_map["FRIDGE_INSERT_NULL"]
                        fridge_sql = fridge_sql.format(id, email, manufacturer_name, str(
                            row[8]).strip().replace('\'', '\'\''))
                    else:
                        fridge_sql = "INSERT INTO " + \
                            table_insert_map["FRIDGE_INSERT"]
                        fridge_sql = fridge_sql.format(id, email, model, manufacturer_name, str(
                            row[8]).strip().replace('\'', '\'\''))

                    cursor.execute(fridge_sql)
                    result1 = cursor.fetchall()
                    conn.commit()

                # TV
                elif str(row[9]) != '' and str(row[9]) != 'nan' and row[9] != None:
                    ''' TV '''
                    display_size = float(row[9])
                    display_type = str(row[10]).strip().replace('\'', '\'\'')
                    resolution = str(row[11]).strip().replace('\'', '\'\'')

                    if model == 'nan':
                        tv_sql = "INSERT INTO " + \
                            table_insert_map["TV_INSERT_NULL"]
                        tv_sql = tv_sql.format(
                            id, email, display_type, display_size, resolution, manufacturer_name)
                    else:
                        tv_sql = "INSERT INTO " + table_insert_map["TV_INSERT"]
                        tv_sql = tv_sql.format(
                            id, email, model, display_type, display_size, resolution, manufacturer_name)
                    cursor.execute(tv_sql)
                    result1 = cursor.fetchall()
                    conn.commit()

                # Washer
                elif str(row[12]) != '' and str(row[12]) != 'nan' and row[12] != None:
                    ''' Washer '''
                    if model == 'nan':
                        washer_sql = "INSERT INTO " + \
                            table_insert_map["WASHER_INSERT_NULL"]
                        washer_sql = washer_sql.format(id, email, manufacturer_name, str(
                            row[12]).strip().replace('\'', '\'\''))
                    else:
                        washer_sql = "INSERT INTO " + \
                            table_insert_map["WASHER_INSERT"]
                        washer_sql = washer_sql.format(id, email, manufacturer_name, model, str(
                            row[12]).strip().replace('\'', '\'\''))

                    cursor.execute(washer_sql)
                    result1 = cursor.fetchall()
                    conn.commit()

    except Error as e:
        print("load appliances: Error while connecting to MySQL", e)


def load_bathroom(table_insert_map):
    conn, db_name = connect()

    df = pd.read_csv("Bathrooms.tsv", sep='\t',
                     quotechar='\'', encoding='utf8', dtype='str')

    try:
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("USE " + db_name)

            # Insert's
            for i, row in df.iterrows():

                email = str(row['household_email']).replace('\'', '\'\'')
                id = int(row['bathroom_number'])

                sink_count = int(row['sink_count'])
                bidet_count = int(row['bidet_count'])
                commode_count = int(row['commode_count'])

                # Half Bathroom
                if str(row['tub_count']) == 'nan' or str(row['tub_count']) == '' or row['tub_count'] == None:
                    ''' Half Bathroom '''

                    name = str(row['bathroom_name']).replace('\'', '\'\'')
                    if name == 'nan':
                        half_sql = "INSERT INTO " + \
                            table_insert_map["HALF_INSERT_NULL"]
                        half_sql = half_sql.format(id, email, sink_count,
                                                   bidet_count, commode_count)
                    else:
                        half_sql = "INSERT INTO " + \
                            table_insert_map["HALF_INSERT"]
                        half_sql = half_sql.format(id, email, sink_count,
                                                   bidet_count, commode_count, name)
                    cursor.execute(half_sql)
                    result1 = cursor.fetchall()
                    conn.commit()

                # Full Bathroom
                else:
                    ''' Full Bathroom '''
                    full_sql = "INSERT INTO " + table_insert_map["FULL_INSERT"]

                    tub_count = int(row['tub_count']) if str(
                        row['tub_count']) != 'nan' else 0
                    shower_count = int(row['shower_count']) if str(
                        row['shower_count']) != 'nan' else 0
                    tub_shower_count = int(row['tub_shower_count']) if str(
                        row['tub_shower_count']) != 'nan' else 0
                    is_primary = 1 if int(row['primary_bathroom']) == 1 else 0

                    full_sql = full_sql.format(id, email, sink_count, bidet_count, commode_count,
                                               is_primary, tub_count, shower_count, tub_shower_count)

                    cursor.execute(full_sql)
                    result1 = cursor.fetchall()
                    conn.commit()

    except Error as e:
        print("load bathroom: Error while connecting to MySQL", e)
