const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.all('/', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const timestamp = new Date().toISOString();
    fs.appendFileSync('requests.log', '[' + timestamp + '] IP: ' + ip + '\n');
    res.json({
        status: 'success',
        version: '2.3.1',
        message: 'Connected to JUNIOR SERVER'
    });
});

app.get('/logs', (req, res) => {
    if (fs.existsSync('requests.log')) {
        const logs = fs.readFileSync('requests.log', 'utf8');
        res.send('<pre>' + logs + '</pre>');
    } else {
        res.send('No logs.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log('Server running on port ' + PORT);
});
