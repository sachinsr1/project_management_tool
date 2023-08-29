import React from 'react';

function About() {
  return (
    <div className="about-container">
      <header>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </nav>
      </header>
      <main>
        <section className="about-section">
          <h1>About Project Manager</h1>
          <p>Welcome to the Solo and Group Project Manager!</p>
          <p>In this tool, you can collaborate with a team to share your projects, organize your tasks, and keep track of hourly progress and completion status.</p>
          <p>Create an Account Now!</p>
        </section>
      </main>
      <footer>
        
      </footer>
    </div>
  );
}

export default About;