import React, { useState } from 'react'
import Header from '../components/Header'
import SupervisorMandals from '../components/SupervisorMandals';
import { Box, CardActionArea, CardContent, Chip, Grid, Paper, TextField, Typography } from '@mui/material';
import { Button, Card } from 'reactstrap';

const NirikshakHome = () => {

  const sevakDetails = JSON.parse(localStorage.getItem("sevakDetails") || "{}");

  return (
    <>
      <Header />
      <h4 style={{ margin: "22px" }}>{sevakDetails?.role}</h4>
      {/* <div style={{ padding: "20px 15px" }}>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={4} md={3}>
            <Card
              sx={{
                height: 200,
                background: "#ff6b6b",
                color: "#fff",
                borderRadius: 2,
                boxShadow: 2,
                ":hover": {
                  boxShadow: 5,
                  transform: "scale(1.03)",
                  transition: "0.25s",
                },
              }}
            >
              <CardActionArea
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => navigate("/manage-mandal-yuvaks")}
              >
                <CardContent sx={{ textAlign: "center", p: 1 }}>
                  <Typography fontSize={14} fontWeight="bold">
                    Mandal
                  </Typography>
                  <Typography fontSize={12} noWrap>
                    Add Mandal Yuvak
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={6} sm={4} md={3}>
            <Card
              sx={{
                height: 200,
                background: "#4dabf7",
                color: "#fff",
                borderRadius: 2,
                boxShadow: 2,
                ":hover": {
                  boxShadow: 5,
                  transform: "scale(1.03)",
                  transition: "0.25s",
                },
              }}
            >
              <CardActionArea
                sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                onClick={() => navigate("/manage-mandal-teams")}
              >
                <CardContent sx={{ textAlign: "center", p: 1 }}>
                  <Typography fontSize={14} fontWeight="bold">
                    Teams
                  </Typography>
                  <Typography fontSize={12} noWrap>
                    View &amp; Create Teams
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={6} sm={4} md={3}>
            <Card
              sx={{
                height: 200,
                background: "#845ef7",
                color: "#fff",
                borderRadius: 2,
                boxShadow: 2,
                ":hover": {
                  boxShadow: 5,
                  transform: "scale(1.03)",
                  transition: "0.25s",
                },
              }}
            >
              <CardActionArea
                sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                onClick={() => navigate("/sampark-yuvak-team-wise")}
              >
                <CardContent sx={{ textAlign: "center", p: 1 }}>
                  <Typography fontSize={14} fontWeight="bold">
                    Show Details
                  </Typography>
                  <Typography fontSize={12} noWrap>
                    Sampark Yuvak Details
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </div> */}
    </>
  );
}

export default NirikshakHome