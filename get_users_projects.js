const base = require('../base'); 

async function getProjectsForUser(userId) {
  const query = `
    SELECT project.*
    FROM project
    INNER JOIN all_account_data ON a.id = all_account_data.project_id
    WHERE participants.user_id = ?;
  `;

  try {
    const [rows] = await base.query(query, [userId]);
    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = getProjectsForUser;