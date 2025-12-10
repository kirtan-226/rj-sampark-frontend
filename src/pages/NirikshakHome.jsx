import React, { useState } from 'react'
import Header from '../components/Header'
import SupervisorMandals from '../components/SupervisorMandals';
import { Box, CardContent, Chip, Grid, Paper, TextField, Typography } from '@mui/material';
import { Button, Card } from 'reactstrap';
import SupervisorTeams from '../components/SupervisorTeams';

const NirikshakHome = () => {

  return (
    <>
      <Header />
      <h4 style={{ margin: "22px" }}>Teams under your supervision (Nirikshak)</h4>
      <SupervisorTeams />
    </>
  );
}

export default NirikshakHome