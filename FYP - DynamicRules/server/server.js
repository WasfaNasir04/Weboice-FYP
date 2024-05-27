const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3002;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Log received requests middleware (place this before other routes/static file middleware)
app.use((req, res, next) => {
  console.log(`Received request for: ${req.url}`);
  next();
});

// Serve HTML and JS files from the root directory
app.use(express.static(path.join(__dirname, '..', )));

// Serve static files from the "styles" directory
app.use('/styles', express.static(path.join(__dirname, 'styles')));

// Serve static files from the "images" directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// Serve static files from the "videos" directory
app.use('/videos', express.static(path.join(__dirname, 'videos')));

// ... your other routes ...

// Route handler for the root path
app.get('/', (req, res) => {
  // Your logic for handling requests to the root path
  res.sendFile(path.join(__dirname, '..', 'home.html'));
});

app.post('/microphone-permission', (req, res) => {
  const { permission } = req.body;

  if (permission === 'allowed') {
    // Handle logic when microphone access is allowed
    res.json({ status: 'success', message: 'Microphone access granted!' });
  } else if (permission === 'denied') {
    // Handle logic when microphone access is denied
    res.json({ status: 'success', message: 'Microphone access denied!' });
  } else {
    // Handle invalid permission value
    res.status(400).json({ status: 'error', message: 'Invalid permission value' });
  }
});

app.listen(port, () => {
  //localStorage.removeItem('microphonePermission');
  console.log(`Server running at http://localhost:${port}/`);
});
