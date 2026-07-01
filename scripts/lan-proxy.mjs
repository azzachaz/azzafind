import { createServer } from 'node:http';
import os from 'node:os';
import httpProxy from 'http-proxy';
import { Bonjour } from 'bonjour-service';

const TARGET_PORT = 4200;
const LISTEN_PORT = 80;
const HOSTNAME = 'azzafind.local';

function lanAddress() {
  for (const addresses of Object.values(os.networkInterfaces())) {
    for (const addr of addresses ?? []) {
      if (addr.family === 'IPv4' && !addr.internal) return addr.address;
    }
  }
  return '127.0.0.1';
}

const proxy = httpProxy.createProxyServer({ target: `http://127.0.0.1:${TARGET_PORT}`, ws: true });
proxy.on('error', (err, _req, res) => {
  console.error('Proxy error:', err.message);
  res?.writeHead?.(502, { 'Content-Type': 'text/plain' });
  res?.end?.(`Bad gateway - is "npm start" running on port ${TARGET_PORT}?`);
});

const server = createServer((req, res) => proxy.web(req, res));
server.on('upgrade', (req, socket, head) => proxy.ws(req, socket, head));

server.listen(LISTEN_PORT, '0.0.0.0', () => {
  const ip = lanAddress();
  console.log(`Reverse proxy: http://${HOSTNAME} and http://${ip} -> http://127.0.0.1:${TARGET_PORT}`);

  const bonjour = new Bonjour();
  bonjour.publish({ name: 'AzzaFind', type: 'http', host: HOSTNAME, port: LISTEN_PORT });
  console.log(`Broadcasting mDNS name "${HOSTNAME}" on the local network.`);

  process.on('SIGINT', () => {
    bonjour.unpublishAll(() => bonjour.destroy());
    process.exit(0);
  });
});
