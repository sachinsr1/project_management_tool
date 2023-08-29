import React from 'react';
import { useNavigate,  useParams } from 'react-router-dom';
import './Options.css';
function Options() {
  const {username} = useParams();
  console.log(username);
  return (
    <div className="options-container">
      <h1 className="greeting">Hello, {`${username}`}</h1>
      <header>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href={`/view_projects/${username}`}>Projects</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </nav>
      </header>
      <main>
        <section className="options-section">
          <h1>Options</h1>
          <ul>
            <li><a href="/logout">Log Out</a></li>
            <li><a href={`/create_project/${username}`}>Create New Project</a></li>
            <li><a href={`/view_projects/${username}`}>View Your Projects</a></li>
            <li><a href={`/search/${username}`}>Search</a></li>
            <li><a href={`/edit_profile/${username}`}>Edit Profile</a></li>
          </ul>
        </section>
      </main>
      <footer>
        <p>&copy; 2023 Project Manager. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Options;