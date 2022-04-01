import React from 'react'
import "../styles/chatBox.css";

export default function ChatBox({sendMessage}) {
  return (
      <div>
            <div className="nav-bar"></div>
            <div className="chat-box" id="message-container">
                {/* <div className ="recieved-msg">hello</div>
                <div className ="sent-msg">hi</div> */}
            </div>
            <div className="type-box"> 
                <input type="text" className="msg-input" id="msg-input"></input>
                <div className="send-btn" onClick={(e)=>sendMessage()}>send</div>
            </div>
      </div>
    
  )
}
