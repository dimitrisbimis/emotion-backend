const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'picker.html'));
});

app.get('/visualizer', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'visualizer.html'));
});

let emotionCounts = {
  Joy: 0,
  Sadness: 0,
  Anger: 0,
  Love: 0,
  Calm: 0
};

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('emotion', (emotion) => {
    if (emotionCounts.hasOwnProperty(emotion)) {
      emotionCounts[emotion]++;
      io.emit('emotion', emotion);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

http.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});