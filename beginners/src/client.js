import axios from 'axios';
import { Transform, Writable } from 'node:stream';

const url = 'http://localhost:3333';

async function consume() {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  })

  return response.data;
}

const stream = await consume();
stream
  .pipe(new Transform({
    transform(chunk, encode, cb) {
      const item = JSON.parse(chunk);
      console.log(item);
      cb();
    },
  }))