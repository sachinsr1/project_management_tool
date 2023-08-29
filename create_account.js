const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const base = require('../base.js'); 

router.post('/', async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    console.log(password);

    const hashedPassword = await bcrypt.hash(password, 10); 

    const insertQuery = 'INSERT INTO all_account_data (username, password) VALUES (?, ?)';
    const values = [username, hashedPassword];
    
    const connection = await base.getConnection(); 
    try {
      await connection.execute(insertQuery, values); 
    } finally {
      connection.release(); 
    }

    res.status(201).json({ message: 'Account created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'error in backend' });
  }
});

module.exports = router;