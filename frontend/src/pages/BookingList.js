import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';

const BookingList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/bookings');
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  const handleApprove = async (bookingId, type) => {
    try {
      const endpoint = type === 'faculty' ? 'faculty-approve' : 'admin-approve';
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}/${endpoint}`);
      const updatedBookings = bookings.map(booking =>
        booking._id === bookingId
          ? { ...booking, status: 'approved' }
          : booking
      );
      setBookings(updatedBookings);
    } catch (error) {
      console.error('Error approving booking:', error);
    }
  };

  const handleReject = async (bookingId) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}/reject`);
      const updatedBookings = bookings.map(booking =>
        booking._id === bookingId
          ? { ...booking, status: 'rejected' }
          : booking
      );
      setBookings(updatedBookings);
    } catch (error) {
      console.error('Error rejecting booking:', error);
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setOpenDialog(true);
  };

  const getStatusChip = (status) => {
    const colorMap = {
      pending: 'warning',
      approved: 'success',
      rejected: 'error',
    };
    return (
      <Chip
        label={status}
        color={colorMap[status]}
        size="small"
      />
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5">Bookings</Typography>
            {user.role === 'student' && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/bookings/new')}
              >
                New Booking
              </Button>
            )}
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Facility</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Requester</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell>{booking.facility}</TableCell>
                    <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                    <TableCell>{`${booking.startTime} - ${booking.endTime}`}</TableCell>
                    <TableCell>{booking.requester.name}</TableCell>
                    <TableCell>{getStatusChip(booking.status)}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleViewDetails(booking)}>
                        <VisibilityIcon />
                      </IconButton>
                      {user.role === 'faculty' && booking.status === 'pending' && (
                        <>
                          <IconButton
                            color="success"
                            onClick={() => handleApprove(booking._id, 'faculty')}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleReject(booking._id)}
                          >
                            <CancelIcon />
                          </IconButton>
                        </>
                      )}
                      {user.role === 'admin' && booking.status === 'pending' && (
                        <>
                          <IconButton
                            color="success"
                            onClick={() => handleApprove(booking._id, 'admin')}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleReject(booking._id)}
                          >
                            <CancelIcon />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Booking Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box sx={{ mt: 2 }}>
              <Typography><strong>Facility:</strong> {selectedBooking.facility}</Typography>
              <Typography><strong>Date:</strong> {new Date(selectedBooking.date).toLocaleDateString()}</Typography>
              <Typography><strong>Time:</strong> {`${selectedBooking.startTime} - ${selectedBooking.endTime}`}</Typography>
              <Typography><strong>Requester:</strong> {selectedBooking.requester.name}</Typography>
              <Typography><strong>Department:</strong> {selectedBooking.requester.department}</Typography>
              <Typography><strong>Purpose:</strong> {selectedBooking.purpose}</Typography>
              <Typography><strong>Status:</strong> {selectedBooking.status}</Typography>
              {selectedBooking.facultyApproval && (
                <Typography>
                  <strong>Faculty Approval:</strong> {selectedBooking.facultyApproval.status}
                </Typography>
              )}
              {selectedBooking.adminApproval && (
                <Typography>
                  <strong>Admin Approval:</strong> {selectedBooking.adminApproval.status}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookingList; 