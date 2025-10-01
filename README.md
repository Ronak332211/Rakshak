# Rakshak-Women Safety

A comprehensive platform for women's safety that allows users to file complaints, track status, manage emergency contacts, send SOS alerts, and share location with authorities.

## Project Structure

This project consists of two main parts..

1. **Frontend**: A React application built with TypeScript, TailwindCSS, and Shadcn UI
2. **Backend**: A Node.js API server with Express, MongoDB, and JWT authentication

## Features

- User authentication (login, register, profile management)
- Complaint filing and tracking with real-time status updates
- Guardian management for emergency contacts
- Live location tracking
- Emergency SOS alerts with location sharing
- Three user roles: User, Police, and Admin
- Admin panel for user, police, and division management
- Division-based police assignment for efficient complaint handling

## Running the Application

### Prerequisites

- Node.js (v14+)
- MongoDB (v4+)
- npm or yarn

### Setup and Installation

#### Backend Server

1. Navigate to the server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rakshak-women-safety
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-email-password
CLIENT_URL=http://localhost:3000
```

4. Start the backend server:

```bash
npm run dev
# or
yarn dev
```

The backend server will run on http://localhost:5000.

#### Frontend Application

1. From the project root, install dependencies:

```bash
npm install
# or
yarn install
```

2. Create a `.env` file in the root with:

```
VITE_API_URL=http://localhost:5000/api
```

3. Start the frontend development server:

```bash
npm run dev
# or
yarn dev
```

The application will run on http://localhost:3000.

## Connecting Frontend to Backend

To connect the frontend to the backend, you need to update the `src/supabaseClient.ts` file to use the new backend API instead of Supabase. Replace the file with an API client like:

```typescript
// src/api/apiClient.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('wsms_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
```

Then update the AuthContext to use the new API:

```typescript
// src/contexts/AuthContext.tsx update the login and register functions

const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
  try {
    const response = await apiClient.post('/auth/login', { email, password, role });
    const { user, token } = response.data;
    
    setUser(user);
    setRole(user.role);
    setIsAuthenticated(true);
    localStorage.setItem('wsms_user', JSON.stringify(user));
    localStorage.setItem('wsms_token', token);
    return true;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
};

const register = async (name: string, email: string, password: string): Promise<boolean> => {
  try {
    const response = await apiClient.post('/auth/register', { name, email, password });
    const { user, token } = response.data;
    
    setUser(user);
    setRole(user.role);
    setIsAuthenticated(true);
    localStorage.setItem('wsms_user', JSON.stringify(user));
    localStorage.setItem('wsms_token', token);
    return true;
  } catch (error) {
    console.error("Registration error:", error);
    return false;
  }
};
```

## Default Accounts

The system automatically creates a default admin account:

- **Admin**
  - Email: ronaknerhara1122@gmail.com
  - Password: admin@123

## License

This project is licensed under the MIT License.
