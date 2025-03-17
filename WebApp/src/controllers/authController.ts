import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import admin from '../config/firebase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, fullName, phoneNumber, role = 'visitor' } = req.body;

    // Check if user already exists
    const userRecord = await admin.auth().getUserByEmail(email).catch(() => null);
    if (userRecord) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user in Firebase Auth
    const createdUser = await admin.auth().createUser({
      email,
      password,
      displayName: fullName,
      phoneNumber,
    });

    // Set custom claims for role
    await admin.auth().setCustomUserClaims(createdUser.uid, { role });

    // Create user document in Firestore
    await admin.firestore().collection('users').doc(createdUser.uid).set({
      email,
      fullName,
      phoneNumber,
      role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Generate JWT token
    const token = jwt.sign(
      { uid: createdUser.uid, role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        uid: createdUser.uid,
        email: createdUser.email,
        fullName,
        role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Sign in with Firebase Auth
    const userCredential = await admin.auth().getUserByEmail(email);
    
    // Get user data from Firestore
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(userCredential.uid)
      .get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = userDoc.data();
    const customClaims = (await admin.auth().getUser(userCredential.uid)).customClaims;

    // Generate JWT token
    const token = jwt.sign(
      { 
        uid: userCredential.uid,
        role: customClaims?.role || userData?.role 
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        uid: userCredential.uid,
        email: userCredential.email,
        fullName: userData?.fullName,
        role: customClaims?.role || userData?.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    // Send password reset email
    await admin.auth().generatePasswordResetLink(email);

    res.json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(400).json({ message: 'Error sending password reset email' });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token } = req.body;

    // Verify email
    await admin.auth().verifyIdToken(token);

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(400).json({ message: 'Error verifying email' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as any;
    
    // Get user data
    const userRecord = await admin.auth().getUser(decoded.uid);
    const customClaims = userRecord.customClaims;

    // Generate new access token
    const newToken = jwt.sign(
      { 
        uid: userRecord.uid,
        role: customClaims?.role 
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.json({
      token: newToken
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
}; 