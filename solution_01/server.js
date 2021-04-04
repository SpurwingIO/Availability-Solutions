const fs = require('fs');
const express = require('express');
const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.use('/', express.static('./public'))

const router = express.Router({
    caseSensitive: app.get('case sensitive routing'),
    strict       : app.get('strict routing')
});
app.use(router);

// temporary JSON-file as database
let STATE;
if (!fs.existsSync('data.json')) {
  fs.appendFileSync('data.json', '{}');
  STATE = {}
} else {
  STATE = JSON.parse(fs.readFileSync('data.json'));
}

function save() {
  fs.writeFileSync('data.json', JSON.stringify(STATE, null, 2));
}

// routes
router.post('/api/meeting/', (req, res) => {
  let ID = new Date().getTime();
  STATE[ID] = {
    dates: req.body.dates,
    answers: [],
  }
  save();
  res.send({success:1, ID: ID})
});

router.get('/api/meeting/:ID', (req, res) => {
  res.send({success:1, dates:STATE[req.params.ID].dates})
});

router.post('/api/meeting/:ID', (req, res) => {
  // we can use email to allow user to update his answer
  let item = STATE[req.params.ID].answers.find(x => x.email === req.body.email);
  if (item) {
    item.selection = req.body.selection;
  } else {
    STATE[req.params.ID].answers.push(req.body);
  }
  save();
  res.send({success:1})
});


router.get('/api/meeting/results/:ID', (req, res) => {
  res.send({success:1, data:STATE[req.params.ID]})
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))