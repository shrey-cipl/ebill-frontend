// 404.js

import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <Container maxWidth="sm"  sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh', // Adjust as needed
    }}>
   
      <img src="download.png" alt=""  width={300}/>
      <Typography variant="h1" gutterBottom sx={{
        color:"#df4516"
      }}>
        404 - Not Found
      </Typography>
      <Typography variant="body1" paragraph>
        The page you are looking for does not exist.
      </Typography>
      <Link href="/" passHref>
        <Button variant="contained" color="primary" sx={{
        backgroundColor:"#df4516"
      }}>
          Return to Home
        </Button>
      </Link>
      {/* You can add additional information or links as needed */}
    </Container>
  );
};

export default NotFoundPage;
