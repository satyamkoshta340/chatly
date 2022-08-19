import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/register.css";

export default function Register({token, setToken, name, number, setName, setNumber}) {

  
  const generateToken = async () =>{
    const responce = await fetch("https://chatly-wind-server.herokuapp.com/api/generateToken/", {
      method: "POST",
      mode: 'cors',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        'name': name,
        'number': number
      })
    })
    const data = await responce.json();
    console.log(data.token);
    setToken(data.token);
    // console.log(token);
  }

  return (
    <div className='register-page'>
     
        <div className='left-panel'>
          <div className='flex-container'> <div className='logo'></div> <h1>Auth</h1></div>
          
        </div>
        <div className='right-panel'>
          {token === null && <>
            <div className='title-reg'>Register</div>
            <div className='name-input-box'> <input type="text" className="name-input" placeholder='Name' onChange={(e)=> setName(e.target.value)}/> </div>
            <div className='number-input-box'> <input type="text" placeholder='Mobile Number' className="number-input" onChange={(e)=> setNumber(e.target.value)}/> </div>
            <button className='generate-btn' onClick={()=> generateToken()}> <div className='btn-text'>Generate Token</div> </button>
          </>
          }
          { token !== null && <>
            <div className='title-reg'>Token Generateed!!</div>
            <input className='token-box' defaultValue={token} type="text" />
            <Link to={"/chatly"}><button className='chat-link-btn'>Move To Chat</button></Link>
            
          </>
          }
            
        </div>
    </div>
  )
}
