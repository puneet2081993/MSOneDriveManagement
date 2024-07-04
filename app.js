// Dependencies
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const routes = require('./src/routes');

// const socketio = require('socket.io');

dotenv.config();

// Express setup
const app = express();
app.use(bodyParser.json());

app.use(session({
  secret: 'your_session_secret',
  resave: false,
  saveUninitialized: false
}));

app.use('/', routes);

// Server start
const PORT = process.env.PORT || 3030;

// WebSocket setup
const server = app.listen(PORT, () => {
  console.log(`Welcome to OneDrive Management App - Created By Puneet Jain`);
  console.log(`Server is running on http://localhost:${PORT}`);
});
// const io = socketio(server);

// // Example of monitoring file access (pseudo-code)
// function monitorFileAccess(fileId) {
//   console.log(`Monitoring file access for file ${fileId}`);
// }

// // WebSocket for real-time updates
// io.on('connection', (socket) => {
//   console.log('A user connected');
  
//   // Example socket event listener for monitoring file access
//   socket.on('monitorFile', (fileId) => {
//     monitorFileAccess(fileId);
//   });
// });
