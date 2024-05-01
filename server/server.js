import express from 'express';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import fsPromises from 'fs/promises';

const app = express();
const PORT = 8090;
const __dirname = dirname(fileURLToPath(import.meta.url));
const clientPath = join(__dirname, '..', '/client');
app.use(express.static(clientPath));
app.use(express.json());

app.listen(PORT, function () {
  console.log(`Your server is running on port: http://localhost:${PORT}`);
});
