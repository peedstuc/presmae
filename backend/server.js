const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname + '/../')); // Now serves presmae/
app.use(cors());

const polls = {};

function generatePollId() {
    return Math.random().toString(36).substring(2, 10);
}

app.post('/api/create-poll', (req, res) => {
    const { movies } = req.body;
    if (!movies || !Array.isArray(movies) || movies.length === 0) {
        return res.status(400).json({ error: 'Movies array is required' });
    }
    const pollId = generatePollId();
    polls[pollId] = { movies: movies.map(movie => ({ name: movie })), createdAt: new Date() };
    const summaryLink = `http://localhost:3000/summary.html?poll=${pollId}`; // Updated path
    res.json({ pollId, summaryLink });
});

app.get('/api/poll/:pollId', (req, res) => {
    const { pollId } = req.params;
    if (!polls[pollId]) {
        return res.status(404).json({ error: 'Poll not found' });
    }
    res.json(polls[pollId]);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});