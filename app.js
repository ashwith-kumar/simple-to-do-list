const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const config = require('./config');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // To use static files from the 'public' folder

const db = mysql.createConnection(config);

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

db.query('CREATE TABLE IF NOT EXISTS todos (id INT AUTO_INCREMENT PRIMARY KEY, task TEXT)', (err) => {
  if (err) {
    console.error('Error creating todos table:', err);
  }
});

// GET Request
app.get('/api/tasks', (req, res) => {
    db.query('SELECT * FROM todos', (err, results) => {
    // Handling the error
      if (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      res.json(results);
    });
  });
  
// POST request to add a task
  app.post('/api/tasks', (req, res) => {
    const { task } = req.body;
  
    if (!task) {
      res.status(400).json({ error: 'Task is required' });
      return;
    }
  
    // Inserting the task entered into the todos table 
    db.query('INSERT INTO todos (task) VALUES (?)', [task], (err, results) => {
     // Handling the error if task can cannot be added 
      if (err) {
        console.error('Error adding task:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      res.json({ id: results.insertId, task });
    });
  });
  
  app.delete('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;
  
    // Deleting the existing task from the todos table
    db.query('DELETE FROM todos WHERE id = ?', [taskId], (err, results) => {
      if (err) {
        console.error('Error removing task:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      res.json({ message: 'Task removed successfully' });
    });
  });
  
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
