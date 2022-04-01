import {useState} from 'react';
import Register from "./ui/register";
import Chatly from "./ui/chatly";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  // const [isRegistered, setIsRegistered] = useState(false);
  const [token, setToken] = useState(null);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  return (
    // <div className="root">
    //   {!isRegistered && <>
    //     <Register token={token} setToken={setToken} />
    //   </>}
    //   {isRegistered && <>
    //     <Chatly />
    //   </>
    //   }
    // </div>
    <BrowserRouter>
    <Routes>
      <Route 
        path='/' 
        element={ <Register  token={token} setToken={setToken} name={name} number={number} setName={setName} setNumber={setNumber} />}>
      </Route>
      <Route path="/chatly" element = { <Chatly name={name} number={number} /> }></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
