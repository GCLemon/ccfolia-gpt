import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import React from 'react';

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

// キャラクター一覧画面
const ListPage = () => {
  return (
    <React.Fragment>
      <Paper elevation={6} sx={{m:2,backgroundColor:'white'}}>
        <List>
        </List>
      </Paper>
    </React.Fragment>
  );
};

export default ListPage;