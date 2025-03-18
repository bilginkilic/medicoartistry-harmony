import { Request, Response, NextFunction } from 'express';
import { firestore } from '../config/firebase';
import { createError, ERROR_CODES } from '../middleware/errorHandler';
import { 
  User, 
  UpdateUserRequest, 
  UpdateMedicalHistoryRequest
} from '../types';

// Get all users
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const usersSnapshot = await firestore.collection('users').get();
    
    const users = usersSnapshot.docs.map(doc => {
      const userData = doc.data();
      return {
        uid: userData.uid,
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role
      };
    });
    
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by ID
export const getUserById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    
    const userDoc = await firestore.collection('users').doc(id).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userData = userDoc.data();
    
    res.status(200).json({
      user: {
        uid: userData?.uid,
        email: userData?.email,
        fullName: userData?.fullName,
        role: userData?.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Update user
export const updateUser = async (
  req: Request<{ id: string }, {}, UpdateUserRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Check if user exists
    const userDoc = await firestore.collection('users').doc(id).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if user has permission to update
    // Only the user or admin can update user profile
    if (req.user?.uid !== id && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'You do not have permission to update this user' });
    }
    
    // Create the update object
    const dataToUpdate: Record<string, any> = {
      updatedAt: new Date()
    };
    
    // Add properties if they exist in the update data
    if (updateData.fullName) {
      dataToUpdate.fullName = updateData.fullName;
    }
    
    if (updateData.phoneNumber) {
      dataToUpdate.phoneNumber = updateData.phoneNumber;
    }
    
    if (updateData.address) {
      dataToUpdate.address = updateData.address;
    }
    
    if (updateData.birthDate) {
      // Convert birthDate to Firestore Timestamp
      dataToUpdate.birthDate = new Date(updateData.birthDate) as any;
    }
    
    if (updateData.gender) {
      dataToUpdate.gender = updateData.gender;
    }
    
    if (updateData.emergencyContact) {
      dataToUpdate.emergencyContact = updateData.emergencyContact;
    }
    
    // Admins can update email, regular users cannot
    if (updateData.email && req.user?.role === 'admin') {
      dataToUpdate.email = updateData.email;
    }
    
    // Update the user document
    await firestore.collection('users').doc(id).update(dataToUpdate);
    
    res.status(200).json({ message: 'User updated successfully', user: { ...userDoc.data(), ...dataToUpdate } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete user
export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const userDoc = await firestore.collection('users').doc(id).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Only admins can delete users
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'You do not have permission to delete users' });
    }
    
    // Delete the user document
    await firestore.collection('users').doc(id).delete();
    
    // Note: We would typically also delete user auth record
    // This would require admin SDK and additional code
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Get all doctors
export const getDoctors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doctorsSnapshot = await firestore
      .collection('users')
      .where('role', '==', 'doctor')
      .get();
    
    const doctors = doctorsSnapshot.docs.map(doc => {
      const doctorData = doc.data();
      return {
        uid: doctorData.uid,
        email: doctorData.email,
        fullName: doctorData.fullName,
        role: doctorData.role
      };
    });
    
    res.status(200).json({ doctors });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
};

// Update medical history
export const updateMedicalHistory = async (
  req: Request<{ id: string }, {}, UpdateMedicalHistoryRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { allergies, medications, conditions } = req.body;
    
    // Check if user exists
    const userDoc = await firestore.collection('users').doc(id).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has permission to update
    // Only the user, admin, or doctor can update medical history
    if (
      req.user?.uid !== id && 
      req.user?.role !== 'admin' && 
      req.user?.role !== 'doctor'
    ) {
      throw createError(
        'You do not have permission to update this medical history',
        403,
        ERROR_CODES.AUTHENTICATION.INSUFFICIENT_PERMISSIONS
      );
    }
    
    // Create the update object
    const dataToUpdate: Record<string, any> = {
      updatedAt: new Date()
    };
    
    // Initialize or update medicalHistory object
    dataToUpdate.medicalHistory = {};
    
    // Get current data if it exists
    const userData = userDoc.data();
    const currentMedicalHistory = userData?.medicalHistory || {};
    
    // Update only provided fields, keep existing data for others
    dataToUpdate.medicalHistory = {
      allergies: allergies || currentMedicalHistory.allergies || [],
      medications: medications || currentMedicalHistory.medications || [],
      conditions: conditions || currentMedicalHistory.conditions || []
    };
    
    // Update the user document
    await firestore.collection('users').doc(id).update(dataToUpdate);
    
    res.status(200).json({ message: 'Medical history updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Get documents by user ID
export const getDocumentsByUser = async (
  req: Request<{ userId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    
    // Check if user has permission to view documents
    if (
      req.user?.uid !== userId && 
      req.user?.role !== 'admin' && 
      req.user?.role !== 'doctor'
    ) {
      throw createError(
        'You do not have permission to view these documents',
        403,
        ERROR_CODES.AUTHENTICATION.INSUFFICIENT_PERMISSIONS
      );
    }
    
    const documentsSnapshot = await firestore
      .collection('documents')
      .where('userId', '==', userId)
      .get();
    
    const documents = documentsSnapshot.docs.map(doc => {
      const docData = doc.data();
      return {
        id: doc.id,
        title: docData.title,
        userId: docData.userId,
      };
    });
    
    res.status(200).json({ documents });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
};

// Get user medical history
export const getMedicalHistory = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const userDoc = await firestore.collection('users').doc(id).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has permission to view medical history
    if (
      req.user?.uid !== id && 
      req.user?.role !== 'admin' && 
      req.user?.role !== 'doctor'
    ) {
      throw createError(
        'You do not have permission to view this medical history',
        403,
        ERROR_CODES.AUTHENTICATION.INSUFFICIENT_PERMISSIONS
      );
    }
    
    const userData = userDoc.data();
    const medicalHistory = userData?.medicalHistory || {
      allergies: [],
      medications: [],
      conditions: []
    };
    
    res.status(200).json({
      medicalHistory,
      user: {
        uid: id,
        fullName: userData?.fullName,
        lastUpdated: userData?.updatedAt ? new Date(userData.updatedAt.toDate()) : null,
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user appointments
export const getUserAppointments = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const userDoc = await firestore.collection('users').doc(id).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has permission to view appointments
    if (
      req.user?.uid !== id && 
      req.user?.role !== 'admin' && 
      req.user?.role !== 'doctor'
    ) {
      throw createError(
        'You do not have permission to view these appointments',
        403,
        ERROR_CODES.AUTHENTICATION.INSUFFICIENT_PERMISSIONS
      );
    }
    
    const userData = userDoc.data();
    
    // Get appointments for the user
    const appointmentsSnapshot = await firestore
      .collection('appointments')
      .where('userId', '==', id)
      .get();
    
    const appointments = appointmentsSnapshot.docs.map(doc => {
      const appointmentData = doc.data();
      return {
        id: doc.id,
        doctorId: appointmentData.doctorId,
        date: appointmentData.date,
        status: appointmentData.status,
        reason: appointmentData.reason,
        notes: appointmentData.notes,
        lastUpdated: appointmentData.updatedAt ? new Date(appointmentData.updatedAt.toDate()) : null,
      };
    });
    
    res.status(200).json({
      appointments,
      user: {
        uid: id,
        fullName: userData?.fullName,
        lastUpdated: userData?.updatedAt ? new Date(userData.updatedAt.toDate()) : null,
      }
    });
  } catch (error) {
    next(error);
  }
};