const { spawn } = require('child_process');
const server = spawn('node', ['server.js'], { cwd: 'C:\\Users\\balra\\Desktop\\KickStreet\\shoe-store\\Kick-Street-App\\backend' });
server.stdout.on('data', (data) => process.stdout.write(data));
server.stderr.on('data', (data) => process.stdout.write(data));
setTimeout(() => {
  const http = require('http');
  const body = JSON.stringify({ name: 'Test User', email: 'logintest@example.com', phone: '1234567890', password: 'testpass123' });
  const req = http.request({ hostname: 'localhost', port: 5000, path: '/api/auth/register', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => console.log('\nRESPONSE:', data));
  });
  req.on('error', (e) => console.log('REQ ERR:', e.message));
  req.write(body);
  req.end();
}, 2000);
