import { Button, Grid, Paper, TextField, Typography } from '@mui/material';

import React, { useContext, useEffect, useState } from 'react';

import { onMessageContext } from '@/popup/contexts/on-message';
import { isCRXResponse } from '@/@type-guards';

// 設定画面
const PrefPage = () => {

  // コンテキストの取得
  const {onMessage,setOnMessage} = useContext(onMessageContext);
  if(!setOnMessage) { throw new Error('Context uninitialized.'); }

  // 状態管理
  const [apiKey, setAPIKey] = useState<string|null>(null);
  const [maxRepeat, setMaxRepeat] = useState<number|null>(null);

  // APIキーの変更
  const changeAPIKey = (value:string) => {
    setAPIKey(value);
  };

  // 受け答えの最大回数の変更
  const changeMaxRepeat = (value:string) => {
    setMaxRepeat(Number(value));
  };

  // 設定を保存する
  const savePreference = () => {
    chrome.runtime.sendMessage<CRXRequest>({command:'setPreference',argument:{apiKey,maxRepeat}});
    chrome.runtime.sendMessage<CRXRequest>({command:'getPreference',argument:{}});
  };

  // 初回更新時に実行
  useEffect(() => {

    // 保存されているイベントリスナーがあるならば削除
    if(onMessage) { chrome.runtime.onMessage.removeListener(onMessage); }

    // イベントリスナーを作成→保存→登録
    const newOnMessage = (response:any) => {
      if(isCRXResponse(response) && response.command === 'getPreference') {
        const {apiKey,maxRepeat} = response.data;
        setAPIKey(apiKey);
        setMaxRepeat(maxRepeat);
      }
    };
    setOnMessage(newOnMessage);
    chrome.runtime.onMessage.addListener(newOnMessage);

    // メッセージを送る
    chrome.runtime.sendMessage<CRXRequest>({command:'getPreference',argument:{}});
  }, []);

  // 描画処理
  return (
    <React.Fragment>
      <Paper elevation={6} sx={{m:2,p:3,backgroundColor:'white'}}>
        <Typography variant='h6' marginBottom={1}>設定</Typography>
        <Grid container spacing={2} paddingBottom={2}>
          <Grid item xs={12}>
            <TextField fullWidth variant='standard' label='API キー' value={apiKey ? apiKey : ''} onChange={event=>changeAPIKey(event.target.value)}/>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth type='number' variant='standard' label='受け答えの最大回数' value={maxRepeat ? maxRepeat.toString() : ''} onChange={event=>changeMaxRepeat(event.target.value)}/>
          </Grid>
        </Grid>
        <Button fullWidth variant='outlined' onClick={savePreference}>保存</Button>
      </Paper>
    </React.Fragment>
  );
};

export default PrefPage;