require('./src/config/env.js'); 
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./src/config/db');
const { errorHandler } = require('./src/middlewares/errorMiddleware');
const app = require('./src/app');

// Connect to Database
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: [
            process.env.FRONTEND_URL, 
            "http://localhost:5173", 
            "http://127.0.0.1:5173",
            /\.vercel\.app$/
        ],
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.set('io', io);

// Socket.io handlers
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinRoom', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Root Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error handling middleware (Should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export io for use in controllers
module.exports = { io };
