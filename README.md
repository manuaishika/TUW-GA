# Facility Allocation System

A web-based system for managing and automating the allocation of college facilities (Auditorium, Seminar Hall, Conference Room) with a streamlined approval process.

## Features

- User authentication and role-based access control
- Facility booking requests
- Faculty advisor approval workflow
- Administrative approval workflow
- Real-time booking status tracking
- Facility availability calendar
- Email notifications for approvals and rejections

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/facility-allocation.git
   cd facility-allocation
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following content:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/facility-allocation
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. Start MongoDB:
   - Make sure MongoDB is installed and running
   - On Windows, you can start MongoDB through Services (services.msc)
   - On Linux/Mac, run: `sudo service mongod start`

## Running the Application

1. Start the backend server:
   ```bash
   npm run dev
   ```

2. In a new terminal, start the frontend server:
   ```bash
   cd frontend
   npm start
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## User Roles

1. Student
   - Can request facility bookings
   - Can view their booking history
   - Needs faculty approval for bookings

2. Faculty
   - Can approve/reject student booking requests
   - Can request facility bookings
   - Can view all bookings

3. Admin
   - Can approve/reject all booking requests
   - Can manage facilities
   - Can view all bookings and users

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user profile

### Bookings
- POST /api/bookings - Create a new booking request
- GET /api/bookings - Get all bookings
- GET /api/bookings/:id - Get booking by ID
- PUT /api/bookings/:id/approve - Approve booking (faculty/admin)
- PUT /api/bookings/:id/reject - Reject booking (faculty/admin)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 