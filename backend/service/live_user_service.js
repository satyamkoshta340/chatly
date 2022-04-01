const User = require("../models/user");

class LiveUserService {
    _LIVE_USERS = []

    createUser(name, number, socketId) {
        
        if(this._LIVE_USERS.find(user => user.userId === socketId) === undefined){
            const user = new User(name, number, socketId);
            this._LIVE_USERS.push(user);
        }
        
    }

    getLiveUsers(){
        return this._LIVE_USERS;
    }

    removeUser(id){
        var _new_users = [];
        this._LIVE_USERS.forEach((user)=>{
            if(user.userId !== id){
                _new_users.push(user);
            }
        })
        this._LIVE_USERS = _new_users;
    }
}

module.exports = new LiveUserService