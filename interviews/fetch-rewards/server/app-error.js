const compression = require('compression');
const express = require('express');
const helmet = require('helmet');
const path = require('path');

const app = express();
const port = 3334;

app.use(compression({
  filter: shouldCompress
}));
app.use(helmet.xssFilter());

app.use('/', express.static(path.join(__dirname, '../client')));

app.get('/api/v1/hiring-list', function (req, res, next) {
  res
    .status(500)
    .send({
      code: 1,
      msg: 'Error occurred'
    });
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}.`);
});

function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}
