const express = require('express');
const router = express.Router();
const base = require('../base');

router.get('/:projectID', async (req, res) => {
  try {
    const { projectID } = req.params;

    const sql = 'SELECT tasks, end_date FROM project WHERE title = ?';

    const [results] = await base.execute(sql, [projectID]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const tasks = JSON.parse(JSON.stringify(results[0].tasks));
    const actualCompletionDate = new Date(results[0].end_date);

    
    const projectStats = calculateProjectStatistics(tasks, actualCompletionDate);

    res.json({ tasks, projectStats, actualCompletionDate }); 
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/assign/:projectID/:taskID', async (req, res) => {
  const { projectID, taskID } = req.params;
  const { username } = req.body;

  try {
    
    const [projectQueryResult] = await base.execute(`SELECT tasks, end_date FROM project WHERE title = ?`, [projectID]);

    if (!projectQueryResult || projectQueryResult.length === 0 || !projectQueryResult[0].tasks) {
      return res.status(404).json({ message: 'Project or tasks not found' });
    }

    const tasks = JSON.parse(JSON.stringify(projectQueryResult[0].tasks));
    const actualCompletionDate = new Date(projectQueryResult[0].end_date);

    
    tasks.forEach((task) => {
      if (task.task === taskID) {
        if (!task.assignedUsers) {
          task.assignedUsers = [];
        }

        if (!task.assignedUsers.includes(username)) {
          task.assignedUsers.push(username);
        }
      }
    });

    
    const projectStats = calculateProjectStatistics(tasks, actualCompletionDate);

    
    await base.execute('UPDATE project SET tasks = ? WHERE title = ?', [JSON.stringify(tasks), projectID]);

    res.json({ message: 'Username assigned successfully', tasks, ...projectStats });
  } catch (error) {
    console.error('Error assigning username:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/unassign/:projectID/:taskID', async (req, res) => {
  const { projectID, taskID } = req.params;
  const { username } = req.body;

  try {
    
    const [projectQueryResult] = await base.execute(`SELECT tasks, end_date FROM project WHERE title = ?`, [projectID]);

    if (!projectQueryResult || projectQueryResult.length === 0 || !projectQueryResult[0].tasks) {
      return res.status(404).json({ message: 'Project or tasks not found' });
    }

    const tasks = JSON.parse(JSON.stringify(projectQueryResult[0].tasks));
    const actualCompletionDate = new Date(projectQueryResult[0].end_date);

    
    tasks.forEach((task) => {
      if (task.task === taskID && task.assignedUsers) {
        task.assignedUsers = task.assignedUsers.filter((user) => user !== username);
      }
    });

    
    const projectStats = calculateProjectStatistics(tasks, actualCompletionDate);

    
    await base.execute('UPDATE project SET tasks = ? WHERE title = ?', [JSON.stringify(tasks), projectID]);

    res.json({ message: 'Username unassigned successfully', tasks, ...projectStats });
  } catch (error) {
    console.error('Error unassigning username:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/hours/:projectID/:taskID', async (req, res) => {
  const { projectID, taskID } = req.params;
  const { hours } = req.body;

  try {
    
    const [projectQueryResult] = await base.execute(`SELECT tasks, end_date FROM project WHERE title = ?`, [projectID]);

    if (!projectQueryResult || projectQueryResult.length === 0 || !projectQueryResult[0].tasks) {
      return res.status(404).json({ message: 'Project or tasks not found' });
    }

    const tasks = JSON.parse(JSON.stringify(projectQueryResult[0].tasks));
    const actualCompletionDate = new Date(projectQueryResult[0].end_date);

    
    tasks.forEach((task) => {
      if (task.task === taskID) {
        console.log("HI", hours);
        if (task['updated-hours']) {
          task['updated-hours'] = hours + task['updated-hours'];
        }
        else {
          task['updated-hours'] = hours;
        }
      }
    });

    console.log(tasks);

    
    const projectStats = calculateProjectStatistics(tasks, actualCompletionDate);

    
    await base.execute('UPDATE project SET tasks = ? WHERE title = ?', [JSON.stringify(tasks), projectID]);

    res.json({ message: 'Task hours updated successfully', tasks, ...projectStats });
  } catch (error) {
    console.error('Error updating task hours:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

function calculateProjectStatistics(tasks, actualCompletionDate) {
  let totalTasksCompleted = 0;
  let totalHoursWorked = {};
  let estimatedCompletionDate = null;

  
  if (actualCompletionDate && typeof actualCompletionDate === 'string') {
    actualCompletionDate = new Date(actualCompletionDate);
  }

  tasks.forEach((task) => {
    const totalTaskHours = parseFloat(task['updated-hours']) || 0;

    if (totalTaskHours >= task.hours) {
      totalTasksCompleted++;
    }

    task.assignedUsers.forEach((user) => {
      if (!totalHoursWorked[user]) {
        totalHoursWorked[user] = 0;
      }
      totalHoursWorked[user] += totalTaskHours;
    });
  });

  if (totalTasksCompleted > 0) {
    const currentDate = new Date();
    const daysRemaining = totalTasksCompleted / tasks.length;
    estimatedCompletionDate = new Date(currentDate.getTime() + daysRemaining * 24 * 60 * 60 * 1000);
  }

  return {
    tasksCompleted: totalTasksCompleted,
    totalHoursWorked,
    estimatedCompletionDate,
    actualCompletionDate: actualCompletionDate ? actualCompletionDate : null, 
  };
}

module.exports = router;