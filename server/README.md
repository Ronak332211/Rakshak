# Rakshak-Women Safety Backend

This is the backend server for the Rakshak-Women Safety application. It provides APIs for user authentication, complaint management, guardian management, police operations, and admin functions.

## Features

- User authentication (login, register, profile management)
- Complaint filing and tracking
- Emergency SOS alerts to guardians
- Guardian management
- Live location tracking
- Police assignment and complaint status updates
- Admin panel for user and division management

## Prerequisites

- Node.js (v14+)
- MongoDB (v4+)
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the server directory
3. Install dependencies:

```bash
npm install
# or
yarn install
```

4. Create a `.env` file with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rakshak-women-safety
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-email-password
CLIENT_URL=http://localhost:3000
```

## Running the Server

### Development Mode

```bash
npm run dev
# or
yarn dev
```

### Production Mode

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## API Endpoints

### Authentication

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### User

- GET `/api/users/profile` - Get user profile
- PUT `/api/users/profile` - Update user profile
- POST `/api/users/location` - Update user location
- POST `/api/users/sos` - Send SOS alert

### Guardians

- GET `/api/guardians` - Get all guardians for user
- POST `/api/guardians` - Add a new guardian
- PUT `/api/guardians/:guardianId` - Update a guardian
- DELETE `/api/guardians/:guardianId` - Delete a guardian

### Complaints

- GET `/api/complaints` - Get all complaints (filtered by role)
- GET `/api/complaints/:complaintId` - Get a specific complaint
- POST `/api/complaints` - File a new complaint
- PUT `/api/complaints/:complaintId/status` - Update complaint status
- PUT `/api/complaints/:complaintId/assign` - Assign complaint to police officer

### Police

- GET `/api/police/dashboard` - Get police dashboard stats
- GET `/api/police/complaints` - Get complaints assigned to police
- PUT `/api/police/complaints/:complaintId/status` - Update complaint status

### Admin

- GET `/api/admin/users` - Get all users
- GET `/api/admin/users/:userId` - Get user by ID
- POST `/api/admin/police` - Create police officer account
- PUT `/api/admin/users/:userId` - Update user
- DELETE `/api/admin/users/:userId` - Delete user
- GET `/api/admin/dashboard` - Get admin dashboard stats

### Divisions

- GET `/api/divisions` - Get all divisions
- GET `/api/divisions/:divisionId` - Get division by ID
- POST `/api/divisions` - Create new division
- PUT `/api/divisions/:divisionId` - Update division
- DELETE `/api/divisions/:divisionId` - Delete division
- POST `/api/divisions/:divisionId/officers` - Add police officer to division
- DELETE `/api/divisions/:divisionId/officers/:officerId` - Remove police officer from division

## Default Admin Account

The system automatically creates a default admin account with the following credentials:

- Email: ronaknerhara1122@gmail.com
- Password: admin@123

## License

This project is licensed under the MIT License. 