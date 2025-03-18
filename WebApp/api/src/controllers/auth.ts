import { Request, Response, NextFunction } from 'express';
import { auth, firestore } from '../config/firebase';
import jwt, { SignOptions } from 'jsonwebtoken';
import { createError, ERROR_CODES } from '../middleware/errorHandler';
import { 
  RegisterRequest, 
  LoginRequest, 
  ResetPasswordRequest, 
  VerifyEmailRequest, 
  RefreshTokenRequest,
  User
} from '../types';

// Helper function to parse env expiry time to number (seconds)
const parseExpiryTime = (envVar: string | undefined, defaultSeconds: number): number => {
  if (!envVar) return defaultSeconds;
  
  // If it's a number string, parse it
  if (/^\d+$/.test(envVar)) {
    return parseInt(envVar, 10);
  }
  
  // Return default as fallback
  return defaultSeconds;
};

// Register a new user
export const register = async (
  req: Request<{}, {}, RegisterRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, fullName, phoneNumber, role, birthDate, gender } = req.body;

    // Check if email is already in use
    try {
      const userRecord = await auth.getUserByEmail(email);
      if (userRecord) {
        return res.status(400).json({
          error: 'Email already exists'
        });
      }
    } catch (error: any) {
      // Continue if error is user-not-found
      if (error.code !== 'auth/user-not-found') {
        return res.status(500).json({
          error: 'Internal server error'
        });
      }
    }

    // Create user in Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: fullName,
      emailVerified: false
    });

    // Create user document in Firestore
    const timestamp = new Date();
    
    const userData: Omit<User, 'uid'> & { uid: string } = {
      uid: userRecord.uid,
      email,
      fullName,
      phoneNumber,
      role,
      createdAt: timestamp as any, // Timestamp will be converted by Firestore
      updatedAt: timestamp as any,
    };

    // Add optional fields if provided
    if (birthDate) {
      userData.birthDate = new Date(birthDate) as any;
    }

    if (gender) {
      userData.gender = gender;
    }

    // Save user in Firestore
    await firestore.collection('users').doc(userRecord.uid).set(userData);

    // Generate tokens
    const secret = process.env.JWT_SECRET || 'default_secret';
    const tokenExpiry = parseExpiryTime(process.env.TOKEN_EXPIRY, 3600); // 1 hour in seconds
    const options: SignOptions = { expiresIn: tokenExpiry };
    
    const accessToken = jwt.sign(
      { uid: userRecord.uid },
      secret,
      options
    );

    const refreshSecret = process.env.JWT_REFRESH_SECRET || 'default_refresh_secret';
    const refreshExpiry = parseExpiryTime(process.env.REFRESH_TOKEN_EXPIRY, 604800); // 7 days in seconds
    const refreshOptions: SignOptions = { expiresIn: refreshExpiry };
    
    const refreshToken = jwt.sign(
      { uid: userRecord.uid },
      refreshSecret,
      refreshOptions
    );

    // Send verification email - to be implemented

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        uid: userRecord.uid,
        email,
        fullName,
        role
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Login user
export const login = async (
  req: Request<{}, {}, LoginRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Sign in with Firebase Authentication
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
      // Note: In a real implementation, you would verify the password here
    } catch (error) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Get user data from Firestore
    const userDoc = await firestore.collection('users').doc(userRecord.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        error: 'User record not found'
      });
    }
    
    const userData = userDoc.data() as User;

    // Generate tokens
    const secret = process.env.JWT_SECRET || 'default_secret';
    const tokenExpiry = parseExpiryTime(process.env.TOKEN_EXPIRY, 3600); // 1 hour in seconds
    const options: SignOptions = { expiresIn: tokenExpiry };
    
    const accessToken = jwt.sign(
      { uid: userRecord.uid },
      secret,
      options
    );

    const refreshSecret = process.env.JWT_REFRESH_SECRET || 'default_refresh_secret';
    const refreshExpiry = parseExpiryTime(process.env.REFRESH_TOKEN_EXPIRY, 604800); // 7 days in seconds
    const refreshOptions: SignOptions = { expiresIn: refreshExpiry };
    
    const refreshToken = jwt.sign(
      { uid: userRecord.uid },
      refreshSecret,
      refreshOptions
    );

    return res.status(200).json({
      message: 'Login successful',
      user: {
        uid: userRecord.uid,
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role
      },
      token: accessToken,
      refreshToken
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Request password reset
export const resetPassword = async (
  req: Request<{}, {}, ResetPasswordRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    // Check if user exists
    try {
      await auth.getUserByEmail(email);
    } catch (error) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({
        message: 'Password reset email sent'
      });
    }

    // Generate password reset link
    const resetLink = await auth.generatePasswordResetLink(email);

    // Send email with reset link - to be implemented

    return res.status(200).json({
      message: 'Password reset email sent'
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Verify email
export const verifyEmail = async (
  req: Request<{}, {}, VerifyEmailRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body;

    // In a real implementation, you would verify the token
    // For simplicity, we're just acknowledging the request
    res.json({
      message: 'Email verification successful'
    });
  } catch (error) {
    next(error);
  }
};

// Refresh token
export const refreshToken = async (
  req: Request<{}, {}, RefreshTokenRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      throw createError(
        'Refresh token required',
        401,
        ERROR_CODES.AUTHENTICATION.INVALID_TOKEN
      );
    }

    // Verify refresh token
    try {
      const refreshSecret = process.env.JWT_REFRESH_SECRET || 'default_refresh_secret';
      const decoded = jwt.verify(token, refreshSecret) as { uid: string };

      // Generate new access token
      const secret = process.env.JWT_SECRET || 'default_secret';
      const tokenExpiry = parseExpiryTime(process.env.TOKEN_EXPIRY, 3600); // 1 hour in seconds
      const options: SignOptions = { expiresIn: tokenExpiry };
      
      const accessToken = jwt.sign(
        { uid: decoded.uid },
        secret,
        options
      );

      res.json({
        accessToken
      });
    } catch (error) {
      throw createError(
        'Invalid or expired refresh token',
        401,
        ERROR_CODES.AUTHENTICATION.INVALID_TOKEN
      );
    }
  } catch (error) {
    next(error);
  }
}; 