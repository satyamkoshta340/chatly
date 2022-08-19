import React, {useState, useEffect} from 'react';
import GameSocket from "../service/game_socket";
import ChatBox from "../components/chatBox";
import "../styles/chatly.css";


export default function Chatly({name, number}) {
  const socket = GameSocket.getSocket();
  const [token, setToken] = useState(null);
  const [flag, setFlag] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [status, setStatus] = useState(false);
  const [rooms, setRooms] = useState([socket.id]);
  const [currRoom, setCurrRoom] = useState("");

  const displayMessage = (m, classname)=>{
    const div = document.createElement("div");
    div.className = classname
    div.textContent = m;
    document.querySelector("#message-container").append(div);
  }

  
  const login = async () =>{
    const responce = await fetch("https://chatly-wind-server.herokuapp.com/api/login/", {
      method: "POST",
      mode: 'cors',
      headers: {
        'Content-Type' : 'application/json',
        'authorization' : token
      },
    })
    const data = await responce.json();
    setFlag(data.flag);

    if(data.flag){
      socket.emit("create-user", name, number);
    }
  }

  const joinRoom = (newroom) =>{
  
    if(rooms.find( r=> r === newroom ) === undefined){
      setRooms([...rooms, newroom]);
      socket.emit('join/room', rooms);
      setStatus(true);
    }
    setCurrRoom(newroom);
    const users = document.getElementsByClassName("user");
    // console.log(users);
    for( const [k, user] of Object.entries(users)){
      user.classList.remove('active');
      if(user.id === newroom){
        user.classList.add('active');
      }
    }
  }
  
  const sendMessage = (e) =>{
    const msg = document.getElementById("msg-input").value;
    document.getElementById("msg-input").value = "" ;
    displayMessage(msg, "sent-msg");
    socket.emit("send/msg", msg, currRoom);
  }

  useEffect( ()=>{ 
  socket.on("recieve/activeuser",(data) =>{
    // console.log(data);
    setActiveUsers(data);

  })
  
  socket.once("recieve/msg", (msg, id) =>{ 
    // console.log(id)
    // console.log(currRoom)
    
      displayMessage(msg, "recieved-msg");
    
    // here we can save these msgs in a buffer
    // console.log("msg recieved");
  })
}, [socket])
  return (
    <div className='chatly-page'>
        <div className='chatly-left-panel'> 
          <div className='flex-container'> <div className='logo'></div> <h1>Chatly</h1></div>
          {
            flag && <>
              <h2 className='heading'>Active Users</h2>
              <div className='active-users'>
                {
                  activeUsers.map( (user) => {
                    // console.log(user.userId);
                    if(user.userId === rooms[0]){
                      return (
                        <div className='my-user flex-container' key={user.name} onClick={()=>joinRoom(user.userId) } id={user.userId}>
                          <div className='symb my-user-symb'></div>
                          <div className='flex-col-container'>
                            <div className='user-name'>{user.name}</div>
                            <div className='user-number'>{user.number}</div>
                          </div>
                        </div>
                      )
                    }
                    return(
                      <div className='user flex-container' key={user.name} onClick={()=>joinRoom(user.userId) } id={user.userId}>
                        <div className='symb'></div>
                        <div className='flex-col-container'>
                          <div className='user-name'>{user.name}</div>
                          <div className='user-number'>{user.number}</div>
                        </div>
                      </div>
                    )
                    
                  })
                }
              </div>
            </>
          }
          
        </div>
        <div className='chatly-right-panel'>
          { !flag && <>
            <div className='title'>Enter your token</div>
            <div className='token-input-box'> <input type="text" className="token-input" placeholder='Token' onChange={(e)=> setToken(e.target.value)}/> </div>
            <button className='login-btn' onClick={()=> login()}> <div className='btn-text'>Login</div> </button>
          </>
          }
          {
            flag && <>
              {
                !status && <>
                  <div className='title'>Please Select a user to Message</div>
                  <div className="sub-title">Choose one from your existing messages, or start a new one.</div>
                </>
              }
              {
                status && <>
                  <ChatBox sendMessage={sendMessage}/>
                </>
              }
            </>
          }
        </div>
        
    </div>
  )
}
