import json
import requests

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

def main():
	cred = credentials.Certificate('firebase-admin-key.json')
	firebase_admin.initialize_app(cred, {
	    'databaseURL': 'https://senior-design-explr.firebaseio.com/'
	})
	ref = db.reference('restricted_access/secret_document')
	print(ref.get())

	r = requests.get('https://developer.nps.gov/api/v1/parks', params={"api_key": "ixWMRYRSzcQBgLHaFf2vZwjx3SWRSGQBsiE1CRab"})
	response = r.json()
	#print(json.dumps(response, indent=4, sort_keys=True))

if __name__ == "__main__":
	main()
