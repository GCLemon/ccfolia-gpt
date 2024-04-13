import { Autocomplete, Grid, IconButton, List, ListItem, Paper, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import React, { useState } from 'react';

// キャラクター編集画面
type EditPageProps = {
  id?:string,
};
const EditPage = (props:EditPageProps) => {
  
  const [name, setName] = useState('');

  const genders = ['男性','女性','両性','中性','無性','不定','不明'] as const;
  
  const [voices, setVoices] = useState<string[]>([]);
  const appendVoices = (voice:string) => {
    const newVoices = [...voices, voice];
    setVoices(newVoices);
  }
  const updateVoices = (index:number, voice:string) => {
    const newVoices = voices.map((v,i) => i === index ? voice : v);
    setVoices(newVoices);
  };
  const deleteVoices = (index:number) => {
    const newVoices = voices.filter((_,i) => i !== index);
    setVoices(newVoices);
  };

  return (
    <React.Fragment>

      {/* キャラクター情報 */}
      <Paper elevation={6} sx={{m:2,p:3,backgroundColor:'white'}}>
        <Typography variant='h6' marginBottom={1}>キャラクター情報</Typography>
        <Grid container spacing={2} paddingBottom={2}>
          <Grid item xs={12}><TextField fullWidth variant='standard' label='名前'/></Grid>
          <Grid item xs={6}>
            <TextField fullWidth variant='standard' label='年齢'/>
          </Grid>
          <Grid item xs={6}>
            <Autocomplete options={genders} renderInput={params=><TextField {...params} fullWidth variant='standard' label='性別'/>}/>
          </Grid>
        </Grid>
        <TextField multiline fullWidth variant='outlined' label='性格' margin='normal' rows={5}/>
        <TextField multiline fullWidth variant='outlined' label='過去' margin='normal' rows={5}/>
      </Paper>

      {/* サンプルボイス */}
      <Paper elevation={6} sx={{m:2,p:3,backgroundColor:'white'}}>
        <Typography variant='h6' marginBottom={1}>サンプルボイス</Typography>
        <List>
          {voices.map((v,i) =>
            <ListItem key={i} sx={{pl:0,pr:0}}>
              <Typography sx={{mb:'auto',pr:0.5}}>「</Typography>
              <TextField multiline fullWidth variant='standard' minRows={1} value={v} onChange={event=>updateVoices(i,event.target.value)}/>
              <Typography sx={{mt:'auto',pl:1}}>」</Typography>
              <IconButton sx={{ml:2}} onClick={()=>deleteVoices(i)}><DeleteIcon/></IconButton>
            </ListItem>
          )}
          <ListItem sx={{pl:0,pr:0}}>
            <IconButton sx={{ml:'auto'}} onClick={()=>appendVoices('')}><AddIcon/></IconButton>
          </ListItem>
        </List>
      </Paper>

    </React.Fragment>
  );

};

export default EditPage;