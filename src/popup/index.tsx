import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from '@mui/material';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

import { PageContextProvider } from './contexts/page';
import { IDContextProvider } from './contexts/id';

import EditPage from './pages/edit';
import ListPage from './pages/list';
import PrefPage from './pages/pref';

// ドロワーのメニュー要素
type DrawerMenuProps = {
  select: boolean,
  text: string,
  icon: React.ReactNode,
  onClick: () => void,
};
const DrawerMenu = (props:DrawerMenuProps) => {
  return (
    <ListItemButton selected={props.select} onClick={props.onClick} sx={{width:256}}>
      <ListItemIcon>{props.icon}</ListItemIcon>
      <ListItemText primary={props.text} sx={{flexGrow:1}}/>
    </ListItemButton>
  );
};

// ページ全体の描画
const Main = () => {

  // 状態管理
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState<'list'|'edit'|'pref'>('list');
  const [id, setID] = useState<string|undefined>();

  // 表示するページ
  let showPage:React.ReactNode|undefined;
  switch(page) {
    case 'list': showPage = <ListPage/>; break;
    case 'edit': showPage = <EditPage/>; break;
    case 'pref': showPage = <PrefPage/>; break;
  }

  // ページ遷移
  const changePage = (page:'list'|'edit'|'pref', id?:string) => {
    setPage(page);
    setID(id);
    setDrawerOpen(false);
  };

  // DOMの描画
  return (
    <PageContextProvider value={{page,setPage}}>
      <IDContextProvider value={{id,setID}}>
        {/* ベースラインCSSを設定 */}
        <CssBaseline/>

        {/* アプリケーションバー */}
        <AppBar component='nav' position='static' elevation={0}>
          <Toolbar>
            <IconButton size='large' edge='start' aria-label='menu' sx={{mr:2}} onClick={()=>setDrawerOpen(true)}>
              <MenuIcon/>
            </IconButton>
            <Typography variant='h6' component='div' sx={{flexGrow:1}}>
              CCFOLIA GPT
            </Typography>
          </Toolbar>
        </AppBar>

        {/* ドロワーメニュー */}
        <Drawer role='presentation' open={drawerOpen} onClose={()=>setDrawerOpen(false)}>
          <List>
            <DrawerMenu text='キャラクター一覧' icon={<PersonIcon/>} select={page==='list'} onClick={()=>changePage('list')}/>
            <DrawerMenu text='キャラクター作成' icon={<LibraryAddIcon/>} select={page==='edit'} onClick={()=>changePage('edit')}/>
            <DrawerMenu text='設定' icon={<SettingsIcon/>} select={page==='pref'} onClick={()=>changePage('pref')}/>
          </List>
        </Drawer>

        {/* メインページを表示 */}
        <Box component='main'>
          {showPage}
        </Box>
      </IDContextProvider>
    </PageContextProvider>
  );
};

// ポップアップを描画
const root = document.getElementById('root')!;
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Main/>
  </React.StrictMode>
);