import { useRef, useState } from "react";
import "./register.css";
import axios from "axios";
import RoomIcon from "@mui/icons-material/Room";

export default function Register() {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false)
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            username : nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };        
        try{
            const res = await axios.post("http://localhost:8800/api/users/register", newUser);
            setError(false);
            setSuccess(true);
        }catch(e){
            setError(true);
            setSuccess(false);
        }
    }

  return (
    // <div className='register'>
    <div className="registerContainer">
      <div className="logo">
        <RoomIcon />
        Adding Pin
      </div>
      <form onSubmit={(e) => handleSubmit(e)} className="formas">
        <input type="text" placeholder="username" ref = {nameRef}/>
        <input type="email" placeholder="email" ref={emailRef} />
        <input type="password" placeholder="password" ref={passwordRef}/>
        <button className="rSubmit" onClick={(e) => handleSubmit(e)}>Register</button>
        {success && (
          <span className="success">Successful! Now you can Login )</span>
        )}
        {error && (
          <span className="failure">Something went wrong! try again!</span>
        )}
      </form>
    </div>
    // {/* </div> */}
  );
}
