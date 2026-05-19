const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const tasksRouter = require('./routes/tasks');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Mongo connection error', err);
});

app.use('/tasks', tasksRouter);

app.get('/', (req, res) => res.send({ ok: true, service: 'TaskHub Backend' }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
