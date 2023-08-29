import React, { useState } from 'react';
import './CreateProject.css'; 
import { useParams, useNavigate } from 'react-router-dom';

function CreateProject() {
  const [projectTitle, setProjectTitle] = useState('');
  const [participants, setParticipants] = useState([{ firstName: '' }]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tasks, setTasks] = useState([{ task: '', hours: '', updated_hours: 0, assignedUsers: [] }]); 
  const [warning, setWarning] = useState('');
  const navigate = useNavigate();
  const { username } = useParams();

  const addParticipant = () => {
    if (participants.every((participant) => participant.firstName)) {
      setParticipants([...participants, { firstName: '' }]);
    } else {
      setWarning('Please fill in the username for the current participant.');
    }
  };

  const addTask = () => {
    setTasks([...tasks, { task: '', hours: '', updated_hours: 0, assignedUsers: [] }]); 
  };

  const handleParticipantChange = (index, field, value) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index][field] = value;
    setParticipants(updatedParticipants);
  };

  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index][field] = value;
    setTasks(updatedTasks);
  };

  const handleCreateProject = async () => {
    const projectData = {
      title: projectTitle,
      startDate: startDate,
      endDate: endDate,
      tasks: tasks,
      people: participants,
    };

    try {
      const response = await fetch(`http://localhost:8000/create_project/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        console.log('Project created successfully');
        navigate(`/options/${username}`);
      } else {
        console.error('Error creating the project');
      }
    } catch (error) {
      console.error('Internal server error:', error);
    }
  };

  return (
    <div className="create-project-container">
      <h2>Create a New Project</h2>
      <label>
        Project Title:
        <input
          type="text"
          placeholder="Enter project title"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
        />
      </label>
      <div className="participants-container">
        {participants.map((participant, index) => (
          <div key={index} className="participant-inputs">
            <input
              type="text"
              placeholder="Username"
              value={participant.firstName}
              onChange={(e) => handleParticipantChange(index, 'firstName', e.target.value)}
            />
          </div>
        ))}
        <button onClick={addParticipant}>Add Participant</button>
        {warning && <p className="warning">{warning}</p>}
      </div>
      <div className="dates-container">
        <input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div className="tasks-container">
        {tasks.map((task, index) => (
          <div key={index} className="task-inputs">
            <input
              type="text"
              placeholder="Task"
              value={task.task}
              onChange={(e) => handleTaskChange(index, 'task', e.target.value)}
            />
            <input
              type="number"
              placeholder={`Hours needed for ${task.task}`}
              value={task.hours}
              onChange={(e) => handleTaskChange(index, 'hours', e.target.value)}
            />
          </div>
        ))}
        <button onClick={addTask}>Add Task</button>
      </div>
      <button className="create-button" onClick={handleCreateProject}>
        Create Project
      </button>
    </div>
  );
}

export default CreateProject;