import express from 'express';
import cors from 'cors';
import { json, urlencoded } from 'express';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import appointmentRoutes from './routes/appointments';
import procedureCategoryRoutes from './routes/procedureCategories';
import procedureTypeRoutes from './routes/procedureTypes';
import procedureRecordRoutes from './routes/procedureRecords';
import patientHistoryRoutes from './routes/patientHistory';
import notificationRoutes from './routes/notifications';
import uploadRoutes from './routes/uploads';
import mobileRoutes from './routes/mobile';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/procedure-categories', procedureCategoryRoutes);
app.use('/api/procedure-types', procedureTypeRoutes);
app.use('/api/procedure-records', procedureRecordRoutes);
app.use('/api/patient-history', patientHistoryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/mobile', mobileRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; 