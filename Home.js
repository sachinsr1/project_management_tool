import './Home.css';
import {Link} from 'react-router-dom';

var React = require("react");
var ReactDOM = require("react-dom");

function Home() {
  return (
    <div className="home">
      <h1>Solo and Group Project Manager</h1>
      <div className="all_buttons">
        <Link to="/sign_in" className="link">Sign in</Link>
        <Link to="/create_account" className="link">Create an Account!</Link>
        <Link to="/about" className="link">About</Link>
      </div>
    </div>
  );
}

export default Home;