"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("./utils/logger");
const body_parser_1 = __importDefault(require("body-parser"));
const backOfficeUser_routes_1 = __importDefault(require("./routes/backOfficeUser.routes"));
const auth_routes_js_1 = __importDefault(require("./routes/auth.routes.js"));
// import userRoutes from './routes/userRoutes';
const neckAngle_routes_1 = __importDefault(require("./routes/neckAngle.routes"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
require("reflect-metadata"); // 👈 ADD THIS AS THE FIRST LINE
const goals_routes_js_1 = __importDefault(require("./routes/goals.routes.js"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cervitech';
console.log(MONGODB_URI);
// Middleware
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "keyboardcat", // secret for signing
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // ⚠️ set secure: true if using HTTPS
}));
app.use((0, morgan_1.default)(':method :url :status :response-time ms - :res[content-length]', {
    stream: logger_1.logger.stream
}));
// Routes
app.use('/api/v1/auth', auth_routes_js_1.default);
app.use('/api/neck-angle', neckAngle_routes_1.default);
app.use("/api/backoffice-users", backOfficeUser_routes_1.default);
app.use('/api/v1/transactions', transactionRoutes_1.default);
app.use('/api/goals', goals_routes_js_1.default);
// Connect to MongoDB and start server
mongoose_1.default.connect(MONGODB_URI, {
    dbName: "cervitechdb", // 👈 force your app to use "cervitech" database
})
    .then(() => {
    logger_1.logger.info('✅ MongoDB connected');
    app.listen(PORT, () => {
        logger_1.logger.info(`Server running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
});
exports.default = app;
