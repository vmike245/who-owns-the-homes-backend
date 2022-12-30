const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 4000;

app.use((_, res, next) => {
  // This should be more restrictive, hopefully it doesn't come back to bite me
  res.setHeader('Access-Control-Allow-Origin', '*');
  return next();
});

app.get('/landlords/:year', (req, res) => {
  const { year } = req.params;
  const { minimumProperties } = req.query;
  const fileData = JSON.parse(
    fs.readFileSync(path.join(__dirname, `data/${year}/data.json`), 'utf-8')
  );
  const propertiesToReturn = !minimumProperties
    ? fileData
    : fileData.filter(
        ({ allOwnedProperties: { propertyCount } }) =>
          propertyCount >= parseInt(minimumProperties, 10)
      );
  res
    .status(200)
    .set('Content-Type', 'application/json')
    .send(propertiesToReturn);
});

app.get('/landlords/:year/breakdown', (req, res) => {
  const { year } = req.params;
  const fileData = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, `data/${year}/breakdown.json`),
      'utf-8'
    )
  );

  res.status(200).set('Content-Type', 'application/json').send(fileData);
});

console.log(`Running on port ${PORT}`);
app.listen(PORT);
