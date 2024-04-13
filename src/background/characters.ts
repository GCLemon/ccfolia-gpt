import { isCRXRequest, isCharacter } from '@/@type-guards';

// キャラクター情報を保存
const characters:Character[] = [];

// 全てのキャラクターを取得
function getAllCharacters(tabID:number) {
  const response:CRXResponse = {
    command: 'getAllCharacters',
    data: characters,
  };
  chrome.tabs.sendMessage<CRXResponse>(tabID, response);
}

// キャラクターをIDで取得
function getCharacterByID(tabID:number, argument:object) {

  // 文字列"id"があれば、キャラクターを探してポップアップに返す
  if('id' in argument && typeof argument.id === 'string') {
    const character = characters.find(v => v.id === argument.id);
    if(!character) { throw new Error('Specified character not found.'); }
    const response:CRXResponse = {
      command: 'getCharacterByID',
      data: character,
    };
    chrome.tabs.sendMessage<CRXResponse>(tabID, response);
  }

  // それ以外はエラー
  else {
    throw new Error('Missing or invalid argument.');
  }
}

// キャラクターを作成
function createCharacter(tabID:number) {

  // 20桁のIDを生成
  const generateID = () => {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id:string = '';
    do { id = [...Array(20)].map(_ => letters[Math.floor(Math.random() * letters.length)]).join(''); }
    while (characters.some(v => v.id === id));
    return id;
  }
  
  // キャラクターを生成
  const character:Character = {
    id: generateID(),
    name: '',
    age: '',
    gender: '不明',
    person: '',
    history: '',
    voices: [],
  };

  // キャラクターを追加
  characters.push(character);

  // ポップアップに返す
  const response:CRXResponse = {
    command: 'createCharacter',
    data: character,
  };
  chrome.tabs.sendMessage<CRXResponse>(tabID, response);
}

// キャラクターを更新
function updateCharacter(tabID:number, argument:object) {
  
  // 引数にキャラクター情報が入っていた場合は、更新してポップアップに返す
  if(isCharacter(argument)) {
    const index = characters.findIndex(v => v.id === argument.id);
    if(index === -1) { throw new Error('Specified character not found.'); }
    characters[index] = argument;
    const response:CRXResponse = {
      command: 'updateCharacter',
      data: {},
    };
    chrome.tabs.sendMessage<CRXResponse>(tabID, response);
  }

  // それ以外はエラー
  else {
    throw new Error('Missing or invalid argument.');
  }
}

// キャラクターを削除
function deleteCharacter(tabID:number, argument:object) {

  // 文字列"id"があれば、キャラクターを削除ポップアップに返す
  if('id' in argument && typeof argument.id === 'string') {
    const index = characters.findIndex(v => v.id === argument.id);
    if(index === -1) { throw new Error('Specified character not found.'); }
    characters.splice(index, 1);
    const response:CRXResponse = {
      command: 'deleteCharacter',
      data: {},
    };
    chrome.tabs.sendMessage<CRXResponse>(tabID, response);
  }

  // それ以外はエラー
  else {
    throw new Error('Missing or invalid argument.');
  }
}

// メッセージを受け取ったときのイベントリスナーを追加
chrome.runtime.onMessage.addListener((message,sender) => {
  if(sender.tab?.id && isCRXRequest(message)) {
    switch(message.command) {
      case 'getAllCharacters':
        getAllCharacters(sender.tab.id);
        break;
      case 'getCharacterByID':
        getCharacterByID(sender.tab.id, message.argument);
        break;
      case 'createCharacter':
        createCharacter(sender.tab.id);
        break;
      case 'updateCharacter':
        updateCharacter(sender.tab.id, message.argument);
        break;
      case 'deleteCharacter':
        deleteCharacter(sender.tab.id, message.argument);
        break;
      default:
        break;
    }
  }
});