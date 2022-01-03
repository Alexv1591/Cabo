function requireHTTPS(req, res, next) {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}
const express = require('express');
const app = express();
app.use(requireHTTPS);


// const Colyseus = require("colyseus");
// const CaboRoom = require('./src/rooms/CaboRoom').CaboRoom;


// const gameServer = new Colyseus.Server({
//     server: http.createServer(app),
//     express: app
//   });
// gameServer.define('CaboRoom',CaboRoom);

app.use(express.static('./dist/client/cabo'));
app.use(express.static('./dist/server/my-app'));

app.get('/*', function(req, res) {
    res.sendFile('main.ts', {root: 'dist/client/cabo/'}
  );
});

app.listen(process.env.PORT || 8080);