import { Autocomplete, Grid, IconButton, List, ListItem, Paper, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import React, { useContext, useState } from 'react';

import { onMessageContext } from '@/popup/contexts/on-message';
import { isCRXResponse, isCharacter } from '@/@type-guards';

// キャラクター編集画面
type EditPageProps = {
  id:string|null,
};
const EditPage = (props:EditPageProps) => {

  // コンテキストの取得
  const {onMessage,setOnMessage} = useContext(onMessageContext);
  if(!setOnMessage) { throw new Error('Context uninitialized.'); }

  // 状態管理
  const [character,setCharacter] = useState<Character>();

  // 初回更新時に実行
  React.useEffect(() => {

    // 保存されているイベントリスナーがあるならば削除
    if(onMessage) { chrome.runtime.onMessage.removeListener(onMessage); }

    // イベントリスナーを作成→保存→登録
    const newOnMessage = (response:any) => {
      if(isCRXResponse(response) && (response.command === 'createCharacter' || response.command === 'getCharacterByID')) {
        if(!isCharacter(response.data)) { throw new Error('Invalid type of value.'); }
        setCharacter(response.data);
      }
    };
    setOnMessage(newOnMessage);
    chrome.runtime.onMessage.addListener(newOnMessage);

    // メッセージを送る
    if(props.id) { chrome.runtime.sendMessage<CRXRequest>({command:'getCharacterByID',argument:{id:props.id}}); }
    else { chrome.runtime.sendMessage<CRXRequest>({command:'createCharacter',argument:{}}); }
  }, []);

  // キャラクターが取得できた場合の処理
  if(character) {

    // 名前の変更
    const changeName = (value:string) => setCharacter({...character,name:value});

    // 年齢の変更
    const changeAge = (value:string) => {
      const numberValue = Number(value);
      setCharacter({...character,age:isNaN(numberValue)?value:numberValue});
    }

    // 性別の変更
    const genders = ['男性','女性','両性','中性','無性','不定','不明'] as const;
    const changeGender = (value:string) => {
      const isGender = (value:string): value is typeof genders[number] => value in genders;
      if(isGender(value)) { setCharacter({...character,gender:value}) }
    }

    // 性格の変更
    const changePerson = (value:string) => setCharacter({...character,person:value});

    // 経歴の変更
    const changeHistory = (value:string) => setCharacter({...character,history:value});

    // サンプルボイスの変更
    const appendVoices = (voice:string) => {
      const newVoices = [...character.voices, voice];
      setCharacter({...character,voices:newVoices});
    }
    const updateVoices = (index:number, voice:string) => {
      const newVoices = character.voices.map((v,i) => i === index ? voice : v);
      setCharacter({...character,voices:newVoices});
    };
    const deleteVoices = (index:number) => {
      const newVoices = character.voices.filter((_,i) => i !== index);
      setCharacter({...character,voices:newVoices});
    };

    // 描画処理
    return (
      <React.Fragment>

        {/* キャラクター情報 */}
        <Paper elevation={6} sx={{m:2,p:3,backgroundColor:'white'}}>
          <Typography variant='h6' marginBottom={1}>キャラクター情報</Typography>
          <Grid container spacing={2} paddingBottom={2}>
            <Grid item xs={12}><TextField fullWidth variant='standard' label='名前' value={character.name} onChange={event=>changeName(event.target.value)}/></Grid>
            <Grid item xs={6}>
              <TextField fullWidth variant='standard' label='年齢' value={character.age.toString()} onChange={event=>changeAge(event.target.value)}/>
            </Grid>
            <Grid item xs={6}>
              <Autocomplete options={genders} renderInput={params=><TextField {...params} fullWidth variant='standard' label='性別' onChange={event=>changeGender(event.target.value)}/>} value={character.gender}/>
            </Grid>
          </Grid>
          <TextField multiline fullWidth variant='outlined' label='性格' margin='normal' rows={5} value={character.person} onChange={event=>changePerson(event.target.value)}/>
          <TextField multiline fullWidth variant='outlined' label='過去' margin='normal' rows={5} value={character.history} onChange={event=>changeHistory(event.target.value)}/>
        </Paper>

        {/* サンプルボイス */}
        <Paper elevation={6} sx={{m:2,p:3,backgroundColor:'white'}}>
          <Typography variant='h6' marginBottom={1}>サンプルボイス</Typography>
          <List>
            {character.voices.map((v,i) =>
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
  }

  // キャラクターを取得できるまで何も処理せず、何も描画しない
  else {
    return (
      <React.Fragment>
      </React.Fragment>
    );
  }
};

export default EditPage;