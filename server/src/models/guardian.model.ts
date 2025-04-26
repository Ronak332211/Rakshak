import mongoose, { Document, Schema } from 'mongoose';

export interface IGuardian extends Document {
  name: string;
  relationship: string;
  phone: string;
  email: string;
  user: mongoose.Types.ObjectId;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

const guardianSchema = new Schema<IGuardian>(
  {
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: String }
  },
  { timestamps: true }
);

const Guardian = mongoose.model<IGuardian>('Guardian', guardianSchema);

export default Guardian; 