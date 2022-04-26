# Circlegamebackend

## Simple Circle Game backend


Set a new highscore for user: user
```
POST /sethighscore

{
    "user" : {
        "username": "Jonathan51",
        "pass" : "password",
        "elo": {
            "points" : 15,
            "rank" : 10,
			"trend" : 10
        }
    }
}

```

Gets all highscores
```
GET /highscore

[
	{
		"user": "user",
		"elo": {
            "points" : 15,
            "rank" : 10,
			"trend" : 10
        }
	}
]

```