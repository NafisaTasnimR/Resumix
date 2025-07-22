const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const authRouter = require('./routes/AuthRouter'); 
const infoUpdateRouter = require('./routes/InfoUpdateRouter');
const previewRouter = require('./routes/TemplateRouter');
require('dotenv').config();
require('./models/Database');


const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.use('/auth',authRouter);
app.use('/info', infoUpdateRouter);
app.use('/viewInformation', infoUpdateRouter);
app.use('/preview',previewRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});