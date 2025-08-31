require('dotenv').config(); 
const express = require('express'); 
const app = express(); 
const bodyParser = require('body-parser'); 
const cors = require('cors'); 

// Import routes
const authRouter = require('./routes/AuthRouter');  
const infoUpdateRouter = require('./routes/InfoUpdateRouter'); 
const previewRouter = require('./routes/TemplateRouter'); 
const ResumeRouter = require('./routes/ResumeRouter'); 
const PaymentRouter = require('./routes/PaymentRouter'); 
const resumeRouter = require('./routes/ResumeRouter'); 
const downloadRouter = require('./routes/DownloadRouter'); 

// Import cron job service
const { initializeSubscriptionCron } = require('./services/subscriptionCron');

require('dotenv').config(); 
require('./models/Database');   

const PORT = process.env.PORT || 3000;  

app.use(bodyParser.json()); 
app.use(cors());  

// Routes
app.use('/auth', authRouter); 
app.use('/info', infoUpdateRouter); 
app.use('/viewInformation', infoUpdateRouter); 
app.use('/preview', previewRouter); 
app.use('/resume', ResumeRouter); 
app.use('/api/payment', PaymentRouter);  
app.use('/resume', resumeRouter); 
app.use('/download', downloadRouter);   

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

