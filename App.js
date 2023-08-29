import React from "react";
import {Route, Routes} from 'react-router-dom';
import Home from './home_page_related/Home.js';
import Account from './create_account_related/Account.js';
import SignIn from './sign_in_related/SignIn.js';
import About from './about_related/About.js';
import CreateProfile from './create_profile_related/CreateProfile.js';
import Options from './project_creation_related/Options.js';
import CreateProject from './project_creation_related/CreateProject.js';
import ViewProjects from './project_creation_related/ViewProjects.js';
import EditProject from './project_creation_related/EditProject.js';


function App() {
  return (
    <div className= "main">
    
     
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/create_account" element={<Account/>} />
        <Route path="/sign_in" element={<SignIn/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/create-profile/:username" element={<CreateProfile/>} />
        <Route path="/options/:username" element={<Options/>} />
        <Route path="/create_project/:username" element={<CreateProject/>} />
        <Route path="/view_projects/:username" element={<ViewProjects/>} />
        <Route path="/edit_project/:projectID/:username" element={<EditProject/>} />
      </Routes>
     
    </div>
  )
}

export default App;