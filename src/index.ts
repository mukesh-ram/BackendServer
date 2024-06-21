import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;
const dbFilePath = path.join(__dirname, 'db.json');

// Middleware
app.use(bodyParser.json());

// Ping endpoint
app.get('/ping', (req: Request, res: Response) => {
    res.json({ success: true });
});

// Submit endpoint
app.post('/submit', (req: Request, res: Response) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;

    const newSubmission = { name, email, phone, github_link, stopwatch_time };
    console.log('New Submission:', newSubmission);

    try {
        // Read existing submissions from JSON file
        const data: any[] = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
        console.log('Existing Data:', data);

        // Add new submission to data array
        data.push(newSubmission);

        // Write updated data back to JSON file
        fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));

        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Error saving submission:', error);
        res.status(500).json({ error: 'Failed to save submission' });
    }
});

// Read endpoint
app.get('/read', (req: Request, res: Response) => {
    const index = parseInt(req.query.index as string, 10);

    try {
        // Read existing submissions from JSON file
        const data: any[] = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));

        // Check if index is valid
        if (index >= 0 && index < data.length) {
            res.json(data[index]);
        } else {
            res.status(404).json({ error: 'Submission not found' });
        }
    } catch (error) {
        console.error('Error reading submissions:', error);
        res.status(500).json({ error: 'Failed to read submissions' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
