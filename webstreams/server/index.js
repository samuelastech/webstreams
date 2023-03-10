import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { Readable, Transform } from 'node:stream';
import { WritableStream, TransformStream } from 'node:stream/web';
import { setTimeout } from 'node:timers/promises';
import csvtojson from 'csvtojson';

const PORT = 3000;

createServer(async (request, response) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
  };

  if (request.method === 'OPTIONS') {
    response.writeHead(204, headers);
    response.end();
    return;
  }

  let items = 0;

  request.once('close', () => {
    /**
     * The connections is only being closed on the client.
     * Here, in the server, the items will be processed and stored -- back
     * pressuring concept.
     * 
     * To close the connection here we need to user AbortController as well and
     * pass it to our pipeline, so nothing else will be processed and stored.
     */
    console.log('connection was closed\nitems processed: ', items)
  })

  Readable.toWeb(createReadStream('./animeflv.csv'))
    .pipeThrough(Transform.toWeb(csvtojson()))
    .pipeThrough(new TransformStream({
      transform(chunk, controller) {
        const data = JSON.parse(Buffer.from(chunk));
        const mappedData = JSON.stringify({
          title: data.title,
          description: data.description,
          url_anime: data.url_anime,
        }).concat('\n');

        controller.enqueue(mappedData);
      }
    }))
    .pipeTo(new WritableStream({
      async write(chunk) {
        await setTimeout(1000);
        items++;
        response.write(chunk)
      },
      close() {
        response.end()
      }
    }));

  response.writeHead(200, headers);
})
  .listen(PORT)
  .on('listening', () => console.log(`server is running at ${PORT}`))