import { createServer } from 'node:http';
import { Readable } from 'node:stream';
import { randomUUID } from 'node:crypto';

const PORT = 3333;

function* run() {
  for (let i = 0; i <= 99; i++) {
    const data = {
      id: randomUUID(),
      name: `Samuel-${i}`,
    };
    yield data;
  }
}

/**
 * @param request it is like the Readable stream
 * @param response it is like the Writable stream
 * We can use a Transform in the middle
 */
createServer(async (request, response) => {
  const readable = new Readable({ // String protocol
    read() {
      for (const data of run()) {
        console.log('sending...', data);
        this.push(JSON.stringify(data) + '\n');
      }

      this.push(null); // Data has ended
    },
  })

  readable
    .pipe(response)
})
  .listen(PORT)
  .on('listening', () => console.log(`server is listening at ${PORT}`))