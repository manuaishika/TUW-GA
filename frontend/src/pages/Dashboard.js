import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/bookings');
        setBookings(response.data);
        
        // Calculate statistics
        const stats = {
          total: response.data.length,
          approved: response.data.filter(b => b.status === 'approved').length,
          pending: response.data.filter(b => b.status === 'pending').length,
          rejected: response.data.filter(b => b.status === 'rejected').length,
        };
        setStats(stats);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" component="div" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" color={color}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Statistics */}
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Bookings"
            value={stats.total}
            icon={<EventIcon color="primary" />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Approved"
            value={stats.approved}
            icon={<CheckCircleIcon color="success" />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={<PendingIcon color="warning" />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Rejected"
            value={stats.rejected}
            icon={<CancelIcon color="error" />}
            color="error.main"
          />
        </Grid>

        {/* Recent Bookings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Recent Bookings</Typography>
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
            <List>
              {bookings.slice(0, 5).map((booking) => (
                <React.Fragment key={booking._id}>
                  <ListItem>
                    <ListItemText
                      primary={`${booking.facility} - ${new Date(booking.date).toLocaleDateString()}`}
                      secondary={`${booking.startTime} - ${booking.endTime} | Status: ${booking.status}`}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 