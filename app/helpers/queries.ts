const queries = {
    'CHECK_IF_USER_EXIST': 'SELECT * FROM user_management where id= $1',
    'CHECK_IF_CHAT_EXIST': 'SELECT * FROM chat where id= $1',
    'ADD_CHAT': 'INSERT INTO chat (id) VALUES ($1)',
    'ADD_USER': 'INSERT INTO user_management (id) VALUES ($1)',
    'INSERT_PROJECT': 'INSERT INTO project (name,notice, userId, chatId) VALUES ($1,$2,$3,$4)',
    'GET_PROJECTS': 'SELECT id,name FROM project WHERE userID = $1 AND chatId = $2;',
    'GET_ACTIVE_PROJECT': 'SELECT p.name FROM timetracker t INNER JOIN project p ON t.projectId = p.id WHERE t.isactive = true AND t.userId = $1 AND t.chatId = $2',
    'NEW_TIME': 'INSERT INTO timetracker (startTime, endTime, projectId, userId,chatId,isActive) VALUES(current_timestamp,current_timestamp, $1, $2,$3, true)',
    'FINISH_TIME': 'UPDATE  timetracker SET endtime =now(), isactive=false WHERE userId = $1 AND chatId = $2 AND isactive = true;',
    'GET_ALL_PROJECTS_INFORMATION': 'SELECT  p.name, SUM(t.endtime-t.starttime) FROM timetracker t INNER JOIN project p ON t.projectId = p.id WHERE t.userId= $1 AND t.chatId=$2 GROUP BY p.id;'
}


export {queries};