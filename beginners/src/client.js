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
      let name = item.name
      const myNumber = /\d+/.exec(name)[0];

      if (myNumber % 2 === 0) name = name.concat(' é par');
      else name = name.concat(' é ímpar');
      item.name = name;

      cb(null, JSON.stringify(item));
    },
  }))
  .pipe(new Writable({
    write(chunk, encode, cb) {
      console.log(chunk.toString())
      cb();
    },
  }))