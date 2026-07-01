import os from 'node:os';
import dns2 from 'dns2';

const { Packet } = dns2;
const HOSTNAME = 'azzafind';
const UPSTREAM = ['1.1.1.1', '8.8.8.8'];

function lanAddress() {
  for (const addresses of Object.values(os.networkInterfaces())) {
    for (const addr of addresses ?? []) {
      if (addr.family === 'IPv4' && !addr.internal) return addr.address;
    }
  }
  return '127.0.0.1';
}

const LAN_IP = lanAddress();
const upstream = new dns2({ nameServers: UPSTREAM });

const server = dns2.createServer({
  udp: true,
  handle: async (request, send) => {
    const response = Packet.createResponseFromRequest(request);
    const [question] = request.questions;
    const name = question.name;

    if (name.toLowerCase() === HOSTNAME) {
      response.answers.push({
        name,
        type: Packet.TYPE.A,
        class: Packet.CLASS.IN,
        ttl: 300,
        address: LAN_IP,
      });
      return send(response);
    }

    try {
      const type = question.type === Packet.TYPE.AAAA ? 'AAAA' : 'A';
      const result = await upstream.resolve(name, type);
      response.answers = result.answers;
      send(response);
    } catch {
      response.header.rcode = Packet.RCODE.SERVFAIL;
      send(response);
    }
  },
});

server.on('requestError', (error) => console.error('Request error:', error));

server.listen({ udp: { port: 53, address: '0.0.0.0' } });

server.on('listening', () => {
  console.log(`DNS server up. "${HOSTNAME}" -> ${LAN_IP}, everything else forwarded to ${UPSTREAM.join(', ')}`);
  console.log(`Set this PC's IP (${LAN_IP}) as the DNS server on devices that should resolve http://${HOSTNAME}`);
});
