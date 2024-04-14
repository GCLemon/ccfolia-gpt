import { Avatar, Box, Button, Checkbox, IconButton, List, ListItem, ListItemText, Modal, Paper, Tooltip, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import React, { useContext, useEffect, useState } from 'react';

import { idContext } from '@/popup/contexts/id';
import { pageContext } from '@/popup/contexts/page';
import { onMessageContext } from '@/popup/contexts/on-message';
import { isCRXResponse } from '@/@type-guards';

// キャラクター要素
type CharacterItemProps = {
  index: number,
  character: Character,
};
const CharacterItem = (props:CharacterItemProps) => {
 
  // コンテキストの取得
  const {setPage} = useContext(pageContext);
  const {setID} = useContext(idContext);
  if(!setPage || !setID) { throw new Error('Context uninitialized.'); }
  
  // 状態管理
  const [alertOpen,setAlertOpen] = useState(false);

  // キャラクターの編集画面に遷移する
  const edit = () => {
    setID(props.character.id);
    setPage('edit');
  };

  // キャラクターを削除する
  const remove = () => {
    chrome.runtime.sendMessage<CRXRequest>({command:'deleteCharacter',argument:props.character});
    chrome.runtime.sendMessage<CRXRequest>({command:'getAllCharacters',argument:{}});
    setAlertOpen(false);
  };

  // 基本情報を整理
  const name = props.character.name;
  const age = typeof props.character.age === 'number' ? `${props.character.age} 歳` : props.character.age;
  const gender = props.character.gender;

  // 要素の描画
  return (
    <React.Fragment>

      {/* リスト要素 */}
      <ListItem sx={{borderTop:props.index===0?1:0,borderBottom:1,borderColor:'#F5F5F5'}}>
        <Checkbox defaultChecked/>
        <Avatar src='./kkrn_icon_user_1.png' sx={{width:48,height:48,mr:1}}/>
        <ListItemText primary={name} secondary={age + ' / ' + gender}/>
        <Tooltip title='編集' placement='top' arrow>
          <IconButton sx={{ml:2}} onClick={edit}>
            <EditIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title='削除' placement='top' arrow>
          <IconButton sx={{ml:2}} onClick={()=>setAlertOpen(true)}>
            <DeleteIcon/>
          </IconButton>
        </Tooltip>
      </ListItem>

      {/* キャラクターを削除する際のアラート */}
      <Modal open={alertOpen} onClose={()=>setAlertOpen(false)}>
        <Paper elevation={6} sx={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:270, backgroundColor:'white'}}>
          <Box sx={{borderBottom:1,p:2,borderColor:'#F5F5F5'}}>
            <Typography variant='h6' marginBottom={1}>キャラクター削除</Typography>
            <Typography>この操作は元に戻せません。</Typography>
            <Typography>キャラクターを削除しますか？</Typography>
          </Box>
          <Box sx={{display:'flex',justifyContent:'center'}}>
            <Button sx={{m:1}} color='error' onClick={remove}>削除</Button>
            <Button sx={{m:1}} onClick={()=>setAlertOpen(false)}>キャンセル</Button>
          </Box>
        </Paper>
      </Modal>

    </React.Fragment>
  );
};

// キャラクター一覧画面
const ListPage = () => {

  // コンテキストの取得
  const {onMessage,setOnMessage} = useContext(onMessageContext);
  if(!setOnMessage) { throw new Error('Context uninitialized.'); }

  // 状態管理
  const [characters,setCharacters] = useState<Character[]>([]);

  // 初回更新時に実行
  useEffect(() => {

    // 保存されているイベントリスナーがあるならば削除
    if(onMessage) { chrome.runtime.onMessage.removeListener(onMessage); }

    // イベントリスナーを作成→保存→登録
    const newOnMessage = (response:any) => {
      if(isCRXResponse(response) && response.command === 'getAllCharacters') {
        setCharacters(response.data);
      }
    };
    setOnMessage(newOnMessage);
    chrome.runtime.onMessage.addListener(newOnMessage);

    // メッセージを送る
    chrome.runtime.sendMessage<CRXRequest>({command:'getAllCharacters',argument:{}});
  }, []);

  // 表示したいリストを設定
  const showList = characters.length > 0
    ? <List>{characters.map((value,index) => <CharacterItem key={index} index={index} character={value}/>)}</List>
    : <Typography padding={2}>※「キャラクター作成」から喋らせたいキャラクターを作りましょう！</Typography>;

  // 描画処理
  return (
    <React.Fragment>
      <Paper elevation={6} sx={{m:2,backgroundColor:'white'}}>
        {showList}
      </Paper>
    </React.Fragment>
  );
};

export default ListPage;