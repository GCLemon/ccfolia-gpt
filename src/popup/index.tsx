import { AppBar, Box, CssBaseline, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

import { IDContextProvider } from './contexts/id';
import { PageContextProvider } from './contexts/page';
import { OnMessageContextProvider } from './contexts/on-message';

import EditPage from './pages/edit';
import ListPage from './pages/list';
import PrefPage from './pages/pref';

// ドロワーのメニュー要素
type DrawerMenuProps = {
  text: string,
  icon: React.ReactNode,
  onClick: () => void,
};
const DrawerMenu = (props:DrawerMenuProps) => {
  return (
    <ListItemButton onClick={props.onClick} sx={{width:256}}>
      <ListItemIcon>{props.icon}</ListItemIcon>
      <ListItemText primary={props.text} sx={{flexGrow:1}}/>
    </ListItemButton>
  );
};

// ページ全体の描画
const Main = () => {

  // 状態管理
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [id, setID] = useState<string|null>();
  const [page, setPage] = useState<'list'|'edit'|'pref'>('list');
  const [onMessage, setOnMessage] = useState<(response:any)=>void>();

  // 表示するページ
  let showPage:React.ReactNode|undefined;
  switch(page) {
    case 'list': showPage = <ListPage/>; break;
    case 'edit': showPage = <EditPage/>; break;
    case 'pref': showPage = <PrefPage/>; break;
  }

  // ページ遷移
  const changePage = (page:'list'|'edit'|'pref') => {
    setID(null);
    setPage(page);
    setDrawerOpen(false);
  };

  // DOMの描画
  return (
    <OnMessageContextProvider value={{onMessage,setOnMessage}}>
      <IDContextProvider value={{id,setID}}>
        <PageContextProvider value={{page,setPage}}>

          {/* ベースラインCSSを設定 */}
          <CssBaseline/>

          {/* アプリケーションバー */}
          <AppBar component='nav' position='fixed' elevation={6}>
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
              <DrawerMenu text='キャラクター一覧' icon={<PersonIcon/>} onClick={()=>changePage('list')}/>
              <DrawerMenu text='キャラクター作成' icon={<LibraryAddIcon/>} onClick={()=>changePage('edit')}/>
              <DrawerMenu text='設定' icon={<SettingsIcon/>} onClick={()=>changePage('pref')}/>
            </List>
          </Drawer>

          {/* メインページを表示 */}
          <Toolbar/>
          <Box component='main'>
            {showPage}
          </Box>

        </PageContextProvider>
      </IDContextProvider>
    </OnMessageContextProvider>
  );
};

// ポップアップを描画
const root = document.getElementById('root')!;
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Main/>
  </React.StrictMode>
);