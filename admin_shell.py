import http.client
import json

# PLEASE ADJUST THESE VALUES!
APIKEY = "APIKEY"
HOST = "localhost"
PORT = 8080

def delete_user():
	username = input('Which user do you want to delete? ')
	conn = http.client.HTTPSConnection(HOST, PORT)
	payload = json.dumps({
		"userToDelete": f"{username}",
		"apiKey": f"{APIKEY}"
	})
	headers = {
		'Content-Type': 'application/json'
	}
	conn.request("POST", "/admin/delete", payload, headers)
	res = conn.getresponse()
	data = res.read()
	print(data.decode("utf-8"))


# show the menu
def print_menu1():
	print ('1 -- Delete an user' )
	print ('2 -- Change user password' )
	print ('3 -- Exit' )

# input menu
while(True):
	print_menu1()
	option = int(input('Enter your choice: '))
	if (option == 1):
		delete_user()