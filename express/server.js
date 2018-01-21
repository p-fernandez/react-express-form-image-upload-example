const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const multiparty = require('multiparty');

const app = express();
const port = 4400;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const origin = req.headers.origin || 'localhost:3000';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
  next();
});

app.get('/', (req, res) => {
  res.send('This is the Express server.');
});

app.post('/api/images', function(req, res, next) {
  const form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
    if (err) {
      return next(err);
    }
    // console.log(fields);
    // console.log(files);
    try {
      const imgPath = files.imageSrc[0].path;
      const img = fs.readFileSync(imgPath);
      res.writeHead(200, { 'Content-Type': files.imageSrc[0].headers['content-type'] });
      res.end(img, 'binary');
    } catch(Error) {
      res.status(400).send('Error when creating image');
    }
  });
  return;
});

const server = app.listen(port, () => {
  console.log(`Server started in port ${port}`);
});

