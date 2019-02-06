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

app.put('/data/:id', (req, res, _next) => {
  const id = req.params.id;
  if (testData[id]) {
    let query = req.query;
    console.log(query);
    //(<any>Object ist notwendig, da Typescript assign ansonsten nicht anerkennt)
    //https://stackoverflow.com/questions/38860161/using-typescript-and-object-assign-gives-me-an-error-property-assign-does-no
    let result = (<any>Object).assign(testData[id], query);
    console.log(result);
    testData[id] = result;
    res.status(201).send(req.params.id);
  }
  else {
    console.log(req.query);
    res.status(404).send();
  }
})

app.post('/data', (req, res, _next) => {
  const id = testData.length;
  let result = req.query;
  result.id = id;
  testData.push(result);
  res.status(201).send(id.toString()); //bug in express
})

app.delete('/data/:id', (req, res, _next) => {
  const id = req.params.id;
  if (testData[id]) {
    delete testData[id];
    res.status(204).send();
  }
  else {
    res.status(400).send();
  }
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
