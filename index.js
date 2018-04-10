const http = require('http');
const url = require('url');
const QRCode = require('qrcode');
const uuidv4 = require('uuid/v4');


const hostname = '192.168.1.9';
const port = 3002;

const server = http.createServer((req, res) => {
    let URL = url.parse(req.url);
    let UUID, pollMap = {};
    if (URL.pathname === '/') {
        res.statusCode = 200;
        UUID = uuidv4();
        console.log(UUID);
        QRCode.toDataURL(`http://${hostname}:${port}/login?uuid=${UUID}`, function (err, data) {
            res.setHeader('Content-Type', 'text/html');
            res.end(`
            <body><div style="text-align:center"><h1 id="tip" style="text-align:center;">Scan to login~</h1><img width=200 src="${data}"></img></div></body>
            <script>
            (function(){
                fetch('http://${hostname}:${port}/poll', response => {
                    document.querySelector('#tip').innerText='Welcome~';
                });
            })();
            </script>
            `);
        });
    } else if(URL.pathname === '/login') { 
        console.log(URL.query);
        pollMap[UUID].statusCode = 200;
        pollMap[UUID].setHeader('Content-Type', 'text/html');
        pollMap[UUID].end(`<body></body>`);
    } else if (URL.path ==='/poll') {
        console.log('polling...');
        pollMap[UUID] = res;
        res.setTimeout(30000, () =>{
            console.log('bye~');
            res.statusCode = 500;
            res.end("timeout");
        });
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});