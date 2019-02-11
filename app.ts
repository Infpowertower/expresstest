import * as express from 'express';
import * as cors from 'cors';

const app = express();
app.use(express.json());

const PORT = 8001;

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions));

//Custom types/interfaces
type mediumType = 'cash' | 'bank' | 'stock';

function checkDataTypeMedium(string: any): string is mediumType {
  return (
    string === 'cash'
    || string === 'bank'
    || string === 'stock'
  )
}

//User Defined Type Guards
/*function checkDataTypeDate(date: any): date is Date {
  //toDo check up on additional keys
  //toDo check realistic dates
  return (
    typeof date.day === 'number'
    && typeof date.month === 'number'
    && typeof date.year === 'number'
  )
}

function checkDataTypeTransData(object: any): object is transData {
  //toDo check up on additional keys
  return (
    checkDataTypeDate(object.date)
    && typeof object.value === 'number'
    && typeof object.category === 'string'
    && checkDataTypeMedium(object.medium)
  );
}*/

//convention: id = index
let testData = {columns: [{id: 'number'}, {value: 'number'}, {date: 'date'}, {category: 'string'}, {medium: 'string'}], data: [[0,6.97,{day: 9, month: 2, year: 2019},'testing','cash']]};

function fillData() {
  for(let i = 1; i < 20; i++) {
    const id = i;
    const value = Math.floor(Math.random()*1000)/100;
    const day = Math.floor(Math.random()*28)+1;
    const month = Math.floor(Math.random()*12)+1;
    const year = Math.floor(Math.random()*19)+2000;
    const date = [day, month, year];
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
    testData.data.push([id, value, date, category, medium]);
  }
}
fillData();

app.get('/data/:id', (req, res, _next) => {
  if (testData[req.params.id]) {
    res.send(testData[req.params.id])
  }
  else {
    res.status(404).send();
  }
})

const dataRouter = express.Router();

app.use('/data', dataRouter);

dataRouter.get('/', (_req, res, _next) => {
  res.send(testData);
})

dataRouter.put('/:id', (req, res, _next) => {
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



dataRouter.post('/', (req, res, _next) => {
  const id = testData.length;
  let result = req.body;
  result.id = id;
  if (checkDataTypeTransData(result)) {
    testData.push(result);
    res.status(201).send(id.toString()); //toString because of bug in express
  }
  else {
    res.status(400).send();
  }
})

dataRouter.delete('/:id', (req, res, _next) => {
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
