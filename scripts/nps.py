import json
import requests

def main():
	r = requests.get('https://developer.nps.gov/api/v1/parks', params={"api_key": "ixWMRYRSzcQBgLHaFf2vZwjx3SWRSGQBsiE1CRab"})
	print(r)
	response = r.json()
	print(json.dumps(response, indent=4, sort_keys=True))

if __name__ == "__main__":
	main()
