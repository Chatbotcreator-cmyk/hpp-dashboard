import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { hppApi } from './api';
import { 
  Container, Typography, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Chip, Box, Grid, Card, CardContent, 
  TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, IconButton, Collapse, Divider
} from '@mui/material';
import FactoryIcon from '@mui/icons-material/Factory';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import BoltIcon from '@mui/icons-material/Bolt';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false); // Toggle state
  const [statusFilter, setStatusFilter] = useState('All');
  const [minFlow, setMinFlow] = useState(0);
  const [minPower, setMinPower] = useState(0);

  const { data: plants, isLoading, error } = useQuery({
    queryKey: ['plants'],
    queryFn: hppApi.getPlants
  });

  if (isLoading) return <Box sx={{ p: 4 }}><Typography variant="h6">Syncing with Fleet Data...</Typography></Box>;
  if (error) return <Typography color="error" sx={{ p: 4 }}>Connection Error: Is the API running?</Typography>;

  // Multi-way Filtering Logic
  const filteredPlants = plants?.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          plant.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || plant.status === statusFilter;
    const matchesFlow = plant.water_flow_rate >= minFlow;
    const matchesPower = plant.capacity_mw >= minPower;
    
    return matchesSearch && matchesStatus && matchesFlow && matchesPower;
  }) || [];

  const totalCapacity = plants?.reduce((acc, p) => acc + p.capacity_mw, 0).toFixed(1) || 0;
  const activePlants = plants?.filter(p => p.status === 'Operational').length || 0;

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', width: '100vw', pb: 4, overflowX: 'hidden' }}>
      {/* Top Bar with Filter Toggle */}
      <Box sx={{ bgcolor: '#1a237e', color: 'white', py: 2, mb: 3, px: 4, boxShadow: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <FactoryIcon /> HPP FLEET OPERATIONS
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField 
            variant="outlined" size="small" placeholder="Search plants..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ bgcolor: 'white', borderRadius: 1, width: '250px', '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } } }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> }}
          />
          <IconButton 
            onClick={() => setShowFilters(!showFilters)} 
            sx={{ color: 'white', bgcolor: showFilters ? 'rgba(255,255,255,0.2)' : 'transparent' }}
          >
            <FilterListIcon />
          </IconButton>
        </Box>
      </Box>

      <Container maxWidth={false} sx={{ px: 4 }}>
        {/* Toggleable Filter Panel */}
        <Collapse in={showFilters}>
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterListIcon fontSize="small" /> Advanced Filters
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                    <MenuItem value="All">All Statuses</MenuItem>
                    <MenuItem value="Operational">Operational</MenuItem>
                    <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
                    <MenuItem value="Decommissioned">Decommissioned</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Min Power Output (MW)</InputLabel>
                  <Select value={minPower} label="Min Power Output (MW)" onChange={(e) => setMinPower(Number(e.target.value))}>
                    <MenuItem value={0}>Any Capacity</MenuItem>
                    <MenuItem value={20}>&gt; 20 MW</MenuItem>
                    <MenuItem value={50}>&gt; 50 MW</MenuItem>
                    <MenuItem value={80}>&gt; 80 MW</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Min Water Flow (m³/s)</InputLabel>
                  <Select value={minFlow} label="Min Water Flow (m³/s)" onChange={(e) => setMinFlow(Number(e.target.value))}>
                    <MenuItem value={0}>Any Flow Rate</MenuItem>
                    <MenuItem value={3}>&gt; 3 m³/s</MenuItem>
                    <MenuItem value={6}>&gt; 6 m³/s</MenuItem>
                    <MenuItem value={9}>&gt; 9 m³/s</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Collapse>

        {/* KPI Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1.5, bgcolor: '#e8eaf6', borderRadius: 2, color: '#1a237e' }}><BoltIcon fontSize="large" /></Box>
                <Box>
                  <Typography variant="overline" color="text.secondary">Total Generation Capacity</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{totalCapacity} <small style={{ fontSize: '1rem' }}>MW</small></Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1.5, bgcolor: '#e8f5e9', borderRadius: 2, color: '#2e7d32' }}><WaterDropIcon fontSize="large" /></Box>
                <Box>
                  <Typography variant="overline" color="text.secondary">Operational Status</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{activePlants} <small style={{ fontSize: '1rem' }}>Active Units</small></Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#37474f' }}>
          Asset Inventory ({filteredPlants.length})
        </Typography>
        
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <Table sx={{ minWidth: '100%' }}>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Plant Details</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Capacity</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Flow Rate</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPlants.map((plant) => (
                <TableRow key={plant.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1a237e' }}>{plant.name}</Typography>
                    <Typography variant="caption" color="text.secondary">ID: #{plant.id}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOnIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      <Typography variant="body2">{plant.location}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right"><Typography variant="body2" sx={{ fontWeight: 600 }}>{plant.capacity_mw} MW</Typography></TableCell>
                  <TableCell align="right"><Typography variant="body2">{plant.water_flow_rate} m³/s</Typography></TableCell>
                  <TableCell align="center">
                    <Chip label={plant.status} size="small" sx={{ fontWeight: 'bold', 
                      bgcolor: plant.status === 'Operational' ? '#e8f5e9' : plant.status === 'Under Maintenance' ? '#fff3e0' : '#ffeef2',
                      color: plant.status === 'Operational' ? '#2e7d32' : plant.status === 'Under Maintenance' ? '#ef6c00' : '#d32f2f' }} 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}

export default App;