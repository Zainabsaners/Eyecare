import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab
} from '@mui/material';
import { 
  MedicalServices, 
  Person, 
  CalendarToday, 
  Visibility,
  CheckCircle,
  Cancel,
  Assignment
} from '@mui/icons-material';

const SpecialistConsultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Backend API base URL
  const API_BASE_URL = 'https://eyecare-utjw.onrender.com';

  // Fetch consultations for the logged-in specialist
  const fetchConsultations = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/api/consultations/consultations/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Specialist consultations response:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Specialist consultations data:', data);
        setConsultations(data);
      } else {
        console.error('Failed to fetch consultations:', response.status);
        setError('Failed to fetch consultations');
      }
    } catch (error) {
      console.error('Error fetching consultations:', error);
      setError('Error loading consultations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const handleApprove = async (consultationId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/api/consultations/consultations/${consultationId}/approve/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchConsultations(); // Refresh the list
        setOpenDialog(false);
        setSelectedConsultation(null);
      } else {
        setError('Failed to approve consultation');
      }
    } catch (error) {
      console.error('Error approving consultation:', error);
      setError('Error approving consultation');
    }
  };

  const handleComplete = async (consultationId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/api/consultations/consultations/${consultationId}/complete/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchConsultations(); // Refresh the list
        setOpenDialog(false);
        setSelectedConsultation(null);
      } else {
        setError('Failed to complete consultation');
      }
    } catch (error) {
      console.error('Error completing consultation:', error);
      setError('Error completing consultation');
    }
  };

  const handleCancel = async (consultationId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/api/consultations/consultations/${consultationId}/cancel/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchConsultations(); // Refresh the list
        setOpenDialog(false);
        setSelectedConsultation(null);
      } else {
        setError('Failed to cancel consultation');
      }
    } catch (error) {
      console.error('Error cancelling consultation:', error);
      setError('Error cancelling consultation');
    }
  };

  const handleViewDetails = (consultation) => {
    setSelectedConsultation(consultation);
    setOpenDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'primary';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusChip = (status) => {
    const statusLabels = {
      'pending': 'Pending Review',
      'approved': 'Approved',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };

    return (
      <Chip 
        label={statusLabels[status] || status} 
        color={getStatusColor(status)}
        size="small"
      />
    );
  };

  // Filter consultations by status
  const pendingConsultations = consultations.filter(c => c.status === 'pending');
  const approvedConsultations = consultations.filter(c => c.status === 'approved');
  const completedConsultations = consultations.filter(c => c.status === 'completed');

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Loading consultations...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <MedicalServices sx={{ mr: 2, verticalAlign: 'middle' }} />
          My Consultation Requests
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Total: {consultations.length} requests
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Tabs for different statuses */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab 
            label={`Pending (${pendingConsultations.length})`} 
            icon={<Assignment />}
            iconPosition="start"
          />
          <Tab 
            label={`Approved (${approvedConsultations.length})`} 
            icon={<CheckCircle />}
            iconPosition="start"
          />
          <Tab 
            label={`Completed (${completedConsultations.length})`} 
            icon={<CheckCircle />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Consultation List */}
      <Grid container spacing={3}>
        {(tabValue === 0 ? pendingConsultations : 
          tabValue === 1 ? approvedConsultations : completedConsultations)
          .map((consultation) => (
          <Grid item xs={12} md={6} key={consultation.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h2">
                    Consultation #{consultation.id}
                  </Typography>
                  {getStatusChip(consultation.status)}
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Person sx={{ mr: 1, fontSize: 16 }} />
                    Patient: {consultation.user_name || 'Unknown Patient'}
                  </Typography>
                  
                  <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <MedicalServices sx={{ mr: 1, fontSize: 16 }} />
                    Scan: #{consultation.scan}
                  </Typography>

                  {consultation.scheduled_date && (
                    <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarToday sx={{ mr: 1, fontSize: 16 }} />
                      Preferred: {new Date(consultation.scheduled_date).toLocaleDateString()}
                    </Typography>
                  )}

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Description:</strong> {consultation.description}
                  </Typography>
                </Box>

                <Typography variant="caption" display="block" sx={{ color: 'text.secondary', mb: 2 }}>
                  Requested: {new Date(consultation.created_at).toLocaleDateString()}
                </Typography>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => handleViewDetails(consultation)}
                  >
                    View Details
                  </Button>

                  {consultation.status === 'pending' && (
                    <>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<CheckCircle />}
                        onClick={() => handleApprove(consultation.id)}
                        color="success"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Cancel />}
                        onClick={() => handleCancel(consultation.id)}
                        color="error"
                      >
                        Decline
                      </Button>
                    </>
                  )}

                  {consultation.status === 'approved' && (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<CheckCircle />}
                      onClick={() => handleComplete(consultation.id)}
                      color="success"
                    >
                      Mark Complete
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {consultations.length === 0 && (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <MedicalServices sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No Consultation Requests
            </Typography>
            <Typography variant="body1" color="textSecondary">
              You don't have any consultation requests yet. Patients will appear here when they request consultations with you.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Consultation Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Consultation Details #{selectedConsultation?.id}
        </DialogTitle>
        <DialogContent>
          {selectedConsultation && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Patient</Typography>
                  <Typography variant="body1">{selectedConsultation.user_name}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Scan Reference</Typography>
                  <Typography variant="body1">Scan #{selectedConsultation.scan}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Description</Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {selectedConsultation.description}
                  </Typography>
                </Grid>
                {selectedConsultation.scheduled_date && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Preferred Date</Typography>
                    <Typography variant="body1">
                      {new Date(selectedConsultation.scheduled_date).toLocaleDateString()}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                  {getStatusChip(selectedConsultation.status)}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Requested On</Typography>
                  <Typography variant="body1">
                    {new Date(selectedConsultation.created_at).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          {selectedConsultation?.status === 'pending' && (
            <>
              <Button 
                onClick={() => handleApprove(selectedConsultation.id)}
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
              >
                Approve Consultation
              </Button>
              <Button 
                onClick={() => handleCancel(selectedConsultation.id)}
                color="error"
                startIcon={<Cancel />}
              >
                Decline
              </Button>
            </>
          )}
          {selectedConsultation?.status === 'approved' && (
            <Button 
              onClick={() => handleComplete(selectedConsultation.id)}
              variant="contained"
              color="success"
              startIcon={<CheckCircle />}
            >
              Mark as Completed
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SpecialistConsultations;