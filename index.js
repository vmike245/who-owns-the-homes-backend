const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

const landlordDataMap = {
  2021: 'data-for-2021.json',
  2022: 'data-for-2022.json',
};

app.get('/landlords/:year', (req, res) => {
  const { year } = req.params;
  const { minimumProperties } = req.query;
  const fileData = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, `data/${landlordDataMap[year]}`),
      'utf-8'
    )
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

console.log(`Running on port ${PORT}`);
app.listen(PORT);
