import React from 'react';
import {useNavigate} from 'react-router-dom'

const Login = () => {
  let navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.elements.username.value;
    const password = e.target.elements.password.value;

    const response = await fetch("http://localhost:5000/login", {
      method: "post",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    console.log(data);
    if(data.success){
        //redirect
        const userId = data.userId; // Assuming the server response contains the userId
        localStorage.setItem('userId', userId);
        localStorage.setItem('token', JSON.authtoken);
        navigate("/compiler");

    }
    else{
        alert("invalid credentials");
    }
  }


  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="exampleInputUsername" className="form-label">Username</label>
        <input type="text" className="form-control" id="exampleInputUsername" name="username" aria-describedby="usernameHelp" />
        <div id="usernameHelp" className="form-text">Enter your username.</div>
      </div>
      <div className="mb-3">
        <label htmlFor="exampleInputPassword" className="form-label">Password</label>
        <input type="password" className="form-control" id="exampleInputPassword" name="password" />
      </div>

      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  )
}

export default Login;