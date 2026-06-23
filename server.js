const express = require('express');
const fs = require('fs');
const app = express();

// ===== MIDDLEWARE =====
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// ===== SPECIFIC ROUTES (MUST BE BEFORE THE CATCH-ALL) =====

// Ping endpoint for keep-alive
app.get('/ping', (req, res) => {
    res.send('pong');
});

// Logs viewer
app.get('/logs', (req, res) => {
    if (fs.existsSync('requests.log')) {
        const logs = fs.readFileSync('requests.log', 'utf8');
        res.send('<pre>' + logs + '</pre>');
    } else {
        res.send('No logs.');
    }
});

// ===== CATCH-ALL ROUTE (Responds to everything else) =====
app.all('*', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const timestamp = new Date().toISOString();
    const url = req.url;
    
    fs.appendFileSync('requests.log', '[' + timestamp + '] IP: ' + ip + ' | URL: ' + url + '\n');
    
    res.json({
        status: 'success',
        version: '2.3.1',
        message: 'Connected to JUNIOR SERVER'
    });
});

// ===== PORT =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log('Server running on port ' + PORT);
});

// ===== KEEP ALIVE =====
setInterval(function() {
    console.log('Server is alive - ' + new Date().toISOString());
}, 60000);
