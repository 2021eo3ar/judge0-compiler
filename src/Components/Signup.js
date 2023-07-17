import React from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const username = e.target.elements.username.value;
        const password = e.target.elements.password.value;

        const response = await fetch("http://localhost:5000/signup", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, username, password })
        });

        const data = await response.json();
        console.log(data);
        if (data.success) {
            // Redirect
            const userId = data.userId; // Assuming the server response contains the userId
            localStorage.setItem('userId', userId);
            localStorage.setItem('token', data.authtoken); // Fix typo and use data.data.authtoken
            navigate("/compiler");
        } else {
            alert("Invalid credentials");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" className="form-control" id="username" name="username" />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default Signup;
