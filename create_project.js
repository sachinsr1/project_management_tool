const express = require('express');
const router = express.Router();
const base = require('../base'); 

router.post('/:username', async (req, res) => {
  try {
    const { title, startDate, endDate, tasks, people } = req.body;
    const username = req.params.username;

    const task_list = JSON.stringify(tasks);
    const peoples = JSON.stringify(people);

    const getUserIdQuery = `SELECT id FROM all_account_data WHERE username = ?`;

    const [userResults] = await base.execute(getUserIdQuery, [username]);

    if (userResults.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userId = userResults[0].id;
    const insertProjectQuery = `
      INSERT INTO project (title, start_date, end_date, tasks, people, user_id)
      VALUES (?, ?, ?, ?, ?, ?)`;
    const projectValues = [title, startDate, endDate, task_list, peoples, userId];

    await base.execute(insertProjectQuery, projectValues);

    res.status(201).json({ message: 'Project created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'error' });
  }
});

module.exports = router;