import { Timestamp } from 'firebase-admin/firestore';

export interface Notification {
  id: string;
  userId: string;
  type: 'appointment' | 'followup' | 'system' | 'message' | 'reminder';
  title: string;
  message: string;
  action?: {
    type: 'navigate' | 'link' | 'action';
    target: string;
    params?: Record<string, any>;
  };
  status: 'sent' | 'delivered' | 'read';
  scheduledFor: Timestamp;
  sentAt?: Timestamp;
  readAt?: Timestamp;
  createdAt: Timestamp;
}

export interface SendTestNotificationRequest {
  userId: string;
  title: string;
  message: string;
  type: 'appointment' | 'followup' | 'system' | 'message' | 'reminder';
}

export interface DeviceRegistration {
  userId: string;
  deviceToken: string;
  platform: 'ios' | 'android';
  model: string;
  appVersion: string;
  registeredAt: Timestamp;
  lastActive: Timestamp;
  notificationSettings: {
    appointments: boolean;
    followUps: boolean;
    marketing: boolean;
    silentHours?: {
      start: string;
      end: string;
    };
  };
}

export interface PushNotification {
  to: string[];
  notification: {
    title: string;
    body: string;
    imageUrl?: string;
  };
  data: {
    type: 'appointment' | 'followup' | 'marketing' | 'system';
    referenceId?: string;
    action?: string;
    custom?: Record<string, string>;
  };
  android: {
    priority: 'high' | 'normal';
    channelId: string;
  };
  apns: {
    headers: {
      'apns-priority': string;
    };
    payload: {
      aps: {
        sound: string;
        badge?: number;
      };
    };
  };
} 