import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface ILocation {
  latitude: number;
  longitude: number;
  timestamp: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'user' | 'police' | 'admin';
  address?: string;
  emergencyContact?: string;
  profilePicture?: string;
  division?: mongoose.Types.ObjectId;
  currentLocation?: ILocation;
  guardians?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (password: string) => Promise<boolean>;
}

const locationSchema = new Schema<ILocation>({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['user', 'police', 'admin'], 
      default: 'user', 
      required: true 
    },
    address: { type: String },
    emergencyContact: { type: String },
    profilePicture: { type: String },
    division: { type: Schema.Types.ObjectId, ref: 'Division' },
    currentLocation: { type: locationSchema },
    guardians: [{ type: Schema.Types.ObjectId, ref: 'Guardian' }]
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Create Admin user if not exists
userSchema.statics.createDefaultAdmin = async function() {
  try {
    const adminExists = await this.findOne({ email: 'ronaknerhara1122@gmail.com' });
    
    if (!adminExists) {
      await this.create({
        name: 'Admin',
        email: 'ronaknerhara1122@gmail.com',
        password: 'admin@123',
        phone: '9999999999',
        role: 'admin'
      });
      console.log('Default admin user created');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

const User = mongoose.model<IUser>('User', userSchema);

// Create default admin on model initialization
User.createDefaultAdmin();

export default User; 