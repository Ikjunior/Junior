const express = require('express');
const fs = require('fs');
const app = express();

// ===== MIDDLEWARE =====
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// ===== SPECIFIC ROUTES =====
app.get('/ping', (req, res) => {
    res.send('pong');
});

app.get('/logs', (req, res) => {
    if (fs.existsSync('requests.log')) {
        const logs = fs.readFileSync('requests.log', 'utf8');
        res.send('<pre>' + logs + '</pre>');
    } else {
        res.send('No logs.');
    }
});

// ===== VER.PHP (What Free Fire actually wants) =====
app.get('/ver.php', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const timestamp = new Date().toISOString();
    const query = req.query;
    
    fs.appendFileSync('requests.log', '[' + timestamp + '] IP: ' + ip + ' | ver.php called with: ' + JSON.stringify(query) + '\n');
    
    // This is what Free Fire expects to see
    res.json({
        version: '1.123.18',
        release_version: 'OB53',
        whitelist_version: '1.6.0',
        whitelist_sp_version: '1.0.0',
        force_update: false,
        update_url: 'https://play.google.com/store/apps/details?id=com.dts.freefireth',
        message: 'Connected to JUNIOR SERVER'
    });
});

// ===== CATCH-ALL ROUTE =====
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
