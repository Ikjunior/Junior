const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// ===== RESPOND TO ALL PATHS =====
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log('Server running on port ' + PORT);
});
