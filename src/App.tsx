import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hppApi } from './api';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, Box, Stack, TextField, IconButton, Collapse, 
  Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, 
  Select, FormControl, Card, CardContent, InputAdornment 
} from '@mui/material';
import { CSVLink } from 'react-csv';
import FactoryIcon from '@mui/icons-material/Factory';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import BoltIcon from '@mui/icons-material/Bolt';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function App() {
  const qc = useQueryClient();
  const [q, setQ] = useState(''); 
  const [f, setF] = useState(false); 
  const [s, setS] = useState('All'); 
  const [o, setO] = useState(false); 
  const [n, setN] = useState({ name: '', location: '', capacity_mw: 0, water_flow_rate: 0 });

  const { data: p } = useQuery({ queryKey: ['plants'], queryFn: hppApi.getPlants });

  const add = useMutation({ 
    mutationFn: (d) => hppApi.addPlant(d), 
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['plants'] }); setO(false); } 
  });

  const del = useMutation({ 
    mutationFn: (id: number) => hppApi.deletePlant(id), 
    onSuccess: () => qc.invalidateQueries({ queryKey: ['plants'] }) 
  });

  const filtered = p?.filter((x: any) => 
    x.name.toLowerCase().includes(q.toLowerCase()) && (s === 'All' || x.status === s)
  ) || [];

  const totalCap = filtered.reduce((acc: number, curr: any) => acc + (curr.capacity_mw || 0), 0);
  const activeCount = filtered.filter((x: any) => x.status === 'Operational').length;

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', width: '100vw' }}>
      {/* BLUE NAVBAR */}
      <Box sx={{ bgcolor: '#1a237e', color: 'white', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <FactoryIcon />
          <Typography variant='h6' sx={{ fontWeight: 700 }}>HPP FLEET OPERATIONS</Typography>
        </Stack>
        
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField 
            size="small"
            placeholder='Search plants...' 
            onChange={(e) => setQ(e.target.value)} 
            sx={{ bgcolor: 'white', borderRadius: 1, width: 300 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          />
          <IconButton color='inherit' onClick={() => setF(!f)}><FilterListIcon /></IconButton>
        </Stack>
      </Box>

      <Container sx={{ mt: 4 }} maxWidth={false}>
        {/* KPI CARDS - Restoration of Bolt & Water icons */}
        <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
          <Card sx={{ minWidth: 280, borderRadius: 2 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ bgcolor: '#e8eaf6', p: 2, borderRadius: 2 }}><BoltIcon color="primary" /></Box>
              <Box>
                <Typography color="textSecondary" variant="caption" sx={{ fontWeight: 'bold' }}>TOTAL GENERATION CAPACITY</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>{totalCap.toFixed(1)} <Typography component="span" variant="h6">MW</Typography></Typography>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 280, borderRadius: 2 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ bgcolor: '#e8f5e9', p: 2, borderRadius: 2 }}><WaterDropIcon sx={{ color: '#2e7d32' }} /></Box>
              <Box>
                <Typography color="textSecondary" variant="caption" sx={{ fontWeight: 'bold' }}>OPERATIONAL STATUS</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>{activeCount} <Typography component="span" variant="h6">Active Units</Typography></Typography>
              </Box>
            </CardContent>
          </Card>
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>Asset Inventory ({filtered.length})</Typography>
          <Stack direction="row" spacing={1}>
             <CSVLink data={filtered} filename='hpp_report.csv' style={{ textDecoration: 'none' }}>
                <Button size="small" variant='outlined' color="inherit" startIcon={<DownloadIcon />}>Export CSV</Button>
             </CSVLink>
             <Button size="small" variant='contained' color="primary" startIcon={<AddIcon />} onClick={() => setO(true)}>Add Asset</Button>
          </Stack>
        </Box>

        <Collapse in={f}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <FormControl size="small" sx={{ width: 200 }}>
              <Select value={s} onChange={(e) => setS(e.target.value)}>
                <MenuItem value='All'>All Statuses</MenuItem>
                <MenuItem value='Operational'>Operational</MenuItem>
                <MenuItem value='Under Maintenance'>Under Maintenance</MenuItem>
                <MenuItem value='Decommissioned'>Decommissioned</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Collapse>

        {/* TABLE - Restoration of the Flow Rate column and Pin icon */}
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #eee' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#fafafa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Plant Details</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Capacity</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Flow Rate</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell align='right'></TableCell>
              </TableRow>
            </Head>
            <TableBody>
              {filtered.map((r: any) => (
                <TableRow key={r.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1a237e' }}>{r.name}</Typography>
                    <Typography variant="caption" color="textSecondary">ID: #{r.id}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                       <LocationOnIcon sx={{ color: 'gray', fontSize: 18 }} />
                       <Typography variant="body2">{r.location}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{r.capacity_mw} MW</TableCell>
                  <TableCell>{r.water_flow_rate} m³/s</TableCell>
                  <TableCell>
                    <Chip 
                      label={r.status} 
                      size='small' 
                      sx={{ fontWeight: 'bold' }}
                      color={r.status === 'Operational' ? 'success' : r.status === 'Under Maintenance' ? 'warning' : 'error'} 
                    />
                  </TableCell>
                  <TableCell align='right'>
                    <IconButton size="small" color='error' onClick={() => del.mutate(r.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* ADD DIALOG */}
      <Dialog open={o} onClose={() => setO(false)}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Register New Asset</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1, width: 320 }}>
            <TextField label='Plant Name' size="small" onChange={(e) => setN({ ...n, name: e.target.value })} fullWidth />
            <TextField label='Location' size="small" onChange={(e) => setN({ ...n, location: e.target.value })} fullWidth />
            <TextField label='Capacity (MW)' size="small" type="number" onChange={(e) => setN({ ...n, capacity_mw: Number(e.target.value) })} fullWidth />
            <TextField label='Flow Rate (m³/s)' size="small" type="number" onChange={(e) => setN({ ...n, water_flow_rate: Number(e.target.value) })} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setO(false)}>Cancel</Button>
          <Button variant='contained' onClick={() => add.mutate({ ...n, status: 'Operational' })}>Save Asset</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}