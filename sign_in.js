

//app.use(express.json());
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

const express = require('express');
const bcrypt = require('bcryptjs');
const base = require('../base.js'); 
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    
    const getUserQuery = `SELECT password FROM all_account_data WHERE username = ?`;

    const connection = await base.getConnection(); 
    try {
      const [results] = await connection.execute(getUserQuery, [username]);

      
      if (results.length === 0) {
        return res.status(401).json({ error: 'Username not found' });
      }

      const hashedPasswordFromDatabase = results[0].password;

      
      const isMatch = await bcrypt.compare(password, hashedPasswordFromDatabase);

      if (isMatch) {
        
        res.status(200).json({ message: 'Login successful' });
      } else {
        
        res.status(401).json({ error: 'Incorrect password' });
      }
    } finally {
      connection.release(); 
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'error' });
  }
});

module.exports = router;