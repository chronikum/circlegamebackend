# Circlegamebackend

## Simple Circle Game backend


Set a new highscore for user: user
```
POST /sethighscore

{
	"user": "user",
	"highscore": "highscore"
}

```

Gets all highscores
```
GET /highscore

[
	{
		"user": "user",
		"highscore": "highscore"
	}
]

```