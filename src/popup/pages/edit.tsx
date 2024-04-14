import { Autocomplete, Box, Button, Grid, IconButton, List, ListItem, Paper, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import React, { useContext, useRef, useState } from 'react';

import { onMessageContext } from '@/popup/contexts/on-message';
import { isCRXResponse } from '@/@type-guards';

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

  // アップロードに対する参照
  const uploadRef = useRef<HTMLInputElement>(null);

  // 初回更新時に実行
  React.useEffect(() => {

    // 保存されているイベントリスナーがあるならば削除
    if(onMessage) { chrome.runtime.onMessage.removeListener(onMessage); }

    // イベントリスナーを作成→保存→登録
    const newOnMessage = (response:any) => {
      if(isCRXResponse(response) && (response.command === 'createCharacter' || response.command === 'getCharacterByID')) {
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

    // 画像を探すダイアログを開く
    const findImage = () => {
      if(uploadRef.current) {
        uploadRef.current.click();
      }
    }

    // 画像のアップロード
    const uploadImage = (value:FileList|null) => {
      if(value) {
        const reader = new FileReader();
        reader.readAsDataURL(value[0]);
        reader.onload = () => {
          if(reader.result) {
            const blob = new Blob([reader.result], {type:value[0].type});
            console.log(blob.size);
            console.log(blob.type);
          }
        };
      }
    };

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

    // 一人称・二人称の変更
    const changeFirstPerson = (value:string) => setCharacter({...character,firstPerson:value});
    const changeSecondPerson = (value:string) => setCharacter({...character,secondPerson:value});

    // 性格の変更
    const changePerson = (value:string) => setCharacter({...character,personality:value});

    // 経歴の変更
    const changeHistory = (value:string) => setCharacter({...character,history:value});

    // 口調・行動指針の変更
    const changeExpression = (value:string) => setCharacter({...character,expression:value});
    const changePrinciple = (value:string) => setCharacter({...character,principle:value});

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

    // キャラクターの保存
    const saveCharacter = () => {
      chrome.runtime.sendMessage<CRXRequest>({command:'updateCharacter',argument:character});
    }

    // 描画処理
    return (
      <React.Fragment>

        {/* キャラクター情報 */}
        <Paper elevation={6} sx={{m:2,p:3,backgroundColor:'white'}}>
          <Typography variant='h6' marginBottom={1}>キャラクター情報</Typography>
          <Grid container spacing={2} marginBottom={2}>
            <Grid item xs={3.5}>
              <Box sx={{display:'flex',flexDirection:'column'}}>
                <img src='./kkrn_icon_user_1.png' style={{width:'100%'}}/>
                <Box m='auto'>
                  <input ref={uploadRef} type='file' accept='image/*,.png,.jpg,.jpeg' style={{display:'none'}} onChange={event=>uploadImage(event.target.files)}/>
                  <Button variant='outlined' startIcon={<EditIcon/>} onClick={findImage}>
                    画像の設定
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item container xs={8.5} spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth variant='standard' label='名前' value={character.name} onChange={event=>changeName(event.target.value)}/>
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth variant='standard' label='年齢' value={character.age.toString()} onChange={event=>changeAge(event.target.value)}/>
              </Grid>
              <Grid item xs={6}>
                <Autocomplete options={genders} renderInput={params=><TextField {...params} fullWidth variant='standard' label='性別' onChange={event=>changeGender(event.target.value)}/>} value={character.gender}/>
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth variant='standard' label='一人称' value={character.firstPerson} onChange={event=>changeFirstPerson(event.target.value)}/>
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth variant='standard' label='二人称' value={character.secondPerson} onChange={event=>changeSecondPerson(event.target.value)}/>
              </Grid>
            </Grid>
          </Grid>
          <TextField multiline fullWidth variant='outlined' label='性格' margin='normal' rows={5} value={character.personality} onChange={event=>changePerson(event.target.value)}/>
        </Paper>

        {/* 口調・行動指針 */}
        <Paper elevation={6} sx={{m:2,p:3,backgroundColor:'white'}}>
          <Typography variant='h6' marginBottom={1}>口調・行動指針</Typography>
          <TextField multiline fullWidth variant='outlined' label='口調' margin='normal' rows={5} value={character.expression} onChange={event=>changeExpression(event.target.value)}/>
          <TextField multiline fullWidth variant='outlined' label='行動指針' margin='normal' rows={5} value={character.principle} onChange={event=>changePrinciple(event.target.value)}/>
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

        {/* 経歴・その他 */}
        <Paper elevation={6} sx={{m:2,p:3,backgroundColor:'white'}}>
          <Typography variant='h6' marginBottom={1}>経歴・その他</Typography>
          <TextField multiline fullWidth variant='outlined' label='経歴・その他' margin='normal' rows={5} value={character.history} onChange={event=>changeHistory(event.target.value)}/>
        </Paper>

        {/* 保存ボタン */}
        <Paper elevation={6} sx={{m:2,p:3,backgroundColor:'white'}}>
          <Button fullWidth variant='outlined' onClick={saveCharacter}>保存</Button>
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