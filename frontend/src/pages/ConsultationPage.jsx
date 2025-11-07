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
  const [corsError, setCorsError] = useState(false);

  // Backend API base URL
  const API_BASE_URL = 'https://eyecare-utjw.onrender.com';

  // Fetch user's consultations with CORS error handling
  const fetchConsultations = async () => {
    try {
      const token = localStorage.getItem('access_token');
      console.log('Fetching consultations...');
      
      const response = await fetch(`${API_BASE_URL}/api/consultations/consultations/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        mode: 'cors', // Explicitly set CORS mode
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Consultations data received:', data);
      
      // Handle different response formats
      if (Array.isArray(data)) {
        setConsultations(data);
      } else if (data.results && Array.isArray(data.results)) {
        setConsultations(data.results);
      } else if (data.consultations && Array.isArray(data.consultations)) {
        setConsultations(data.consultations);
      } else {
        setConsultations([]);
      }
      setCorsError(false);
      
    } catch (error) {
      console.error('Error fetching consultations:', error);
      if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
        setCorsError(true);
        setError('Connection error: Please check if the server is running and CORS is configured');
      } else {
        setError('Failed to load consultations');
      }
      setConsultations([]);
    }
  };

  // Fetch specialists with CORS error handling
  const fetchSpecialists = async () => {
    try {
      const token = localStorage.getItem('access_token');
      console.log('Fetching specialists...');
      
      const response = await fetch(`${API_BASE_URL}/api/auth/specialists/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Specialists data:', data);
      
      if (Array.isArray(data)) {
        setSpecialists(data);
      } else {
        setSpecialists([]);
      }
      
    } catch (error) {
      console.error('Error fetching specialists:', error);
      setSpecialists([]);
    }
  };

  // Fetch user's scans with CORS error handling
  const fetchScans = async () => {
    try {
      const token = localStorage.getItem('access_token');
      console.log('Fetching scans...');
      
      const response = await fetch(`${API_BASE_URL}/api/scans/scans/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Scans data:', data);
      
      if (Array.isArray(data)) {
        setScans(data);
      } else if (data.results && Array.isArray(data.results)) {
        setScans(data.results);
      } else {
        setScans([]);
      }
      
    } catch (error) {
      console.error('Error fetching scans:', error);
      setScans([]);
    }
  };

  useEffect(() => {
    console.log('Component mounted, fetching data...');
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

      const response = await fetch(`${API_BASE_URL}/api/consultations/consultations/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(consultationData),
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Add the new consultation to the list
      setConsultations(prev => Array.isArray(prev) ? [data, ...prev] : [data]);
      setOpenDialog(false);
      resetForm();
      
      // Show success message
      setSuccessMessage('Consultation request submitted successfully! Our specialist will review your request soon.');
      
    } catch (error) {
      console.error('Network error:', error);
      if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
        setError('Connection error: Please check if the server is running and CORS is configured');
      } else {
        setError('Network error. Please check your connection and try again.');
      }
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

  // Ensure data is always arrays for mapping
  const consultationsToDisplay = Array.isArray(consultations) ? consultations : [];
  const specialistsToDisplay = Array.isArray(specialists) ? specialists : [];
  const scansToDisplay = Array.isArray(scans) ? scans : [];

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
          disabled={corsError}
        >
          Request Consultation
        </Button>
      </Box>

      {corsError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          CORS Error: Backend server is not allowing requests from this domain. 
          Please check your backend CORS configuration or try again later.
        </Alert>
      )}

      {error && !corsError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Success Snackbar */}
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

      {/* Connection Status */}
      <Box sx={{ mb: 2, p: 2, backgroundColor: corsError ? '#ffebee' : '#e8f5e8', borderRadius: 1 }}>
        <Typography variant="body2" color={corsError ? 'error' : 'success.main'}>
          {corsError 
            ? '❌ Connection Issue: Cannot reach backend server' 
            : '✅ Connection: Backend server is accessible'
          }
        </Typography>
        {corsError && (
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => {
              setCorsError(false);
              fetchConsultations();
              fetchSpecialists();
              fetchScans();
            }}
            sx={{ mt: 1 }}
          >
            Retry Connection
          </Button>
        )}
      </Box>

      {/* Consultations List */}
      <Grid container spacing={3}>
        {consultationsToDisplay.map((consultation) => (
          <Grid key={`consultation-${consultation.id}`} item xs={12} md={6}>
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

      {consultationsToDisplay.length === 0 && !corsError && (
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

      {corsError && (
        <Card sx={{ textAlign: 'center', py: 4 }}>
          <CardContent>
            <MedicalServices sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              Connection Issue
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1, mb: 3 }}>
              Unable to connect to the server. Please check your backend CORS configuration.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Request Consultation Dialog */}
      <Dialog open={openDialog} onClose={handleCancel} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MedicalServices />
            Request Specialist Consultation
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Field 1: Select Specialist */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                1. Choose a Specialist * ({specialistsToDisplay.length} available)
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
                disabled={corsError}
              >
                <MenuItem value="">
                  <em>Choose a specialist...</em>
                </MenuItem>
                {specialistsToDisplay.map((specialist) => (
                  <MenuItem key={`specialist-${specialist.id}`} value={specialist.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Person sx={{ mr: 1 }} />
                      Dr. {specialist.first_name} {specialist.last_name}
                      {specialist.specialization && ` - ${specialist.specialization}`}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Field 2: Select Scan */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                2. Select Scan for Reference * ({scansToDisplay.length} available)
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
                disabled={corsError}
              >
                <MenuItem value="">
                  <em>Choose a scan...</em>
                </MenuItem>
                {scansToDisplay.map((scan) => (
                  <MenuItem key={`scan-${scan.id}`} value={scan.id}>
                    Scan #{scan.id} - {scan.condition_detected || 'Eye Scan'} 
                    ({new Date(scan.created_at).toLocaleDateString()})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Field 3: Scheduled Date (Optional) */}
            <Grid item xs={12}>
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
                disabled={corsError}
              />
            </Grid>

            {/* Field 4: Description */}
            <Grid item xs={12}>
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
                disabled={corsError}
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
            disabled={loading || !selectedSpecialist || !selectedScan || !description.trim() || corsError}
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