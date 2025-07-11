const WebSocket = require('ws');
const http = require('http');

const wss = new WebSocket.Server({ noServer: true });
let clients = [];

wss.on('connection', function connection(ws) {
  console.log('📡 Cliente conectado!');
  clients.push(ws);

  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
    console.log('❌ Cliente desconectado');
  });
});

function notificarTodos(data) {
  clients.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  });
}

// Criar servidor HTTP que recebe POST do Django
const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/notificar') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        notificarTodos(data);
        res.writeHead(200);
        res.end('Notificado com sucesso');
      } catch (e) {
        res.writeHead(400);
        res.end('Erro ao processar JSON');
      }
    });
  }
});

// Integra o servidor HTTP com o WebSocket
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, ws => {
    wss.emit('connection', ws, request);
  });
});

server.listen(8080, () => {
  console.log('✅ WebSocket + HTTP rodando na porta 8080');
});