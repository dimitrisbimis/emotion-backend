// Ορισμός χρωμάτων για διαφορετικά συναισθήματα
let emotionColors = {
  Joy: [255, 192, 0],
  Sadness: [0, 71, 171],
  Anger: [210, 4, 45],
  Love: [250, 160, 160],
  Calm: [167, 199, 231]
};

// Καταμέτρηση εμφανίσεων κάθε συναισθήματος
let emotionCounts = {
  Joy: 0,
  Sadness: 0,
  Anger: 0,
  Love: 0,
  Calm: 0
};

// Συνολικός αριθμός συναισθημάτων που έχουν ληφθεί
let totalEmotions = 0;

// Λίστα με ονόματα αρχείων μουσικής
let songs = ["time.mp3", "above.mp3", "back.mp3"];
let index = 0;
let song;
let fft;
let button;
let bgImage;


// Φορτώνει ήχο και εικόνα πριν ξεκινήσει το πρόγραμμα
function preload() {
  song = loadSound(songs[index]);
  bgImage = loadImage("background.jpg");
}

function setup() {
  createCanvas (windowWidth, windowHeight); // Καμβάς σε μέγεθος παραθύρου
  setupSocket();                            // Εγκαθιστά επικοινωνία WebSocket

  
  // Δημιουργία κουμπιού Play/Pause
  button = createButton("play");
  button.position(10, 10);
  button.mousePressed(togglePlaying);

  fft = new p5.FFT(0.9, 512); // Ρυθμίσεις για ανάλυση ήχου
  angleMode(DEGREES);          // Χρήση μοιρών αντί για ακτίνια
}

function draw() {
  image(bgImage, 0, 0, width, height);

  // Ανάλυση του ήχου σε συχνότητες (φάσμα)
  let spectrum = fft.analyze(1024, 1024);
  strokeWeight(1);
  noFill();

  let gridSize = 6; // Πλέγμα 6x6
  let cellSize = width / gridSize; // Μέγεθος κελιού ανάλογα με το πλάτος


  // Βρόχος για κάθε κελί του πλέγματος
  for (let gx = 0; gx < gridSize; gx++) {
    for (let gy = 0; gy < gridSize; gy++) {
      push();
      let centerX = gx * cellSize + cellSize / 2;
      let centerY = gy * cellSize + cellSize / 2;
      translate(centerX, centerY); // Μετακίνηση στο κέντρο του κελιού

      beginShape();
      // Βρόχος για σχεδίαση του "σχήματος φάσματος"
      for (let i = 0; i < spectrum.length; i++) {
        let angle = map(i, 0, spectrum.length, 0, 360);  // Αντιστοίχιση σε κύκλο
        let amp = spectrum[i]; // Ένταση συχνότητας
        let r = map(amp, 0, 512, 5, 500); // Ακτίνα σχεδίασης
        let x = r * cos(angle); 
        let y = r * sin(angle);
        vertex(x, y); // Σημείο του σχήματος


        // Κάθε 2 βήματα, σχεδιάζεται και μία γραμμή από το κέντρο
        if (i % 2 === 0) {
          let chosenColor = [255, 255, 255];
          let rand = Math.random();
          let acc = 0;

          // Αν υπάρχουν δεδομένα συναισθημάτων, επιλέγεται χρώμα με βάση πιθανότητες
          if (totalEmotions > 0) {
            for (let emotion in emotionCounts) {
              acc += emotionCounts[emotion] / totalEmotions;
              if (rand <= acc) {
                chosenColor = emotionColors[emotion];
                break;
              }
            }
          }

          stroke(...chosenColor, 150); // Ημιδιαφανές χρώμα
          line(0, 0, x, y); // Γραμμή από το κέντρο προς τα έξω
        }
      }
      endShape(CLOSE); // Κλείνει το σχήμα
      pop(); // Επαναφέρει την κατάσταση
    }
  }
}

// Εναλλαγή μεταξύ αναπαραγωγής και παύσης του ήχου
function togglePlaying() {
  if (!song.isPlaying()) {
    song.play();
    button.html("pause");
  } else {
    song.pause();
    button.html("play");
  }
}

// Όταν πατηθεί το πλήκτρο "c", αλλάζει τραγούδι
function keyPressed() {
  if (key === "c") {
    index = (index + 1) % songs.length; // Εναλλαγή μεταξύ των 3 τραγουδιών
    if (song.isPlaying()) {
      song.stop();
    }

    song = loadSound(songs[index], () => {
      song.play();
      button.html("pause");
    });
  }
}

// Σύνδεση με τον διακομιστή για λήψη συναισθημάτων μέσω WebSocket
function setupSocket() {
  const socket = io('https://emotion-backend-lpza.onrender.com');
  // Όταν ληφθεί ένα νέο συναίσθημα από τον server
  socket.on("emotion", (emotion) => {
    if (emotionCounts.hasOwnProperty(emotion)) {
      emotionCounts[emotion]++;
      totalEmotions++;
    }
  });
}
