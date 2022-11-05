# This script needs to be called after the database has been created and the migrations have been applied

## args from command line
## -h help
## -p amount of posts to create
## -u amount of users to create
## -d database connection string
## -o output files
## -f use existing files instead of generating new ones

import getopt
import json
import sys
from uuid import uuid4
import uuid
import psycopg2
import faker
import urllib3


def main(argv):
    # disable warnings for localhost
    urllib3.disable_warnings()

    # parse arguments
    database = ''
    posts = 10
    users = 10

    output = False
    files = False


    try:
        opts, args = getopt.getopt(argv, "hd:p:u:of", ["database=", "posts=", "users=", "output", "files"])
    except getopt.GetoptError:
        print('initdb.py -d <database connection string:"Username=postgres;Password=postgres;Server=localhost;Database=postgres"> -p <posts> -u <users>')
        sys.exit(2)
        
    for opt, arg in opts:
        if opt == '-h':
            print('initdb.py -d <database connection string:"Username=postgres;Password=postgres;Server=localhost;Database=postgres"> -p <posts> -u <users>')
            sys.exit()
        elif opt in ("-p", "--posts"):
            posts = int(arg)
        elif opt in ("-u", "--users"):
            users = int(arg)
        elif opt in ("-d", "--db"):
            database = arg
        elif opt in ("-o", "--output"):
            output = True
        elif opt in ("-f", "--files"):
            files = True
            
    
    # split connection string 
    # format is Username=postgres;Password=postgres;Server=localhost;Database=postgres
    db_user = ''
    db_password = ''
    db_server = ''
    db_name = ''

    try:
        db_user = database.split(';')[0].split('=')[1]
        db_password = database.split(';')[1].split('=')[1]
        db_server = database.split(';')[2].split('=')[1]
        db_name = database.split(';')[3].split('=')[1]

    except:
        # if no database connection string is provided, grab it from appsettings.json
        try:
            with open('API/appsettings.json') as json_file:
                data = json.load(json_file)
                db_user = data['ConnectionStrings']['PostgresConnection'].split(';')[0].split('=')[1]
                db_password = data['ConnectionStrings']['PostgresConnection'].split(';')[1].split('=')[1]
                db_server = data['ConnectionStrings']['PostgresConnection'].split(';')[2].split('=')[1]
                db_name = data['ConnectionStrings']['PostgresConnection'].split(';')[3].split('=')[1]
        except:
            print('no database connection string provided and no valid appsettings.json found')
            sys.exit(2)
    

    # create fake users in database directly (no api)
    # create insert row in UserProfiles table
    
    # connect to db
    
    # check if db_server has a port
    if ':' in db_server:
        db_port = db_server.split(':')[1]
        db_server = db_server.split(':')[0]
    else:
        db_port = 5432

    if db_server == '':
        print('no database connection string provided and no valid appsettings.json found')
        sys.exit(2)

    # try to connect to db
    try:
        conn = psycopg2.connect('dbname=' + db_name + ' user=' + db_user + ' password=' + db_password + ' host=' + db_server, port=db_port)
    except:
        print('unable to connect to database')
        sys.exit(2)

    # create cursor
    cur = conn.cursor()

    # check if files should be used (instead of generating new ones)
    if files:
        # load users from file
        with open('API/scripts/data/users.json') as json_file:
            users = json.load(json_file)

        # load posts from file
        with open('API/scripts/data/posts.json') as json_file:
            posts = json.load(json_file)

        for user in users:
            # insert user
            cur.execute('INSERT INTO "UserProfiles" ("OId", "Name", "Email", "Language", "Roles") VALUES (%s, %s, %s, %s, %s)', (user['Id'], user['Name'], user['Email'], user['Language'], user['Roles']))
            conn.commit()
        
        for post in posts:
            # insert post
            cur.execute('INSERT INTO "Posts" ("Id", "Author", "Message", "Recipients", "Tags", "CreatedDate", "PostType", "IsTransactable", "Coins") VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)', (post['Id'], post['Author'], post['Message'], post['Recipients'], post['Tags'], post['CreatedDate'], post['PostType'], post['IsTransactable'], post['Coins']))
            conn.commit()
        
        print("done!")
        sys.exit(0)



    # userIds
    userIds = []
    userData = []
    # create fake users
    for i in range(int(users)):
        # create fake user
        fake = faker.Faker()
        fake_guid = uuid.uuid4()
        fake_name = fake.name()
        fake_email = fake.email()
        fake_language = 'en'
        fake_role = 'Admin'

        # create insert row in UserProfiles table
        cur.execute('INSERT INTO "UserProfiles" ("OId", "Name", "Email", "Language", "Roles") VALUES (%s, %s, %s, %s, %s)', (str(fake_guid), fake_name, fake_email, fake_language, [fake_role]))
        conn.commit()

        userIds.append(fake_guid)
        userData.append({"Id": str(fake_guid), "Name": fake_name, "Email": fake_email, "Language": fake_language, "Roles": [fake_role]})

    # create random posts using faker directly in database
    # create insert row in Posts table
    # Id: uuid
    # Author : guid
    # Message (text)
    # Recipients (array of userIds)
    # Tags: string array
    # CreatedDate : datetimeoffset
    # PostType
    # IsTransactable (true/false)
    # Coins: number
    postData = []
    for i in range(int(posts)):
        # create fake post
        fake = faker.Faker()
        fake_guid = uuid.uuid4()
        fake_author = userIds[fake.random_int(0, len(userIds) - 1)]
        fake_message = fake.text()
        fake_recipients = userIds[fake.random_int(0, len(userIds) - 1)]
        fake_tags = fake.words()
        fake_createdDate = fake.date_time_between(start_date='-1y', end_date='now').strftime('%Y-%m-%dT%H:%M:%SZ')

        fake_coins = fake.random_int(0, 100)
        fake_postType = 'General'
        fake_isTransactable = False

        if fake_coins > 0:
            fake_postType = 'Kudos'
            fake_isTransactable = True
        
        postData.append({"Id": str(fake_guid), "Author": str(fake_author), "Message": fake_message, "Recipients": [str(fake_recipients)], "Tags": fake_tags, "CreatedDate": fake_createdDate, "PostType": fake_postType, "IsTransactable": fake_isTransactable, "Coins": fake_coins})


        # create insert row in Posts table
        cur.execute('INSERT INTO "Posts" ("Id", "Author", "Message", "Recipients", "Tags", "CreatedDate", "PostType", "IsTransactable", "Coins") VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)', (str(fake_guid), str(fake_author), fake_message, [str(fake_recipients)], fake_tags, fake_createdDate, fake_postType, fake_isTransactable, fake_coins))
        conn.commit()

    ## save data to file if output is set
    if output:
        with open('API/scripts/data/users.json', 'w') as outfile:
            json.dump(userData, outfile)

        with open('API/scripts/data/posts.json', 'w') as outfile:
            json.dump(postData, outfile)



if __name__ == "__main__":
    main(sys.argv[1:])
