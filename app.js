'use strict';
const fs = require('fs');
const Router = require('router');
const router = Router();
const fh = require('finalhandler');
const dotenv = require('dotenv'); // environment variable access instance
dotenv.config(); // loading env variables
const server = require('http').createServer(); // http server handler
const template = {
    '/': 'app.html'
}
server.on('request', function (request, response){
    router(request, response, fh(request, response))
});
// port
let port = process.env.PORT || 8000

server.listen(port);

console.log(port);
// Routing logic

router.get('/', (request, response) => {
    response.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(template['/']).pipe(response);
});
// manifest.json
router.get('/manifest.json', (request, response) => {
    response.writeHead(200, {'Content-Type': 'application/json'});
    fs.createReadStream('manifest.json').pipe(response);
});
// service-worker.js
router.get('/service-worker.js', (request, response) => {
    response.writeHead(200, {'Content-Type': 'text/javascript'});
    fs.createReadStream('service-worker.js').pipe(response);
});

// css
router.get(/css\/\w+\.css/, (request, response) => {
    fs.readdir('css', (error, files) => {
        if (error) return console.error(error);
        for (let i = 0; i < files.length; i++) {
            if (`/css/${files[i]}` === request.url) {
                response.writeHead(200, {'Content-type': 'text/css'});
                fs.createReadStream(request.url.slice(1,)).pipe(response);
                return true;
            }
        }
        response.writeHead(404);
        response.end();
    });
});
// js
router.get(/js\/[\w.-]+\.js/, (request, response) => {
    fs.readdir('js', (error, files) => {
        if (error) return console.error(error);
        for (let i = 0; i < files.length; i++) {
            if (`/js/${files[i]}` === request.url) {
                response.writeHead(200, {'Content-type': 'text/js'});
                fs.createReadStream(request.url.slice(1,)).pipe(response);
                return true;
            }
        }
        response.writeHead(404);
        response.end();
    });
});
// images
router.get(/img\/[\w\.\-]+/, (request, response) => {
    let dir = 'img';
    let url = request.url;
    fs.readdir(dir, (error, files) => {
        if (error) return console.error(error);
        let ext = url.slice(url.lastIndexOf('.') + 1, );
        for (let i = 0; i < files.length; i++) {
            if (`/${dir}/${files[i]}` === request.url) {
                if (ext === 'svg'){
                    response.writeHead(200, {'Content-type': 'image/svg+xml'});
                }
                else if (ext in ['jpg, jpeg']) {
                    response.writeHead(200, {'Content-type': 'image/jpeg'});
                }
                else if (ext === 'png') {
                    response.writeHead(200, {'Content-type': 'image/png'});
                }
                fs.createReadStream(url.slice(1,)).pipe(response);
                return true;
            }
        }
        response.writeHead(404);
        response.end();
    });
});
router.get(/sound\/.*/, (request, response) => {
    fs.readdir('sound', (error, files) => {
        if (error) return console.error(error);
        for (let i = 0; i < files.length; i++) {
            if (`/sound/${files[i]}` === request.url) {
                response.writeHead(200, {'Content-type': 'audio/mpeg'});
                fs.createReadStream(request.url.slice(1,)).pipe(response);
                return true;
            }
        }
        response.writeHead(404);
        response.end();
    });
});