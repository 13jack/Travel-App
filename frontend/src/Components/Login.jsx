import { useRef, useState } from "react";
import "./login.css";
import axios from "axios";
import RoomIcon from "@mui/icons-material/Room";

export default function Login({setCurrentUser, setShowLogin, myStorage}) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      password: passwordRef.current.value
    };
    console.log(newUser);

    try {
      const res = await axios.post(
        "http://localhost:8800/api/users/login",
        newUser
      );
      setSuccess(true);
      setError(false);
      setCurrentUser(res.data.username);
      setShowLogin(false);
      myStorage.setItem('user', res.data.username)
      console.log("Congo! submitted!..", res);
    } catch (e) {
      setError(true);
      setSuccess(false);
    }
  };

  return (
    // <div className='register'>
    
    <div className="loginContainer">
      <div className="logo">
        <RoomIcon />
        Login
      </div>
      <form className="formas">
        <input type="text" placeholder="username" ref={nameRef} />
        <input type="password" placeholder="password" ref={passwordRef} />
        <button className="rSubmit" onClick={(e) => handleSubmit(e)}>
          Login
        </button>
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
