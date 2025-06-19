// Φόρτωση της βιβλιοθήκης express – framework για web server
const express = require('express');
const app = express();
// Δημιουργία HTTP server βασισμένου στην express
const http = require('http').createServer(app);

// Ενσωμάτωση του Socket.IO για real-time επικοινωνία με WebSockets
const io = require('socket.io')(http, {
  cors: {
    origin: "*", // Επιτρέπει συνδέσεις από οποιαδήποτε διεύθυνση (CORS policy)
    methods: ["GET", "POST"] // Επιτρεπόμενες μέθοδοι HTTP
  }
});

// Καθορισμός φακέλου 'public' ως στατικός — αρχεία HTML, CSS, JS μπορούν να σερβιριστούν
app.use(express.static('public')); 

// Route για έλεγχο λειτουργίας του server
app.get('/ping', (req, res) => {
  res.send('pong'); // 
});

// Όταν ένας client συνδεθεί μέσω Socket.IO
io.on('connection', (socket) => {
  console.log('User connected:', socket.id); // Εκτύπωση ID του χρήστη

// Όταν λάβει γεγονός "emotion" από client
  socket.on('emotion', (emotion) => {
    console.log('Emotion received:', emotion); // Εκτυπώνει το συναίσθημα στο terminal
    io.emit('emotion', emotion);  // Το στέλνει πίσω σε όλους τους συνδεδεμένους clients (broadcast)
  });

  // Όταν ο χρήστης αποσυνδεθεί
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id); // Εκτύπωση ID αποσυνδεδεμένου χρήστη
  });
});

// Καθορισμός θύρας εκκίνησης (από μεταβλητή περιβάλλοντος ή default 3000)
const PORT = process.env.PORT || 3000;
// Εκκίνηση server και εμφάνιση μηνύματος στο terminal
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
