const http = require('http');
const url = require('url');
const QRCode = require('qrcode');
const uuidv4 = require('uuid/v4');


const hostname = '192.168.1.9';
const port = 3002;

let UUID, pollMap = {};
const server = http.createServer((req, res) => {
    let URL = url.parse(req.url);
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
                fetch('http://${hostname}:${port}/poll').then(response => {
                    document.querySelector('#tip').innerText='Welcome~';
                    document.querySelector('#tip~img').style.display='none';
                });
            })();
            </script>
            `);
        });
    } else if(URL.pathname === '/login') { 
        console.log(URL.query);

        pollMap[UUID].statusCode = 200;
        pollMap[UUID].end();
        delete pollMap[UUID];
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(`<h1>logined</h1>`)
    } else if (URL.path ==='/poll') {
        console.log('polling...');
        pollMap[UUID] = res;

        res.setTimeout(30000, () =>{
            console.log('timeout, bye~');
            res.statusCode = 500;
            res.end("timeout");
        });
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});