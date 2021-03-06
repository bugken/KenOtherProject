const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8888 });

var map_ws_userid = new Map();
var ws_nums = 1;

ws_server.on("listening", function listen(){
	console.log("websocket server start listenning on port 8888.");
});

server.on('connection', function connection(ws, req) {
	const ip = req.connection.remoteAddress;
	const port = req.connection.remotePort;
	const clientName = ip + port;
	console.log('%s is connected', clientName)
	// 发送欢迎信息给客户端
	ws.send("Welcome " + clientName);
	//接收到消息
	ws.on('message', function incoming(message) {
		var json = {"id":1,"arg":{"userid":300}}
		console.log('received: %s from %s', message, clientName);
		//将userid ws加入map
		ws_nums = ws_nums + 1;
		map_ws_userid.set(ws_nums, ws);
		console.log('add map_ws_userid size %d ws_nums %d', map_ws_userid.size, ws_nums);
		// 广播消息给所有客户端
		server.clients.forEach(function each(client) {
			if (client.readyState === WebSocket.OPEN) {
				client.send( clientName + " -> " + message);
			}
		});
	});
	//客户端关闭调用
	ws.on('close', function close() {
		//将ws从map去掉
		for (var item of map_ws_userid.entries()) {
			if(item[1] == ws)
			{
				console.log("delete userid %d", item[0]);
				map_ws_userid.delete(item[0]);
				console.log('map_ws_userid size %d', map_ws_userid.size);
			}
		}
		console.log('close');
	});
});