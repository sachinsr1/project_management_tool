import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
//import './CreateProfile.css';

function CreateProfile() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [favoriteFoods, setFavoriteFoods] = useState('');
  const [bio, setBio] = useState('');
  const [bioReminder, setBioReminder] = useState(false);
  const { username } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (bio.length < 2 || firstName.length < 2 || lastName.length < 2 || favoriteFoods.length < 2) {
      setBioReminder(true); 
      return; 
    }
    try {
      
      const response = await fetch('http://localhost:8000/create_profile/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"firstName" : firstName, "lastName" : lastName,
        'favoriteFoods' : favoriteFoods, 'bio' : bio, 'username' : username }),
      });
      if (response.ok) {
        navigate(`/options/${username}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-form">
        <h2>Create Your Profile</h2>
        <form onSubmit={handleSubmit}>
          <label>
            First Name:
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
          <label>
            Project Interests:
            <input
              type="text"
              value={favoriteFoods}
              onChange={(e) => setFavoriteFoods(e.target.value)}
            />
          </label>
          <label>
            Bio:
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </label>
          {bioReminder && <p className="reminder">All categories must contain at least 2 characters</p>}
          <button type="submit">Complete Profile</button>
        </form>
      </div>
      <div className="profile-options">
        <a href="/">Log Out &nbsp; &nbsp; &nbsp; &nbsp;</a>
        
        <a href="/new-project">New Project  &nbsp;  &nbsp; &nbsp;</a>
        <a href="/view-your-projects">View Your Projects &nbsp; &nbsp; &nbsp;</a>
        <a href="/search-projects">Search &nbsp; &nbsp; &nbsp;</a>
      </div>
    </div>
  );
}

export default CreateProfile;