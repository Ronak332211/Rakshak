import nodemailer from 'nodemailer';
import { IUser } from '../models/user.model';
import { IGuardian } from '../models/guardian.model';

// Environment variables should be properly set up
const EMAIL_USER = process.env.EMAIL_USER || 'your-email@gmail.com';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || 'your-email-password';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD
  }
});

// Function to send SOS email to guardians
export const sendSOSEmail = async (
  user: IUser, 
  guardians: IGuardian[], 
  location: { latitude: number; longitude: number }
) => {
  try {
    // Create Google Maps link
    const mapsLink = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    
    // Format the email
    const emailOptions = {
      from: EMAIL_USER,
      subject: `EMERGENCY ALERT: ${user.name} needs help!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 5px;">
          <div style="background-color: #ff4d4d; color: white; padding: 10px; text-align: center; border-radius: 5px 5px 0 0;">
            <h1 style="margin: 0;">EMERGENCY ALERT</h1>
          </div>
          <div style="padding: 20px;">
            <p><strong>${user.name}</strong> has triggered an emergency SOS alert and may need immediate help!</p>
            <p>Contact information:</p>
            <ul>
              <li>Phone: ${user.phone}</li>
              <li>Email: ${user.email}</li>
              ${user.address ? `<li>Address: ${user.address}</li>` : ''}
            </ul>
            <p><strong>Current Location:</strong></p>
            <p><a href="${mapsLink}" style="background-color: #4285f4; color: white; padding: 10px 15px; border-radius: 5px; text-decoration: none; display: inline-block;">View on Google Maps</a></p>
            <p style="color: #666; font-size: 14px;">This is an automated emergency alert sent from the Rakshak-Women Safety platform.</p>
          </div>
          <div style="background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 5px 5px;">
            <p>Rakshak-Women Safety | Safety is our priority</p>
            <p>If this is a life-threatening emergency, please contact emergency services immediately.</p>
          </div>
        </div>
      `
    };
    
    // Send email to each guardian
    for (const guardian of guardians) {
      await transporter.sendMail({
        ...emailOptions,
        to: guardian.email
      });
      
      console.log(`SOS email sent to ${guardian.name} (${guardian.email})`);
    }
    
    return { success: true, message: 'SOS emails sent to all guardians' };
  } catch (error) {
    console.error('Error sending SOS emails:', error);
    return { success: false, message: 'Failed to send SOS emails' };
  }
};

// Function to send notification about complaint status update
export const sendStatusUpdateEmail = async (
  user: IUser,
  complaintTitle: string,
  newStatus: string,
  message: string
) => {
  try {
    const emailOptions = {
      from: EMAIL_USER,
      to: user.email,
      subject: `Complaint Status Update: ${complaintTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 5px;">
          <div style="background-color: #4285f4; color: white; padding: 10px; text-align: center; border-radius: 5px 5px 0 0;">
            <h1 style="margin: 0;">Complaint Status Update</h1>
          </div>
          <div style="padding: 20px;">
            <p>Dear ${user.name},</p>
            <p>Your complaint <strong>"${complaintTitle}"</strong> has been updated.</p>
            <p><strong>New Status:</strong> ${newStatus}</p>
            <p><strong>Message:</strong> ${message}</p>
            <p><a href="${CLIENT_URL}/complaints" style="background-color: #4285f4; color: white; padding: 10px 15px; border-radius: 5px; text-decoration: none; display: inline-block;">View Complaint Details</a></p>
            <p style="color: #666; font-size: 14px;">Thank you for using Rakshak-Women Safety platform.</p>
          </div>
          <div style="background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 5px 5px;">
            <p>Rakshak-Women Safety | Safety is our priority</p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(emailOptions);
    
    return { success: true, message: 'Status update email sent' };
  } catch (error) {
    console.error('Error sending status update email:', error);
    return { success: false, message: 'Failed to send status update email' };
  }
}; 