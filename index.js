'use strict';


var kraken = require('kraken-js'),
    app = require('express')(),
    session = require('express-session'),
    lusca = require('lusca'),
    options = require('./lib/spec')(),
    port = process.env.PORT || 3010;


app.use(kraken(options));

//this or other session management will be required
app.use(session({
    secret: 'tts-fbdev',
    resave: true,
    saveUninitialized: true
}));

app.use(lusca.xframe(false));
app.use(lusca.csrf(false));

app.use(lusca({
    csp: { /* ... */},
    p3p: 'ABCDEF',
    hsts: {maxAge: 31536000, includeSubDomains: true, preload: true},
    xssProtection: true
}));

app.listen(port, function (err) {
    console.log('[%s] Listening on http://localhost:%d', app.settings.env, port);
});
