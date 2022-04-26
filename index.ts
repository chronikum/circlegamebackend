import express from 'express';
import bodyParser from 'body-parser';
import { env } from 'process';
import DatabaseManager from './dbclient';
import helmet from 'helmet';

const basicRoutes = require('./routes/basicRoutes.routes');
require('dotenv').config();

export default class Server {

	app: express.Application;
	
	databaseManager = DatabaseManager.instance

	private port = process.env.PORT || 8080;

	private host = process.env.HOST || "localhost";

	constructor() {
		console.log("Server constructed");
	}


	/**
	 * Starts the server
	 */
	start() {
		console.log("Server started");
		this.app = express();
		this.app.use(helmet({
			contentSecurityPolicy: false,
		  }));
		this.app.use(bodyParser.json());
		// Add headers before the routes are defined
		this.app.use(function (req, res, next) {
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
			res.setHeader('Access-Control-Allow-Headers', '*');
			next();
		});
		this.initializeRoutes();
		this.connectDatabase();
		this.listen()
	}

	/**
	 * Connects to database and wait until its ready
	 */
	 connectDatabase() {
		this.databaseManager.prepare();
		this.databaseManager.databaseReady.subscribe(ready => {
			if (ready) {
				console.log("Database is ready!")
			} else {
				console.log("Database is not available yet")
			}
		})
	}
	
	/**
	 * Loads the routes
	 */
	private initializeRoutes() {
		this.app.use("/", basicRoutes);
		this.app.use((err, req, res, next) => {
			res.status(500).send('Request misconfiguration')
		})
	}


	private listen() {
		this.app.use((err, req, res, next) => {
			console.error(err.stack)
			res.status(500).send('FUCK! Something broke!')
		})
		this.app.use((req, res, next) => {
			res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Cache-Control, Key, Access-Control-Allow-Origin');
			next();
		});
		this.app.listen(this.port, this.host, () => {
			console.log("Server listening on port " + this.port);
			console.log(`Server running on: http://${this.host}:${this.port}`);
		});
	}

	
}

let server = new Server()
server.start()