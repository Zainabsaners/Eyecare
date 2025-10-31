import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Grid,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Alert,
  Snackbar
} from '@mui/material';
import { Add, CalendarToday, Person, MedicalServices } from '@mui/icons-material';

const ConsultationPage = () => {
  const [consultations, setConsultations] = useState([]);
  const [specialists, setSpecialists] = useState([]);
  const [scans, setScans] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [selectedScan, setSelectedScan] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch user's consultations
  const fetchConsultations = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/consultations/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setConsultations(data);
      } else {
        console.error('Failed to fetch consultations');
      }
    } catch (error) {
      console.error('Error fetching consultations:', error);
    }
  };

  // Fetch available specialists
  const fetchSpecialists = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/consultations/available_specialists/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSpecialists(data);
      } else {
        console.error('Failed to fetch specialists');
      }
    } catch (error) {
      console.error('Error fetching specialists:', error);
    }
  };

  // Fetch user's scans
  const fetchScans = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/scans/scans/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setScans(data);
      } else {
        console.error('Failed to fetch scans');
      }
    } catch (error) {
      console.error('Error fetching scans:', error);
    }
  };

  useEffect(() => {
    fetchConsultations();
    fetchSpecialists();
    fetchScans();
  }, []);

  const handleRequestConsultation = async () => {
    setLoading(true);
    setError('');

    // Validate required fields
    if (!selectedSpecialist) {
      setError('Please select a specialist');
      setLoading(false);
      return;
    }

    if (!selectedScan) {
      setError('Please select a scan');
      setLoading(false);
      return;
    }

    if (!description.trim()) {
      setError('Please provide a description of your concerns');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const consultationData = {
        specialist: parseInt(selectedSpecialist),
        scan: parseInt(selectedScan),
        description: description.trim(),
        scheduled_date: scheduledDate || null,
      };

      console.log('Sending consultation data:', consultationData);

      const response = await fetch('/api/consultations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(consultationData),
      });

      if (response.ok) {
        const data = await response.json();
        setConsultations([data, ...consultations]);
        setOpenDialog(false);
        resetForm();
        
        // Show success message briefly
        setSuccessMessage('Consultation request submitted successfully! Our specialist will review your request soon.');
        
        // Refresh consultations list
        fetchConsultations();
      } else {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        setError(errorData.detail || errorData.error || 'Failed to submit consultation request');
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedSpecialist('');
    setSelectedScan('');
    setDescription('');
    setScheduledDate('');
    setError('');
  };

  const handleCancel = () => {
    resetForm();
    setOpenDialog(false);
  };

  const handleCloseSuccessMessage = () => {
    setSuccessMessage('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'approved': return '#4caf50';
      case 'completed': return '#2196f3';
      case 'cancelled': return '#f44336';
      default: return '#757575';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Consultations
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Request Consultation
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Success Snackbar - appears briefly then auto-closes */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={handleCloseSuccessMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={handleCloseSuccessMessage}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Consultations List - FIXED: All Grid items have keys */}
      <Grid container spacing={3}>
        {consultations.map((consultation) => (
          <Grid key={`consultation-${consultation.id}`} size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Consultation with {consultation.specialist_name || 'Specialist'}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Status: <span style={{ 
                    color: getStatusColor(consultation.status),
                    fontWeight: 'bold'
                  }}>
                    {consultation.status || 'pending'}
                  </span>
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Description: {consultation.description}
                </Typography>
                {consultation.scheduled_date && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <CalendarToday sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">
                      Scheduled: {new Date(consultation.scheduled_date).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Created: {new Date(consultation.created_at).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {consultations.length === 0 && (
        <Card sx={{ textAlign: 'center', py: 4 }}>
          <CardContent>
            <MedicalServices sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              No consultation requests yet
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1, mb: 3 }}>
              Request your first consultation with a specialist to discuss your eye health
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenDialog(true)}
            >
              Request Your First Consultation
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Request Consultation Dialog - FIXED: All mapped items have keys */}
      <Dialog open={openDialog} onClose={handleCancel} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MedicalServices />
            Request Specialist Consultation
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* FIXED: Added key to the main Grid container */}
          <Grid key="consultation-form-grid" container spacing={2} sx={{ mt: 1 }}>
            {/* Field 1: Select Specialist */}
            <Grid key="specialist-field" size={12}>
              <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                1. Choose a Specialist *
              </Typography>
              <TextField
                select
                fullWidth
                label="Select Specialist"
                value={selectedSpecialist}
                onChange={(e) => setSelectedSpecialist(e.target.value)}
                required
                error={!selectedSpecialist}
                helperText={!selectedSpecialist ? "Please select a specialist" : ""}
              >
                <MenuItem key="specialist-default" value="">
                  <em>Choose a specialist...</em>
                </MenuItem>
                {specialists.map((specialist) => (
                  <MenuItem key={`specialist-${specialist.id}`} value={specialist.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Person sx={{ mr: 1 }} />
                      Dr. {specialist.first_name} {specialist.last_name}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Field 2: Select Scan */}
            <Grid key="scan-field" size={12}>
              <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                2. Select Scan for Reference *
              </Typography>
              <TextField
                select
                fullWidth
                label="Select Scan"
                value={selectedScan}
                onChange={(e) => setSelectedScan(e.target.value)}
                required
                error={!selectedScan}
                helperText={!selectedScan ? "Please select a scan" : ""}
              >
                <MenuItem key="scan-default" value="">
                  <em>Choose a scan...</em>
                </MenuItem>
                {scans.map((scan) => (
                  <MenuItem key={`scan-${scan.id}`} value={scan.id}>
                    Scan #{scan.id} - {scan.condition_detected || 'Eye Scan'} 
                    ({new Date(scan.created_at).toLocaleDateString()})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Field 3: Scheduled Date (Optional) */}
            <Grid key="date-field" size={12}>
              <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                3. Preferred Consultation Date (Optional)
              </Typography>
              <TextField
                fullWidth
                label="Preferred Date"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* Field 4: Description */}
            <Grid key="description-field" size={12}>
              <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                4. Describe Your Concerns *
              </Typography>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe your symptoms, concerns, or any specific questions for the specialist..."
                required
                error={!description.trim()}
                helperText={!description.trim() ? "Please describe your concerns" : "Be specific about your symptoms and questions"}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleRequestConsultation} 
            variant="contained"
            disabled={loading || !selectedSpecialist || !selectedScan || !description.trim()}
            startIcon={loading ? null : <Add />}
          >
            {loading ? 'Submitting...' : 'Request Consultation'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ConsultationPage;