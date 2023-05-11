require('dotenv').config({path: './.env'});

const config = require('./expressconfig/config');
const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require('passport');
const flash = require('express-flash');

//for establishing sessions
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();

//Config for CORS
var corsOptions = {
    origin: "*"
  };
app.use(cors(corsOptions));

//Config for BodyParser Utilization
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

//initialize View Engine
app.set('view engine', 'ejs');

//Instantiation of Database
const db = require('./models')

//Sessions
app.use(session({
    secret: process.env.SESSION_SECRET,   //your-secret-key
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: db.sequelize,
    }),
}));
app.use(flash());

//requiring the Passport Middleware
require('./middleware/passport');

//Passport Setup
app.use(passport.initialize());
app.use(passport.session());

//Syncing and Staring of the Database
db.sequelize.sync().then(() => {
    console.log("Database is up and running");

   
    const sensorsController = require('./controllers/sensorDataController');

    //delete data older than 1 hour (1 Hour time for testing, would be 2 months in deployment)
    setInterval(()=>{
      sensorsController.deleteOldData();
    }, 5000
    // 1800000
    )
    
    
    const routes = require("./routes/routes");
    app.use("/", routes);

    setInterval(()=>{
      // require('./controllers/alertController');
      // checkDataToAlert
      // console.log("----------------------------------------");
      // sensorsController.validateDataToAlert();
    }, 5000);


    //Configuration for Socket.io
    const http = require("http");
    const server = http.createServer(app);
    const { Server } = require("socket.io");
    const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        transports: ["websocket", "polling"],
    },
        allowEIO3: true,
    });

    require("./sockets/sensorDataSockets")(io);     //Gets the separate functions for Socket.io

    //App Listen
    server.listen(process.env.PORT || 3001, () => {
        console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });

});
