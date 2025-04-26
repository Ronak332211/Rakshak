import mongoose, { Document, Schema } from 'mongoose';
import { ILocation } from './user.model';

export interface IComplaint extends Document {
  title: string;
  description: string;
  user: mongoose.Types.ObjectId;
  status: 'pending' | 'in-progress' | 'resolved' | 'dismissed';
  division?: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  location?: ILocation;
  attachments?: string[];
  statusUpdates: {
    status: string;
    message: string;
    updatedBy: mongoose.Types.ObjectId;
    timestamp: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const complaintSchema = new Schema<IComplaint>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
      type: String, 
      enum: ['pending', 'in-progress', 'resolved', 'dismissed'], 
      default: 'pending', 
      required: true 
    },
    division: { type: Schema.Types.ObjectId, ref: 'Division' },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
      timestamp: { type: Date, default: Date.now }
    },
    attachments: [{ type: String }],
    statusUpdates: [
      {
        status: { type: String, required: true },
        message: { type: String, required: true },
        updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        timestamp: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

const Complaint = mongoose.model<IComplaint>('Complaint', complaintSchema);

export default Complaint; 