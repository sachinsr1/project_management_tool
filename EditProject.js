import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function EditProject() {
  const [tasks, setTasks] = useState([]);
  const { projectID, username } = useParams();
  const [taskHours, setTaskHours] = useState({}); 
  const [projectStats, setProjectStats] = useState({
    estimatedCompletionDate: '',
    actualCompletionDate: '', 
    totalWorkByPerson: [],
    tasksCompleted: 0,
    tasksInProgress: 0,
    tasksNotStarted: 0,
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:8000/edit_project/${projectID}`);
        if (response.ok) {
          const data = await response.json();

          if (Array.isArray(data)) {
            setTasks(data);
          } else if (data.tasks) {
            setTasks(data.tasks);
          }

          setProjectStats({
            ...projectStats,
            actualCompletionDate: data.actualCompletionDate,
          });
        } else {
          console.error('Error fetching tasks');
        }
      } catch (error) {
        console.error('Internal server error:', error);
      }
    };

    fetchTasks();
  }, [projectID]);

  const addOrRemoveUsernameToTask = (taskId) => {
    const task = tasks.find((t) => t.task === taskId);

    if (task) {
      const assignedUsers = task.assignedUsers || [];

      if (assignedUsers.includes(username)) {
        removeUsernameFromTask(taskId);
      } else {
        assignUsernameToTask(taskId);
      }
    }
  };

  const assignUsernameToTask = (taskId) => {
    fetch(`http://localhost:8000/edit_project/assign/${projectID}/${taskId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks(data.tasks);
        calculateProjectStatistics(data.tasks);
      })
      .catch((error) => {
        console.error('Error assigning username:', error);
      });
  };

  const removeUsernameFromTask = (taskId) => {
    fetch(`http://localhost:8000/edit_project/unassign/${projectID}/${taskId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks(data.tasks);
        calculateProjectStatistics(data.tasks);
      })
      .catch((error) => {
        console.error('Error removing username:', error);
      });
  };

  const handleTaskHoursChange = (taskId, hours) => {
    const updatedTaskHours = { ...taskHours, [taskId]: hours };
    setTaskHours(updatedTaskHours);
  };

  const calculateTaskStatistics = (taskId) => {
    
    const hours = parseFloat(taskHours[taskId] || 0);

    
    fetch(`http://localhost:8000/edit_project/hours/${projectID}/${taskId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username, hours: hours }),
    })
      .then((response) => response.json())
      .then((data) => {
        
        setTasks(data.tasks);
        
        calculateProjectStatistics(data.tasks);
      })
      .catch((error) => {
        console.error('Error updating task hours:', error);
      });
  };

  const calculateProjectStatistics = (updatedTasks) => {
    
    let totalWorkByPerson = {};
    let tasksCompleted = 0;
    let tasksInProgress = 0;
    let tasksNotStarted = 0;
    let estimatedCompletionDate = null;

    
    updatedTasks.forEach((task) => {
      const assignedUsers = task.assignedUsers;
      const taskTotalHours = task.hours;

      assignedUsers.forEach((user) => {
        const updatedHours = parseFloat(task[`updated-hours`] || 0);

        if (!totalWorkByPerson[user]) {
          totalWorkByPerson[user] = 0;
        }
        totalWorkByPerson[user] += updatedHours;

        if (updatedHours >= taskTotalHours && taskTotalHours > 0) {
          tasksCompleted++;
        } else if (updatedHours > 0 && updatedHours < taskTotalHours) {
          tasksInProgress++;
        } else {
          tasksNotStarted++;
        }
      });
    });

    
    if (tasksCompleted > 0) {
      const currentDate = new Date();
      const daysRemaining = tasksCompleted / updatedTasks.length;
      estimatedCompletionDate = new Date(currentDate.getTime() + daysRemaining * 24 * 60 * 60 * 1000);
    } else {
      
      if (projectStats.actualCompletionDate instanceof Date) {
        estimatedCompletionDate = new Date(projectStats.actualCompletionDate.getTime() * 2);
      }
    }

    setProjectStats({
      estimatedCompletionDate,
      actualCompletionDate: projectStats.actualCompletionDate,
      totalWorkByPerson: Object.entries(totalWorkByPerson).sort((a, b) => b[1] - a[1]),
      tasksCompleted,
      tasksInProgress,
      tasksNotStarted,
    });
  };

  return (
    <div>
      <h2>Task List</h2>
      {tasks && tasks.length > 0 ? (
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>
              <h3>
                {task.task} - Assigned Users: {task.assignedUsers && task.assignedUsers.length > 0
                  ? task.assignedUsers.join(', ')
                  : 'None'}
              </h3>
              <div>
                <p>Hours: {task.hours}</p>
                <div>
                  <p>
                    Enter Hours:
                    <input
                      type="number"
                      value={taskHours[task.task] || ''}
                      onChange={(e) => handleTaskHoursChange(task.task, e.target.value)}
                    />
                  </p>
                  <button onClick={() => calculateTaskStatistics(task.task)}>Calculate Statistics</button>
                  <button onClick={() => addOrRemoveUsernameToTask(task.task)}>
                    {task.assignedUsers && task.assignedUsers.includes(username) ? 'Unassign Me' : 'Assign Me'}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks found</p>
      )}

      <div>
        <h2>Project Statistics</h2>
        {projectStats.estimatedCompletionDate && (
          <p>Estimated Completion Date: {new Date(projectStats.estimatedCompletionDate).toLocaleDateString()}</p>
        )}
        {projectStats.actualCompletionDate && (
          <p>Actual Completion Date: {new Date(projectStats.actualCompletionDate).toLocaleDateString()}</p>
        )}
        <h3>Total Work by Each Person</h3>
        <ul start="1">
          {Object.entries(projectStats.totalWorkByPerson).map(([person, hours]) => (
            <li key={person}>
              {person}: {hours + "  "}  hours
            </li>
          ))}
        </ul>
        <p>Tasks Completed: {projectStats.tasksCompleted}</p>
        <p>Tasks In Progress: {projectStats.tasksInProgress}</p>
        <p>Tasks Not Started: {projectStats.tasksNotStarted}</p>
      </div>
    </div>
  );
}

export default EditProject;