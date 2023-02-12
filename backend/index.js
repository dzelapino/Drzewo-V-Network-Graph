const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
// const { v4: uuidv4 } = require('uuid');
require("dotenv").config();

const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  cors: {
    origin: "*" //'http://localhost:8080'
  }
})

const corsOptions = {
  credentials: true,
  origin: ['http://localhost:8080']
}

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

const dbData = {
  host: process.env.MONGO_HOST,
  port: process.env.MONGO_PORT,
  database: process.env.MONGO_DATABASE,
};

mongoose.set("strictQuery", false);

const people = require("./routes/People");
const userRouter = require("./routes/User");
const messageRouter = require("./routes/Message");
app.use("/people", people);
app.use("/users", userRouter);
app.use("/messages", messageRouter);

app.get("/", async (_req, res) => {
  return res.send("Api is working!");
});

try {
  require("./config/neo4jDriver");
  console.log(`Connected to Neo4J.`);
  mongoose
    .connect(`mongodb://${dbData.host}:${dbData.port}/${dbData.database}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((res) => {
      console.log(`Connected to Mongo database: ${res.connections[0].name}`);

      const appHost = process.env.APP_HOST;
      const appPort = process.env.APP_PORT;

      http.listen(appPort, () => {
        console.log(`Server available from: http://${appHost}:${appPort}`);
      });
    })
    .catch((err) => {
      console.error("Error while connecting to Mongo: ", err);
    });
} catch (exception) {
  console.error("Error while connecting to Neo4J", exception);
}

io.sockets.on('connection', (socket) => { 

    const toSend = {user: "Server", message: "Hello!"};
    socket.emit("Global", toSend);

    socket.on("new_message", function (message) {
      console.log("Message from: " + message.user + " On channel: " + message.channel)
      io.emit(message.channel, message);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

});
