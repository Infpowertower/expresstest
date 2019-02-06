import * as express from 'express';

const app = express();

const PORT = 8001;

type mediumType = 'cash' | 'bank' | 'stock';

interface transData {
  id: number;
  value: number;
  category: String;
  medium: mediumType;
}
//convention: id = index
let testData: transData[] = [{id: 0, value: 6.97, category: 'testing', medium: 'cash'}]

function fillData(array: transData[]): transData[] {
  for(let i = 1; i < 20; i++) {
    const id = i;
    const value = Math.floor(Math.random()*1000)/100;
    const category = 'testing';
    const randomValue = Math.floor(Math.random()*3);
    let medium: mediumType;
    if (randomValue === 0) {
      medium = 'cash';
    }
    else if (randomValue === 1) {
      medium = 'bank';
    }
    else {
      medium = 'stock';
    }
    array.push({id: id, value: value, category: category, medium: medium});
  }
  return array;
}

fillData(testData);

app.get('/data/:id', (req, res, _next) => {
  if (testData[req.params.id]) {
    res.send(testData[req.params.id])
  }
  else {
    res.status(404).send();
  }
})

app.get('/data', (_req, res, _next) => {
  res.send(testData);
})

app.get('/:name', (req, res, _next) => {
  res.send(`Hello ${req.params.name}`);
})

app.get('/', (_req, res, _next) => {
  res.send("Hello world!");
})

app.listen(PORT, () => {
  console.log(`Server is listening to port ${PORT}`);
})
