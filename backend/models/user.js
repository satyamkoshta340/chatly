// const {v4} = require('uuid')
class User {
    constructor(name, number, socketId){
        this.userId = socketId;
        this.name = name;
        this.number = number;
    }
    
}

module.exports = User;