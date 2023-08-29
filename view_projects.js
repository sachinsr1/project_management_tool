const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const base = require('../base.js'); 

router.get('/:username', async (req, res) => {
  const username = req.params.username;

  
  const sql = `
    SELECT * FROM project
    WHERE JSON_CONTAINS(people, '{"firstName": "${username}" }') OR user_id = (
      SELECT id FROM all_account_data
      WHERE username = ?
    );
  `;

  try {
    const [results, _] = await base.execute(sql, [username]);

    if (!results) {
      console.error('Error retrieving projects');
      return res.status(500).json({ message: 'Internal server error' });
    }

    const projects = results;

    return res.status(200).json({ projects });
  } catch (error) {
    console.error('Error retrieving projects:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;