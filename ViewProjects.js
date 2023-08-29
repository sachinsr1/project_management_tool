import React, { useState, useEffect } from 'react';
import { useNavigate,  useParams } from 'react-router-dom';
import ViewProjects from './ViewProjects.css';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const {username} = useParams();

  useEffect(() => {
    
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      
      const response = await fetch(`http://localhost:8000/view_projects/${username}`); 
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects); 
      } else {
        console.error('Error fetching projects');
      }
    } catch (error) {
      console.error('Internal server error:', error);
    }
  };

  return (
    <div className="project-list-container">
      <h2>Your Projects</h2>
      {projects.map((project) => (
        <div key={project.id} className="project">
          <h3 className="project-title">{project.title}</h3>
          <div className="project-details">
           
            <a href={`/edit_project/${project.title}/${username}`} className="edit-link">
              Edit Project
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProjectList;