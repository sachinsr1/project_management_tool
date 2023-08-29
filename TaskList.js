import React, { useState, useEffect } from 'react';

function TaskListPage() {
  const [tasks, setTasks] = useState([]);

 
  

  useEffect(() => {
    
    setTasks(sampleTasks);
  }, []);

  const assignTask = (taskId) => {
   
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, assigned: true } : task
      )
    );
  };

  return (
    <div>
      <h2>Task List</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h3>{task.name}</h3>
            <p>{task.description}</p>
            <p>Hours: {task.hours}</p>
            {task.assigned ? (
              <p>Assigned to You</p>
            ) : (
              <button onClick={() => assignTask(task.id)}>Assign to Me</button>
            )}
            
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskListPage;