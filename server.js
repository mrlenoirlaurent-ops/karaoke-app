const express = require('express');

const app = express();

app.use(express.static('public'));

app.listen(3000, '192.168.41.120', () => {
  console.log('Karaoké lancé sur http://localhost:3000');
});