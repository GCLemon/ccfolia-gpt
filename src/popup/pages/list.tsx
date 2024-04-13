import { IconButton, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import React, { useContext, useEffect, useState } from 'react';

import { pageContext } from '@/popup/contexts/page';
import { idContext } from '@/popup/contexts/id';
import { isCRXResponse, isCharacter } from '@/@type-guards';

// キャラクター要素
type CharacterItemProps = {
  index: number,
  character: Character,
};
const CharacterItem = (props:CharacterItemProps) => {

  // 基本情報を整理
  const name = props.character.name;
  const age = typeof props.character.age === 'number'
    ? `${props.character.age} 歳`
    : props.character.age;
  const gender = props.character.gender;

  // 要素の描画
  return (
    <ListItem sx={{
      borderTop: props.index === 0 ? 1 : 0,
      borderBottom: 1,
      borderColor: '#F5F5F5',
    }}>
      <ListItemText primary={name} secondary={age + ' / ' + gender}/>
      <IconButton sx={{ml:2}}><EditIcon/></IconButton>
      <IconButton sx={{ml:2}}><DeleteIcon/></IconButton>
    </ListItem>
  );
};

// イベントリスナー
let getCharacters:(response:any)=>void|undefined;

// キャラクター一覧画面
const ListPage = () => {

  // コンテキストの取得
  const {setPage} = useContext(pageContext);
  const {setID} = useContext(idContext);
  if(!setPage || !setID) { throw new Error('Context uninitialized.'); }

  // 状態管理
  const [characters,setCharacters] = useState<Character[]>([]);

  // 初回更新時に実行
  useEffect(() => {

    // 保存されているイベントリスナーがあるならば削除
    if(getCharacters) { chrome.runtime.onMessage.removeListener(getCharacters); }

    // イベントリスナーを作成→保存→登録
    getCharacters = response => {
      if(isCRXResponse(response) && response.command === 'getCharacters') {
        if(!Array.isArray(response.data)) { throw new Error('Data is not an array.'); }
        if(!response.data.every(isCharacter)) { throw new Error('Inconsistent type of values.'); }
        setCharacters(response.data);
        console.log(response.data);
      }
    };
    chrome.runtime.onMessage.addListener(getCharacters);

    // メッセージを送る
    chrome.runtime.sendMessage<CRXRequest>({command:'getCharacters',argument:{}});
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