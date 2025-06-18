const express = require('express');
const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

app.use(express.static('public')); 

app.get('/ping', (req, res) => {
  res.send('pong');
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('emotion', (emotion) => {
    console.log('Emotion received:', emotion);
    io.emit('emotion', emotion); // broadcast to all
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
