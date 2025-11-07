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

  // Backend API base URL
  const API_BASE_URL = 'https://eyecare-utjw.onrender.com';

  const testEndpoints = async () => {
  const token = localStorage.getItem('access_token');
  const endpoints = [
    '/api/consultations/consultations/',
    '/api/consultations/',
    '/api/consultations/user/',
    '/api/consultations/my-consultations/',
    '/api/consultations/patient-consultations/',
    '/api/consultations/specialist-consultations/',
  ];

  console.log('Testing endpoints...');
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log(`${endpoint}: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.log(`${endpoint}: ERROR - ${error.message}`);
    }
  }
};

  // Fetch user's consultations - FIXED: Use correct endpoint
  const fetchConsultations = async () => {
  try {
    const token = localStorage.getItem('access_token');
    console.log('Fetching consultations...');
    
    // Try multiple possible endpoints
    const endpoints = [
      '/api/consultations/patient-consultations/',
      '/api/consultations/my-consultations/', 
      '/api/consultations/user-consultations/',
      '/api/consultations/',
      '/api/consultations/consultations/'
    ];

    let consultationsData = [];
    let workingEndpoint = '';

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        console.log(`Trying ${endpoint}:`, response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`Success with ${endpoint}:`, data);
          workingEndpoint = endpoint;
          
          // Handle different response formats
          if (Array.isArray(data)) {
            consultationsData = data;
          } else if (data.results && Array.isArray(data.results)) {
            consultationsData = data.results;
          } else if (data.consultations && Array.isArray(data.consultations)) {
            consultationsData = data.consultations;
          } else {
            consultationsData = [];
          }
          break;
        }
      } catch (error) {
        console.log(`Endpoint ${endpoint} failed:`, error);
        continue;
      }
    }

    if (workingEndpoint) {
      console.log(`Using endpoint: ${workingEndpoint}`);
      setConsultations(consultationsData);
    } else {
      console.error('No working consultations endpoint found');
      setError('Consultations feature is currently unavailable');
      setConsultations([]);
    }

  } catch (error) {
    console.error('Error fetching consultations:', error);
    setError('Network error fetching consultations');
    setConsultations([]);
  }
};

  // Fetch user's scans - FIXED: Use correct scans endpoint
  const fetchScans = async () => {
    try {
      const token = localStorage.getItem('access_token');
      console.log('Fetching scans...');
      
      // Use the actual scans data endpoint
      const response = await fetch(`${API_BASE_URL}/api/scans/scans/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Scans response:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Scans data:', data);
        
        // Handle different response formats
        if (Array.isArray(data)) {
          setScans(data);
        } else if (data.results && Array.isArray(data.results)) {
          setScans(data.results);
        } else {
          console.warn('Scans data is not an array:', data);
          setScans([]);
        }
      } else {
        console.error('Failed to fetch scans:', response.status);
        setScans([]);
      }
    } catch (error) {
      console.error('Error fetching scans:', error);
      setScans([]);
    }
  };

  useEffect(() => {
    console.log('Component mounted, fetching data...');
    testEndpoints();
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

      // FIXED: Use the correct consultations endpoint for POST
      const response = await fetch(`${API_BASE_URL}/api/consultations/consultations/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(consultationData),
      });

      console.log('Consultation creation response:', response.status);

      if (response.ok) {
        const data = await response.json();
        setConsultations(prev => Array.isArray(prev) ? [data, ...prev] : [data]);
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
        >
          Request Consultation
        </Button>
      </Box>

      {error && (
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

      {/* Debug Info */}
      {/* Enhanced Debug Info */}
<Box sx={{ mb: 2, p: 2, backgroundColor: '#f0f0f0', borderRadius: 1, border: '1px solid #ccc' }}>
  <Typography variant="h6" gutterBottom>Debug Information</Typography>
  <Typography variant="body2">
    API Base: {API_BASE_URL}
  </Typography>
  <Typography variant="body2">
    Endpoints: {specialistsToDisplay.length} specialists, {scansToDisplay.length} scans, {consultationsToDisplay.length} consultations
  </Typography>
  <Typography variant="body2">
    Has Token: {localStorage.getItem('access_token') ? 'Yes' : 'No'}
  </Typography>
  <Button 
    variant="outlined" 
    size="small" 
    onClick={testEndpoints}
    sx={{ mt: 1 }}
  >
    Test All Endpoints
  </Button>
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

      {consultationsToDisplay.length === 0 && (
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