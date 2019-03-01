const express = require('express');
const cors = require('cors');
import { Database } from './sqlite.js';
import { User } from './user.js';

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

interface Date {
  day: number,
  month: number,
  year: number,
}

interface transData {
  id: number;
  value: number;
  date: Date;
  category: String;
  medium: mediumType;
}

function checkDataTypeMedium(string: any): string is mediumType {
  return (
    string === 'cash'
    || string === 'bank'
    || string === 'stock'
  )
}

//User Defined Type Guards
function checkDataTypeDate(date: any): date is Date {
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
}

const db = new Database();
const user = new User(db);

//convention: id = index
let testData: transData[] = [{id: 0, value: 6.97, date: {day: 9, month: 2, year: 2019}, category: 'testing', medium: 'cash'}]
function fillData(array: transData[]): transData[] {
  for(let i = 1; i < 20; i++) {
    const id = i;
    const value = Math.floor(Math.random()*1000)/100;
    const day = Math.floor(Math.random()*28)+1;
    const month = Math.floor(Math.random()*12)+1;
    const year = Math.floor(Math.random()*19)+2000;
    const date = {day: day, month: month, year: year};
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
    array.push({id: id, value: value, date: date, category: category, medium: medium});
    //db.insert(value, `${date.year}-${date.month}-${date.year}`, category, medium);
  }
  return array;
}
fillData(testData);

//db.selectAll();

const dataRouter = express.Router();
const loginRouter = express.Router();

app.use('/data', dataRouter);
app.use('/login', loginRouter);


app.get('/login', (req, res, next) => {
  res.send("Hello Login!");
})
app.post('/login', (req, res, next) => {
  console.log(req.body);
  const name = req.body.name;
  const password = req.body.password;
  console.log(name, password);
  user.login(name, password)
  .then(success => {
    if (success) {
      console.log("test")
      res.sendStatus(200)
    }
    else res.sendStatus(400)
  })
  .catch((error) => {
    console.error(error);
    res.send(500);
  })
})

app.post('/register', (req, res, _next) => {
  console.log(req.body);
  const name = req.body.name;
  const password = req.body.password;
  console.log(name, password);
  user.create(name, password)
      .then((success) => {
        if (success) res.sendStatus(200);
        else {}
      })
      .catch((error) => {console.error(error); res.sendStatus(500)})
})

dataRouter.get('/', (_req, res, _next) => {
  res.send(testData);
})

app.get('/data/:id', (req, res, _next) => {
  if (testData[req.params.id]) {
    res.send(testData[req.params.id])
  }
  else {
    res.status(404).send();
  }
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

app.listen(PORT, () => {
  console.log(`Server is listening to port ${PORT}`);
})
