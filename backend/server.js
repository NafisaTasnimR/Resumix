
require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const authRouter = require('./routes/AuthRouter'); 
const infoUpdateRouter = require('./routes/InfoUpdateRouter');
const previewRouter = require('./routes/TemplateRouter');
//const ResumeRouter = require('./routes/ResumeRouter');
const PaymentRouter = require('./routes/PaymentRouter');

require('./models/Database');


const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.use('/auth',authRouter);
app.use('/info', infoUpdateRouter);
app.use('/viewInformation', infoUpdateRouter);
app.use('/preview',previewRouter);
//app.use('/resume', ResumeRouter);
app.use('/api/payment', PaymentRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});