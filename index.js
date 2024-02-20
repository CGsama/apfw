var http = require('http');
var httpProxy = require('http-proxy');
var axios = require('axios');
var sharp = require('sharp');
var assert = require("assert");
var phash = require("sharp-phash");
var dist = require("sharp-phash/distance");
var fs = require('fs');
var process = require('process');


var exts = ["jpg","jpeg","gif","png","webp"];
var spams = [];

Promise.all(fs.readdirSync("sample").filter(x => exts.includes(x.split(".").slice(-1)[0].toLowerCase())).map(x => phash(fs.readFileSync(`./sample/${x}`)))).then(x => {
	spams = x;
});

function parseBody(message) {
  const body = []

  return new Promise((resolve, reject) => {
    message.on('data', c => body.push(c))
    message.on('end', () => resolve(body))
    message.on('error', err => reject(err))
  })
}

//export default function createServer(proxyCfg, port) {
function createServer(proxyCfg, port) {
  const proxyServer = httpProxy.createProxyServer(proxyCfg)
    .on('proxyReq', onProxyReq)

  function onProxyReq(proxyReq, req, res) {
    if (req.body && req.body.length) {
      proxyReq.write(new Buffer(req.body[0]))
      proxyReq.end()
    }
  }
  http.createServer(async (req, res) => {
    req.body = await parseBody(req);
	//console.log(req.url);
	//console.log(req.body.toString());
	let block = false;
	if(req.url = "/inbox"){
		try{
			block = await handleBody(req.body);
		}catch(e){
			console.log(e);
		}
	}
    if (!res.headersSent && !block) {
      proxyServer.web(req, res)
    }
  }).listen(port)
}

async function handleBody(body){
	let obj = JSON.parse(body);
	
	let files = obj.object.attachment;
	if(files.length > 0){
		for(let i = 0; i < files.length; i++) {
			if(!files[i].mediaType.toLowerCase().startsWith("image")){
				continue;
			}
			let url = files[i].url;
			let input = (await axios({ url: url, responseType: "arraybuffer" })).data;
			let hash = await phash(await sharp(input).png().toBuffer());
			for(let i = 0; i < spams.length; i++) {
				if(dist(hash, spams[i]) < 5){
					console.log(`block ${url}`);
					fs.writeFile(`./blocked/${process.hrtime.bigint()}`, JSON.stringify(obj, null, 2), ()=>{});
					return true;
				}
			}
		}
	}
	return false;
}


if (!fs.existsSync('./blocked')){
    fs.mkdirSync('./blocked', { recursive: true });
}

createServer({
	target: process.argv[3] || 'http://localhost:3000',
	xfwd: true
}, process.argv[4] || 3001);

//dist(await phash(fs.readFileSync("./sample/60cb207248456845.webp")), await phash(fs.readFileSync("./sample/02b2f0736ee13993.jpg")))



