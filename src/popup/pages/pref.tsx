import { Grid, Paper, TextField, Typography } from '@mui/material';

import React from 'react';

// 設定画面
const PrefPage = () => {

  return (
    <React.Fragment>
      <Paper elevation={6} sx={{m:2,p:3,backgroundColor:'white'}}>
        <Typography variant='h6' marginBottom={1}>設定</Typography>
        <Grid container spacing={2} paddingBottom={2}>
          <Grid item xs={12}>
            <TextField fullWidth variant='standard' label='API キー'/>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth type='number' variant='standard' label='受け答えの最大回数'/>
          </Grid>
        </Grid>
      </Paper>
    </React.Fragment>
  );
};

export default PrefPage;