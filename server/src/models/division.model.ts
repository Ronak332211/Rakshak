import mongoose, { Document, Schema } from 'mongoose';

export interface IDivision extends Document {
  name: string;
  area: string;
  city: string;
  state: string;
  policeOfficers: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    policeOfficers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

const Division = mongoose.model<IDivision>('Division', divisionSchema);

export default Division; 