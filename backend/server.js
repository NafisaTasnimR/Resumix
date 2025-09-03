require('dotenv').config();
require('./models/Database'); 
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const authRouter = require('./routes/AuthRouter'); 
const infoUpdateRouter = require('./routes/InfoUpdateRouter');
const previewRouter = require('./routes/TemplateRouter');
const resumeRouter = require('./routes/ResumeRouter');
const downloadRouter = require('./routes/DownloadRouter');
const shareRouter = require('./routes/ShareLinkRoute'); 
const PaymentRouter = require('./routes/PaymentRouter'); 
const { initializeSubscriptionCron } = require('./services/subscriptionCron');
const { formatDateMiddleware } = require('./middlewares/FormatDateMiddleware');
app.use(formatDateMiddleware); // Apply the date formatting middleware


require('./models/Database');


const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.use('/auth',authRouter);
app.use('/info', infoUpdateRouter);
app.use('/viewInformation', infoUpdateRouter);
app.use('/preview',previewRouter);
app.use('/resume', resumeRouter);
app.use('/api/payment', PaymentRouter);  
// server.js / app.js
app.use('/download', downloadRouter);
app.use('/', shareRouter);
 

app.use(bodyParser.json()); 
app.use(cors());  

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Initialize cron jobs after server setup
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Initialize subscription cron jobs
  initializeSubscriptionCron();
  
  console.log('Server setup complete');
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log(' SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log(' SIGINT received, shutting down gracefully...');
  process.exit(0);
});

