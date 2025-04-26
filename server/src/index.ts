import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import complaintRoutes from './routes/complaint.routes';
import guardianRoutes from './routes/guardian.routes';
import policeRoutes from './routes/police.routes';
import adminRoutes from './routes/admin.routes';
import divisionRoutes from './routes/division.routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rakshak-women-safety';

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/guardians', guardianRoutes);
app.use('/api/police', policeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/divisions', divisionRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Rakshak-Women Safety API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 