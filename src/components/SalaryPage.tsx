import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface SalaryData {
  month: Record<string, number>;
}

const CATEGORIES = [
  { label: "IT Jobs", value: "it-jobs" },
  { label: "Accounting & Finance Jobs", value: "accounting-finance-jobs" },
  { label: "Engineering Jobs", value: "engineering-jobs" },
  { label: "Healthcare & Nursing Jobs", value: "healthcare-nursing-jobs" },
  { label: "Teaching Jobs", value: "teaching-jobs" },
  { label: "Hospitality & Catering Jobs", value: "hospitality-catering-jobs" },
  { label: "Logistics & Warehouse Jobs", value: "logistics-warehouse-jobs" },
  { label: "Retail Jobs", value: "retail-jobs" },
];

const SalaryHistory: React.FC = () => {
  const [salaryData, setSalaryData] = useState<SalaryData | null>(null);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('it-jobs');
  const [loading, setLoading] = useState(false);
  const country = 'us';

  useEffect(() => {
    const fetchSalaryHistory = async () => {
      try {
        setError('');
        setSalaryData(null);
        setLoading(true);

        const response = await axios.get(
          `https://api.adzuna.com/v1/api/jobs/${country}/history`,
          {
            params: {
              app_id: 'eb5d5bed',
              app_key: '5e413592809866c590cb33e535588b40',
              category: selectedCategory,
              months: 12,
              'content-type': 'application/json',
            },
          }
        );

        setSalaryData(response.data);
      } catch (err) {
        console.error("Error fetching salary data:", err);
        setError('Error fetching salary data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryHistory();
  }, [selectedCategory]);

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value);
  };

  const getSortedMonths = (months: Record<string, number>) => {
    return Object.keys(months).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime() // reverse order: recent first
    );
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
  };

  const chartData = salaryData
    ? getSortedMonths(salaryData.month)
        .slice() // create a copy to preserve reverse order for chart (old to recent)
        .reverse()
        .map((month) => ({
          name: formatMonth(month),
          salary: salaryData.month[month],
        }))
    : [];

  return (
    <Box sx={{ pt: 10, minHeight: '100vh', bgcolor: '#f4f6f8', fontFamily: 'Arial, sans-serif' }}>
      <Navbar variant="jobsearch" />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Salary History
        </Typography>

        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
          <FormControl sx={{ minWidth: 250 }}>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={selectedCategory}
              label="Category"
              onChange={handleCategoryChange}
            >
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {!loading && salaryData && (
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} md={6} lg={6}>
                {/* Monthly Salaries */}
                <Grid item xs={12} md={7} lg={7}>
                  <Paper
                    elevation={3}
                    sx={{
                      minWidth: 350,
                      height: 650,
                      display: 'flex',
                      flexDirection: 'column',
                      p: 3,
                      '@media (max-width:450px)': {
                        height: 400,
                        minWidth: 'auto',
                      },
                    }}
                  >
                    <Typography variant="h5" gutterBottom>
                      Monthly Salaries
                    </Typography>
                    <List
                      dense
                      sx={{
                        overflowY: 'auto',
                        flexGrow: 1,
                        fontSize: '1.1rem',
                      }}
                    >
                      {getSortedMonths(salaryData.month).map((month) => (
                        <ListItem key={month}>
                          <ListItemText
                            primary={formatMonth(month)}
                            secondary={
                              <Typography
                                component="span"
                                sx={{ color: '#4dabf5', fontWeight: 'bold' }}
                              >
                                ${salaryData.month[month].toLocaleString()}
                              </Typography>
                            }
                            primaryTypographyProps={{ fontSize: '1.1rem' }}
                            secondaryTypographyProps={{ fontSize: '1rem' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              </Grid>

              <Grid item xs={12} md={6} lg={6}>
                {/* Salary Trend */}
                <Grid item xs={12} md={7} lg={7}>
                  <Paper
                    elevation={3}
                    sx={{
                      minWidth: 350,
                      height: 650,
                      display: 'flex',
                      flexDirection: 'column',
                      p: 3,
                      '@media (max-width:450px)': {
                        height: 400,
                        minWidth: 'auto',
                      },
                    }}
                  >
                    <Typography variant="h5" gutterBottom>
                      Salary Trend
                    </Typography>
                    <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={chartData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" tick={{ fontSize: 14 }} />
                          <YAxis
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                            tick={{ fontSize: 14 }}
                          />
                          <Tooltip
                            formatter={(value: number) => `$${value.toLocaleString()}`}
                            labelFormatter={(label) => `Month: ${label}`}
                          />
                          <Line
                            type="monotone"
                            dataKey="salary"
                            stroke="#3f51b5"
                            strokeWidth={3}
                            dot={{ r: 5 }}
                            activeDot={{ r: 7 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        )}
      </Container>
    </Box>
  );
};

export default SalaryHistory;
