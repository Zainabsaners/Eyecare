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
  Snackbar,
  CircularProgress
} from '@mui/material';
import { Add, CalendarToday, Person, MedicalServices, Refresh, Warning } from '@mui/icons-material';

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
  const [connectionError, setConnectionError] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Backend API base URL
  const API_BASE_URL = 'https://eyecare-utjw.onrender.com';

  // Test backend connection
  const testBackendConnection = async () => {
    try {
      console.log('Testing backend connection...');
      const response = await fetch(`${API_BASE_URL}/api/consultations/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.log('Backend connection test failed:', error);
      return false;
    }
  };

  // Fetch user's consultations with CORS workaround
  const fetchConsultations = async () => {
    try {
      const token = localStorage.getItem('access_token');
      console.log('Fetching consultations...');
      
      const response = await fetch(`${API_BASE_URL}/api/consultations/consultations/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Consultations response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Consultations data received:', data);
        
        if (Array.isArray(data)) {
          setConsultations(data);
        } else if (data.results && Array.isArray(data.results)) {
          setConsultations(data.results);
        } else {
          setConsultations([]);
        }
        setConnectionError(false);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching consultations:', error);
      setConnectionError(true);
      setError('Cannot connect to server. Please check your backend CORS configuration.');
      setConsultations([]);
    }
  };

  // Fetch specialists with CORS workaround
  const fetchSpecialists = async () => {
    try {
      const token = localStorage.getItem('access_token');
      console.log('Fetching specialists...');
      
      const response = await fetch(`${API_BASE_URL}/api/auth/specialists/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Specialists response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Specialists data:', data);
        
        if (Array.isArray(data)) {
          setSpecialists(data);
        } else {
          setSpecialists([]);
        }
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching specialists:', error);
      setSpecialists([]);
    }
  };

  // Fetch user's scans with CORS workaround
  const fetchScans = async () => {
    try {
      const token = localStorage.getItem('access_token');
      console.log('Fetching scans...');
      
      const response = await fetch(`${API_BASE_URL}/api/scans/scans/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Scans response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Scans data:', data);
        
        if (Array.isArray(data)) {
          setScans(data);
        } else if (data.results && Array.isArray(data.results)) {
          setScans(data.results);
        } else {
          setScans([]);
        }
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching scans:', error);
      setScans([]);
    }
  };

  // Load all data
  const loadAllData = async () => {
    setFetching(true);
    setConnectionError(false);
    
    // Test connection first
    const isConnected = await testBackendConnection();
    
    if (!isConnected) {
      setConnectionError(true);
      setError('Backend server is not accessible. Please check CORS configuration.');
      setFetching(false);
      return;
    }

    try {
      await Promise.all([
        fetchConsultations(),
        fetchSpecialists(),
        fetchScans()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      setConnectionError(true);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    console.log('Component mounted, fetching data...');
    loadAllData();
  }, []);

  const handleRequestConsultation = async () => {
    if (connectionError) {
      setError('Cannot submit consultation - server connection issue');
      return;
    }

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
        console.log('Successfully created consultation:', data);
        
        // Add the new consultation to the list
        setConsultations(prev => Array.isArray(prev) ? [data, ...prev] : [data]);
        setOpenDialog(false);
        resetForm();
        
        // Show success message
        setSuccessMessage('Consultation request submitted successfully! Our specialist will review your request soon.');
        
      } else {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        setError(errorData.detail || errorData.error || 'Failed to submit consultation request');
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('Network error. Please check your connection and try again.');
      setConnectionError(true);
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
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadAllData}
            disabled={fetching}
          >
            {fetching ? <CircularProgress size={20} /> : 'Refresh'}
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
            disabled={connectionError}
          >
            Request Consultation
          </Button>
        </Box>
      </Box>

      {connectionError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning />
            <Box>
              <Typography variant="body1" fontWeight="bold">
                Server Connection Error
              </Typography>
              <Typography variant="body2">
                Cannot connect to the backend server. This is usually due to CORS configuration.
                Please check your Django backend settings and make sure CORS is properly configured.
              </Typography>
            </Box>
          </Box>
        </Alert>
      )}

      {error && !connectionError && (
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

      {/* Loading State */}
      {fetching && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={40} />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Loading consultations...
            </Typography>
          </Box>
        </Box>
      )}

      {/* Connection Status */}
      {!fetching && (
        <Box sx={{ mb: 2, p: 2, backgroundColor: connectionError ? '#ffebee' : '#e8f5e8', borderRadius: 1 }}>
          <Typography variant="body2" color={connectionError ? 'error' : 'success.main'}>
            {connectionError 
              ? '❌ Cannot connect to backend server - CORS issue' 
              : `✅ Server connected - ${consultationsToDisplay.length} consultations, ${specialistsToDisplay.length} specialists, ${scansToDisplay.length} scans loaded`
            }
          </Typography>
        </Box>
      )}

      {/* Consultations List */}
      {!fetching && !connectionError && (
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
      )}

      {!fetching && !connectionError && consultationsToDisplay.length === 0 && (
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

      {connectionError && !fetching && (
        <Card sx={{ textAlign: 'center', py: 4 }}>
          <CardContent>
            <Warning sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
            <Typography variant="h6" color="error.main">
              Backend Connection Required
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1, mb: 3 }}>
              Please configure CORS in your Django backend to allow requests from:
              <br />
              <strong>https://eyecare-pi.vercel.app</strong>
            </Typography>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={loadAllData}
            >
              Retry Connection
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
                disabled={connectionError}
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
                disabled={connectionError}
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
                disabled={connectionError}
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
                disabled={connectionError}
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
            disabled={loading || !selectedSpecialist || !selectedScan || !description.trim() || connectionError}
            startIcon={loading ? <CircularProgress size={16} /> : <Add />}
          >
            {loading ? 'Submitting...' : 'Request Consultation'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ConsultationPage;