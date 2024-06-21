"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const port = 3000;
const dbFilePath = './src/db.json';
// Middleware
app.use(body_parser_1.default.json());
// Ping endpoint
app.get('/ping', (req, res) => {
    res.json({ success: true });
});
// Submit endpoint
app.post('/submit', (req, res) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    const newSubmission = { name, email, phone, github_link, stopwatch_time };
    try {
        // Read existing submissions from JSON file
        const data = JSON.parse(fs_1.default.readFileSync(dbFilePath, 'utf-8'));
        // Add new submission to data array
        data.push(newSubmission);
        // Write updated data back to JSON file
        fs_1.default.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
        res.status(201).json({ success: true });
    }
    catch (error) {
        console.error('Error saving submission:', error);
        res.status(500).json({ error: 'Failed to save submission' });
    }
});
// Read endpoint
app.get('/read', (req, res) => {
    const index = parseInt(req.query.index, 10);
    try {
        // Read existing submissions from JSON file
        const data = JSON.parse(fs_1.default.readFileSync(dbFilePath, 'utf-8'));
        // Check if index is valid
        if (index >= 0 && index < data.length) {
            res.json(data[index]);
        }
        else {
            res.status(404).json({ error: 'Submission not found' });
        }
    }
    catch (error) {
        console.error('Error reading submissions:', error);
        res.status(500).json({ error: 'Failed to read submissions' });
    }
});
// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
