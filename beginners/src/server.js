import { createServer } from 'node:http';

const PORT = 3333;

createServer(async (request, response) => {

})
  .listen(PORT)
  .on('listening', () => console.log(`server is listening at ${PORT}`))