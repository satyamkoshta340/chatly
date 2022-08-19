const { io } = require("socket.io-client");

class GameSocket {
    socket = null;

    init(http_server){
        if(this.socket){
            return;
        }
        this.socket = io.connect(http_server);
    }

    getSocket(){
        return this.socket;
    }
}

const socket = new GameSocket();
socket.init("https://chatly-wind-server.herokuapp.com/");
// socket.init("http://127.0.0.1:8000");

export default socket;