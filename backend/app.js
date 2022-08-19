const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
var cors = require('cors');
const {Server} = require("socket.io");
const LiveUserService = require("./service/live_user_service");

dotenv.config();
// console.log(require('crypto').randomBytes(64).toString('hex'));

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "https://admin.socket.io",
            "https://chatly-wind-frontend.herokuapp.com"
            ],
    }});

io.on("connection", (socket) => {
  console.log(`socketid: ${socket.id}`);
  socket.on("create-user", (name, number)=>{
      console.log("create user")
      socket.join(socket.id);
      LiveUserService.createUser(name, number, socket.id);
      console.log("user created");
      const data = LiveUserService.getLiveUsers();
      io.emit("recieve/activeuser", data);

  })
  socket.on("join/room", (room)=>{
      socket.join(room);
      console.log(`room joined ${room}`)
  })

  socket.on("send/msg", (msg, room)=>{
      console.log(room);
      socket.to(room).emit("recieve/msg", msg, socket.id);
      console.log("msg sent")
  })

  socket.on("disconnect", ()=>{
      console.log(`disconnected: ${socket.id}`)
      const id = socket.id;
      LiveUserService.removeUser(id);
      const liveUsers = LiveUserService.getLiveUsers();
      socket.broadcast.emit("recieve/activeuser", liveUsers);
  })
});


function generateAccessToken(data) {
    return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: '1d' });
}

function authenticateToken(req, res, next) {
    // const authHeader = req.headers['authorization'];
    const token = req.headers['authorization']
    // const token = authHeader && authHeader.split(' ')[1];
    if (token === null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      console.log(err)
  
      if (err) return res.sendStatus(403)
        
      req.user = user
  
      next()
    })
  }



app.get("/", (req, res) => {
    res.send("Chatly");
})

app.post('/api/generateToken', (req, res) => {
    // console.log("generating token");
    const token = generateAccessToken({ name: req.body.name, number: req.body.number});
    res.json({
        token});
});

app.post('/api/login', authenticateToken, (req, res) =>{
    res.json({
        "flag" : true
    })

})

server.listen(PORT, () => {
    console.log(`server running on port: ${PORT}`);
})