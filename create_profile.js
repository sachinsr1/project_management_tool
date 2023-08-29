const express = require('express');
const router = express.Router();
const base = require('../base'); 

router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, favoriteFoods, bio, username } = req.body;

    const sqlQuery = `
      UPDATE all_account_data
      SET first_name = ?, last_name = ?,
          project_interests = ?, bio = ?
      WHERE username = ?
    `;

    const values = [firstName, lastName, favoriteFoods, bio, username];

    await base.execute(sqlQuery, values);

    res.status(201).json({ message: 'User account updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'error' });
  }
});

module.exports = router;