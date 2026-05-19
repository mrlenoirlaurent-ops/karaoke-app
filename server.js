const express = require('express');

const app = express();

app.use(express.static('public'));

app.listen(3000, 'localhost', () => {
  console.log('Karaoké lancé sur http://localhost:3000');
});
