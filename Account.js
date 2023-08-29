

import React, { useState } from 'react';
import LoggedInSuccess from '../start_building_viewing/LoggedInSuccess';
import CouldNotLogIn from '../sign_in_related/CouldNotLogIn';
import About from '../about_related/About';
import { useNavigate } from 'react-router-dom';
import './Account.css';

function Account() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [createdAccountSuccess, setCreatedAccountSuccess] = useState('');
  const [createdAccountError, setCreatedAccountError] = useState('');

  const handleSubmit =  async (e) => {
    e.preventDefault();
    try {
      const response =  await fetch('http://localhost:8000/create_account/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
     
      if (response.ok) {
        setCreatedAccountSuccess(true);
        setCreatedAccountError(false);
        navigate(`/create-profile/${username}`);
      } else {
        setCreatedAccountSuccess(false);
        setCreatedAccountError(true);
      }
    } catch (err) {
      console.log(err);
      setCreatedAccountSuccess(false);
      setCreatedAccountError(true);
    }
  };

  return (
    <div className="sign-in-container">
      <div className="sign-in-form">
        <h1>Create an Account</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter a new username"
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a new password"
          />
          <button type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
}

export default Account;