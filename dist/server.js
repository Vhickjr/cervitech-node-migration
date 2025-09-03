"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_js_1 = require("./utils/logger.js");
const auth_routes_js_1 = __importDefault(require("./routes/auth.routes.js"));
// import userRoutes from './routes/userRoutes';
const neckAngle_routes_1 = __importDefault(require("./routes/neckAngle.routes"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
require("reflect-metadata"); // 👈 ADD THIS AS THE FIRST LINE
const goals_routes_js_1 = __importDefault(require("./routes/goals.routes.js"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cervitech';
console.log(MONGODB_URI);
// Middleware
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev', { stream: logger_js_1.loggerStream }));
// Routes
app.use('/api/v1/auth', auth_routes_js_1.default);
app.use('/api/neck-angle', neckAngle_routes_1.default);
app.use('/api/v1/transactions', transactionRoutes_1.default);
app.use('/api/goals', goals_routes_js_1.default);
// Connect to MongoDB and start server
mongoose_1.default.connect(MONGODB_URI)
    .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
});
exports.default = app;
