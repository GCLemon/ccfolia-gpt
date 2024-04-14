import { isCRXRequest } from '@/@type-guards';
import characterPrompt from './generate';

// キャラクター情報を保存
const characters:Character[] = [];
const prompts:CharacterPrompt[] = [];

// キャラクタープロンプトを取得する
export default function getCharacter() {
  return {characters,prompts};
}

// 全てのキャラクターを取得
function getAllCharacters(tabID:number) {
  const response:CRXResponse = {
    command: 'getAllCharacters',
    data: characters,
  };
  chrome.tabs.sendMessage<CRXResponse>(tabID, response);
}

// キャラクターをIDで取得
function getCharacterByID(tabID:number, argument:{id:string}) {

  // キャラクターを探して、なければエラー
  const character = characters.find(v => v.id === argument.id);
  if(!character) { throw new Error('Specified character not found.'); }

  // 取得したキャラクターをポップアップに返す
  const response:CRXResponse = {
    command: 'getCharacterByID',
    data: character,
  };
  chrome.tabs.sendMessage<CRXResponse>(tabID, response);
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
    firstPerson:'',
    secondPerson:'',
    personality: '',
    history: '',
    expression: '',
    principle: '',
    voices: [],
  };

  // ダミーのプロンプトを生成
  const prompt:CharacterPrompt = {
    id: character.id,
    prompt: '',
  };

  // キャラクターを追加
  characters.push(character);
  prompts.push(prompt);

  // ポップアップに返す
  const response:CRXResponse = {
    command: 'createCharacter',
    data: character,
  };
  chrome.tabs.sendMessage<CRXResponse>(tabID, response);
}

// キャラクターを更新
function updateCharacter(tabID:number, argument:Character) {

  // キャラクターを探して、なければエラー
  const index = characters.findIndex(v => v.id === argument.id);
  if(index === -1) { throw new Error('Specified character not found.'); }

  // キャラクターを更新してポップアップに返す
  characters[index] = argument;
  const response:CRXResponse = {
    command: 'updateCharacter',
    data: {},
  };
  chrome.tabs.sendMessage<CRXResponse>(tabID, response);

  // キャラクタープロンプトを生成
  characterPrompt(argument).then(prompt => prompts[index] = {id:argument.id, prompt:prompt})
}

// キャラクターを削除
function deleteCharacter(tabID:number, argument:{id:string}) {

  // キャラクターを探して、なければエラー
  const index = characters.findIndex(v => v.id === argument.id);
  if(index === -1) { throw new Error('Specified character not found.'); }

  // キャラクターを削除してポップアップに返す
  characters.splice(index, 1);
  const response:CRXResponse = {
    command: 'deleteCharacter',
    data: {},
  };
  chrome.tabs.sendMessage<CRXResponse>(tabID, response);
}

// メッセージを受け取ったときのイベントリスナーを追加
chrome.runtime.onMessage.addListener((message,sender) => {
  if(sender.tab?.id && isCRXRequest(message)) {
    switch(message.command) {
      case 'getAllCharacters': getAllCharacters(sender.tab.id); break;
      case 'getCharacterByID': getCharacterByID(sender.tab.id, message.argument); break;
      case 'createCharacter': createCharacter(sender.tab.id); break;
      case 'updateCharacter': updateCharacter(sender.tab.id, message.argument); break;
      case 'deleteCharacter': deleteCharacter(sender.tab.id, message.argument); break;
      default: break;
    }
  }
});