import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hppApi } from './api';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, Box, Stack, TextField, IconButton, Collapse, 
  Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, 
  Select, FormControl, InputLabel 
} from '@mui/material';
import { CSVLink } from 'react-csv';
import FactoryIcon from '@mui/icons-material/Factory';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';

export default function App() {
  const qc = useQueryClient();
  const [q, setQ] = useState('');
  const [f, setF] = useState(false);
  const [s, setS] = useState('All');
  const [o, setO] = useState(false);
  const [n, setN] = useState({ name: '', location: '' });

  const { data: p, isLoading } = useQuery({ queryKey: ['plants'], queryFn: hppApi.getPlants });

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

  return (
    <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh', width: '100vw' }}>
      {/* Navbar */}
      <Box sx={{ bgcolor: '#1a237e', color: 'white', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 3 }}>
        <Typography variant='h6' sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <FactoryIcon /> HPP OPS CENTER
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
        {/* Search */}
        <TextField 
          fullWidth placeholder='Search plants by name...' 
          onChange={(e) => setQ(e.target.value)} 
          sx={{ mb: 2, bgcolor: 'white' }} 
          InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
        />

        {/* Filters */}
        <Collapse in={f}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Status Filter</InputLabel>
              <Select value={s} label='Status Filter' onChange={(e) => setS(e.target.value)}>
                <MenuItem value='All'>All Statuses</MenuItem>
                <MenuItem value='Operational'>Operational</MenuItem>
                <MenuItem value='Under Maintenance'>Under Maintenance</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Collapse>

        {/* Main Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Plant Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell align='right' sx={{ fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((r: any) => (
                <TableRow key={r.id} hover>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.location}</TableCell>
                  <TableCell>
                    <Chip 
                      label={r.status} 
                      size='small' 
                      color={r.status === 'Operational' ? 'success' : 'warning'} 
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

      {/* Add Dialog */}
      <Dialog open={o} onClose={() => setO(false)}>
        <DialogTitle>Register New Plant Asset</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1, width: 350 }}>
            <TextField label='Plant Name' onChange={(e) => setN({ ...n, name: e.target.value })} fullWidth />
            <TextField label='Location' onChange={(e) => setN({ ...n, location: e.target.value })} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setO(false)}>Cancel</Button>
          <Button variant='contained' onClick={() => add.mutate({ ...n, capacity_mw: 50, status: 'Operational', water_flow_rate: 10 })}>Save Asset</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}