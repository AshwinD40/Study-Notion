const express = require("express");
const app = express();
const dotenv = require("dotenv");
const os = require("os");
dotenv.config();

const userRoute = require('./routers/user');
const profileRoute = require('./routers/profile');
const courseRoute = require('./routers/course');
const paymentRoute = require('./routers/payment');
const contactUsRoute = require("./routers/Contact");

const database = require('./config/database');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

const PORT = process.env.PORT || 3000

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (mobile apps, Postman, server-to-server)
            if (!origin) return callback(null, true);
            const allowedOrigins = [
                "http://localhost:3000",
                "http://localhost:3001",
                process.env.FRONTEND_URL,
                process.env.CLIENT_URL,
            ].filter(Boolean);
            if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
                return callback(null, true);
            }
            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
)

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: os.tmpdir(),
    })
)

// connection with cloudinary
cloudinaryConnect();

// routes
app.use('/api/v1/auth', userRoute);
app.use('/api/v1/profile', profileRoute);
app.use('/api/v1/course', courseRoute);
app.use('/api/v1/payment', paymentRoute);
app.use("/api/v1/reach", contactUsRoute);

// app.get default route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Welcome to your server ",
    });
});

async function startServer() {
    await database.connect();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log("--- SERVER RESTARTED AT " + new Date().toISOString() + " [FORCE RESTART] ---");
    });
}

startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
