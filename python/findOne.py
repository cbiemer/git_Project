import pymongo
from datetime import datetime
'''
Playing with mongodb with pymongo. for the application that i make in the future I intend to have the python code 
do the heavy lifting in the background while the server waits for it to finish.

-Colan Biemer
'''
client = pymongo.MongoClient()

## gets the database named test
db = client['test']

## find one value in the db
## find_one() will return a dictionary with the key's
## as the keys in the json dictionary
oneVal = db.test.find_one()

print(oneVal['_id'])