// require("dotenv").config();
// const express = require("express");
// const cors = require('cors')
// const passport = require("passport");
// const session = require("express-session");
// const cookieParser = require("cookie-parser");
// const connectDB = require("./config/db");
// const errorHandler = require("./middlewares/errorHandler");
// const routes = require("./routes/index");
// const app = express();

// // cors
// app.use(cors({
//     origin: process.env.FRONT_END_URL,
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
//     credentials: true
// }));

// // Connection
// connectDB()
// require("./config/passport");

// // Middlewares
// app.use(express.json());
// app.use(cookieParser());
// app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
// app.use(passport.initialize());
// app.use(passport.session());


// // Centralized routes
// app.use("/api", routes);


// // Global errorHandler
// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
const routes = require("./routes/index");
const { initSocket } = require("./socket/socket");
const { setupChatSocket } = require("./socket/chatSocket");

const app = express();
const server = http.createServer(app); // Create HTTP server

// CORS
app.use(cors({
    origin: process.env.FRONT_END_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}));

// Database Connection
connectDB();
require("./config/passport");

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api", routes);

// Error Handling
app.use(errorHandler);

// Initialize Socket.io
const io = initSocket(server); 
setupChatSocket(io); // Pass `io` to handle all chat events

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
