import React, { useState } from 'react';
import LoggedInSuccess from '../start_building_viewing/LoggedInSuccess';
import CouldNotLogIn from '../sign_in_related/CouldNotLogIn';
import { useNavigate,  useParams } from 'react-router-dom';
import './SignIn.css';

function Account() {
  const navigate = useNavigate();
  //const useParams = useParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [createdAccountSuccess, setCreatedAccountSuccess] = useState('');
  const [createdAccountError, setCreatedAccountError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  //const { name } = useParams();

  const handleSubmit =  async (e) => {
    e.preventDefault();
    try {
      const response =  await fetch('http://localhost:8000/sign_in/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
     
      if (response.ok) {
        setCreatedAccountSuccess(true);
        setCreatedAccountError(false);
        navigate(`/options/${username}`);
      } else {
        setErrorMessage("Incorrect username or password, please try again");
        setCreatedAccountSuccess(false);
        setCreatedAccountError(true);
      }
    } catch (err) {
      console.log(err);
      //setCreatedAccountSuccess(false);
      //setCreatedAccountError(true);
    }
  };

  return (
    <div className="sign-in-container">
      <div className="sign-in-form">
        <h1>Enter Username and Password to Begin</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
            <br />
        {errorMessage && <p className="error">{errorMessage}</p>}
          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default Account;