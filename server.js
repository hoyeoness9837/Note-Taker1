const express = require('express');
const { join } = require('path');
const { readFile } = require('fs');
const { writeFile } = require('fs');
const { promisify } = require('util');
const rf = promisify(readFile);
const wf = promisify(writeFile);
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'notes.html'));
});

app.get('/api/notes', (req, res) => {
  rf('./db/db.json', 'utf8')
    .then((data) => {
      res.json(JSON.parse(data));
    })
    .catch((err) => console.error(err));
});

app.post('/api/notes', (req, res) => {
  rf('./db/db.json', 'utf8').then((data) => {
    savedData = JSON.parse(data);
    res.json(savedData);
    req.body.id = savedData.length + 1;
    savedData.push(req.body);
    wf('./db/db.json', JSON.stringify(savedData)).catch((err) =>
      console.error(err)
    );
  });
});

app.delete('/api/notes/:id', (req, res) => {
  rf('./db/db.json', 'utf8')
    .then((data) => {
      savedData = JSON.parse(data);
      res.json(savedData);
      savedData = savedData.filter((item) => {
        if (item.id === parseInt(req.params.id)) {
          return false;
        } else {
          return true;
        }
      });
      wf('./db/db.json', JSON.stringify(savedData));
    })
    .catch((err) => console.error(err));
});

app.listen(process.env.PORT || 3000, () => console.log('http://localhost:3000'));
