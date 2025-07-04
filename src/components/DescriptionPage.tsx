import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Button, Grid, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type House = {
  id: string;
  name: string;
  address: string;
  coords: [number, number];
  price?: number; // optional price or rent
};

function DescriptionPage() {
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [houses, setHouses] = useState<House[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const selectedJob = localStorage.getItem('selectedJob');
    if (selectedJob) {
      const job = JSON.parse(selectedJob);
      setJobDetails(job);
      fetchCoordinates(job.location.display_name, job.salary_max || job.salary_min);
    } else {
      setError('No job details found');
      setLoading(false);
    }
  }, []);

  const fetchCoordinates = async (location: string, maxSalary?: number) => {
    const apiKey = 'f7dc9d3449a243498e52e3bc55b4d9fb';
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&apiKey=${apiKey}`
      );
      const data = await response.json();
      const coords = data?.features?.[0]?.geometry?.coordinates;
      if (coords) {
        const latLon: [number, number] = [coords[1], coords[0]];
        setCoords(latLon);
        if (maxSalary) {
          fetchNearbyHouses(latLon, maxSalary);
        }
      } else {
        setError('Failed to get coordinates for location');
      }
    } catch (err) {
      setError('Error fetching coordinates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch nearby inns using Geoapify Places API
  // Filter by affordability based on maxSalary passed (assumes price or rent attribute available)
  const fetchNearbyHouses = async (latLon: [number, number], maxSalary: number) => {
    const apiKey = 'f7dc9d3449a243498e52e3bc55b4d9fb';
    const radiusMeters = 50000; // 50 km radius
    const [lat, lon] = latLon;

    // Places API endpoint for accommodations
    const url = `https://api.geoapify.com/v2/places?categories=accommodation&filter=circle:${lon},${lat},${radiusMeters}&limit=20&apiKey=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Places API error: ${response.status}`);
      const data = await response.json();

      // Extract houses and filter affordability
      const places = data.features.map((feature: any) => {
        const properties = feature.properties;
        return {
          id: feature.properties.place_id,
          name: properties.name || 'Unnamed',
          address: properties.address_line1 || properties.formatted || 'No address',
          coords: [properties.lat, properties.lon] as [number, number],
          price: properties.price, // might be undefined
        };
      });

      // Filter houses by price <= maxSalary (or some fraction, e.g., max 30% of salary)
      // For demo, assume rent/price <= 30% of maxSalary is affordable
      const affordableHouses = places.filter(house => {
        if (!house.price) return true; // if no price info, keep it for now
        return house.price <= maxSalary * 0.3;
      });

      setHouses(affordableHouses);
    } catch (err) {
      console.error('Failed to fetch nearby houses:', err);
    }
  };

  const handleBackToList = () => {
    navigate(-1);
  };

  const formatSalary = (min: number | undefined, max: number | undefined) => {
    if (min && max) {
      return `$${min.toLocaleString('en-US')} - $${max.toLocaleString('en-US')}`;
    } else if (min) {
      return `From $${min.toLocaleString('en-US')}`;
    } else if (max) {
      return `Up to $${max.toLocaleString('en-US')}`;
    }
    return 'Not Disclosed';
  };

  return (
    <Box
      sx={{
        pt: 10,
        px: 3,
        pb: 6,
        mx: 'auto',
        maxWidth: '1200px',
        bgcolor: '#f4f6f8',
        fontFamily: 'Arial, sans-serif',
        minHeight: '100vh',
      }}
    >
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" align="center" sx={{ my: 2 }}>
          {error}
        </Typography>
      )}

      {jobDetails && (
        <Box>
          {/* Header Section */}
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {jobDetails.title}
          </Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {jobDetails.company.display_name}
          </Typography>

          {/* Job Details Section */}
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Location:</strong> {jobDetails.location?.display_name || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Salary:</strong> {formatSalary(jobDetails.salary_min, jobDetails.salary_max)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Job Type:</strong> {jobDetails.contract_time || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Category:</strong> {jobDetails.category?.label || 'N/A'}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" gutterBottom>
            Job Description
          </Typography>
          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              lineHeight: 1.6,
            }}
          >
            {jobDetails.description || 'No description available.'}
          </Typography>

          {/* Map Section */}
          {coords && (
            <Box sx={{ mt: 4, height: '400px' }}>
              <Typography variant="h6" gutterBottom>
                Location on Map
              </Typography>
              <MapContainer center={coords} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.geoapify.com/">Geoapify</a> contributors'
                  url={`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=f7dc9d3449a243498e52e3bc55b4d9fb`}
                />
                <Marker position={coords}>
                  <Popup>Job Location</Popup>
                </Marker>

                {/* Render markers for houses */}
                {houses.map((house) => (
                  <Marker key={house.id} position={house.coords}>
                    <Popup>
                      <strong>{house.address}</strong>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </Box>
          )}

          {/* Buttons */}
          <Box sx={{ mt: 6, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {jobDetails.redirect_url && (
              <Button
                variant="outlined"
                color="secondary"
                href={jobDetails.redirect_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Adzuna
              </Button>
            )}
            <Button variant="contained" color="primary" onClick={handleBackToList}>
              Back to Job List
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default DescriptionPage;
