import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hppApi } from './api';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, Box, Stack, TextField, IconButton, Collapse, 
  Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, 
  Select, FormControl, InputLabel, Card, CardContent 
} from '@mui/material';
import { CSVLink } from 'react-csv';
import FactoryIcon from '@mui/icons-material/Factory';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import BoltIcon from '@mui/icons-material/Bolt';

export default function App() {
  const qc = useQueryClient();
  const [q, setQ] = useState(''); // Search
  const [f, setF] = useState(false); // Filter Toggle
  const [s, setS] = useState('All'); // Status Filter
  const [o, setO] = useState(false); // Modal Open
  const [n, setN] = useState({ name: '', location: '', capacity_mw: 50 });

  // 1. Fetch Data
  const { data: p } = useQuery({ queryKey: ['plants'], queryFn: hppApi.getPlants });
  const { data: prod } = useQuery({ queryKey: ['production'], queryFn: hppApi.getProduction });

  // 2. Mutations (CRUD Actions)
  const add = useMutation({ 
    mutationFn: (d) => hppApi.addPlant(d), 
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['plants'] }); setO(false); } 
  });

  const del = useMutation({ 
    mutationFn: (id: number) => hppApi.deletePlant(id), 
    onSuccess: () => qc.invalidateQueries({ queryKey: ['plants'] }) 
  });

  // 3. Logic: Search & Filter
  const filtered = p?.filter((x: any) => 
    x.name.toLowerCase().includes(q.toLowerCase()) && (s === 'All' || x.status === s)
  ) || [];

  const totalCapacity = filtered.reduce((acc: number, curr: any) => acc + curr.capacity_mw, 0);

  return (
    <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh', width: '100vw' }}>
      {/* Header Bar */}
      <Box sx={{ bgcolor: '#1a237e', color: 'white', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 3 }}>
        <Typography variant='h6' sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <FactoryIcon /> HPP OPS DASHBOARD
        </Typography>
        <Stack direction='row' spacing={1}>
          <CSVLink data={filtered} filename='hpp_report.csv' style={{ textDecoration: 'none' }}>
            <Button variant='contained' color='success' startIcon={<DownloadIcon />}>Export CSV</Button>
          </CSVLink>
          <Button variant='contained' color='secondary' startIcon={<AddIcon />} onClick={() => setO(true)}>Add Plant</Button>
          <IconButton color='inherit' onClick={() => setF(!f)}><FilterListIcon /></IconButton>
        </Stack>
      </Box>

      <Container sx={{ mt: 3 }} maxWidth={false}>
        {/* KPI Row */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Card sx={{ minWidth: 250, borderLeft: '5px solid #1a237e' }}>
            <CardContent>
              <Typography color="textSecondary" variant="caption" sx={{ fontWeight: 'bold' }}>TOTAL FLEET CAPACITY</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{totalCapacity.toFixed(1)} MW</Typography>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 250, borderLeft: '5px solid #2e7d32' }}>
            <CardContent>
              <Typography color="textSecondary" variant="caption" sx={{ fontWeight: 'bold' }}>ACTIVE ASSETS</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{filtered.length}</Typography>
            </CardContent>
          </Card>
        </Stack>

        {/* Search & Filter Section */}
        <TextField 
          fullWidth placeholder='Search by name or location...' 
          onChange={(e) => setQ(e.target.value)} 
          sx={{ mb: 2, bgcolor: 'white' }} 
          InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
        />

        <Collapse in={f}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Operational Status</InputLabel>
              <Select value={s} label='Operational Status' onChange={(e) => setS(e.target.value)}>
                <MenuItem value='All'>All Statuses</MenuItem>
                <MenuItem value='Operational'>Operational</MenuItem>
                <MenuItem value='Under Maintenance'>Under Maintenance</MenuItem>
                <MenuItem value='Decommissioned'>Decommissioned</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Collapse>

        {/* Assets Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Asset Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Capacity</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell align='right' sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((r: any) => (
                <TableRow key={r.id} hover>
                  <TableCell sx={{ fontWeight: 'medium', color: '#1a237e' }}>{r.name}</TableCell>
                  <TableCell>{r.location}</TableCell>
                  <TableCell>{r.capacity_mw} MW</TableCell>
                  <TableCell>
                    <Chip 
                      label={r.status} 
                      size='small' 
                      sx={{ fontWeight: 'bold' }}
                      color={r.status === 'Operational' ? 'success' : r.status === 'Under Maintenance' ? 'warning' : 'error'} 
                    />
                  </TableCell>
                  <TableCell align='right'>
                    <IconButton color='error' onClick={() => del.mutate(r.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Add Plant Modal */}
      <Dialog open={o} onClose={() => setO(false)}>
        <DialogTitle sx={{ bgcolor: '#1a237e', color: 'white' }}>Register New Asset</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={2} sx={{ mt: 1, width: 350 }}>
            <TextField label='Plant Name' variant="outlined" onChange={(e) => setN({ ...n, name: e.target.value })} fullWidth />
            <TextField label='Location' variant="outlined" onChange={(e) => setN({ ...n, location: e.target.value })} fullWidth />
            <TextField label='Capacity (MW)' type="number" variant="outlined" onChange={(e) => setN({ ...n, capacity_mw: Number(e.target.value) })} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setO(false)}>Cancel</Button>
          <Button variant='contained' color="primary" onClick={() => add.mutate({ ...n, status: 'Operational', water_flow_rate: 12.5 })}>Add to Fleet</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}