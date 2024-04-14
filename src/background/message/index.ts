import { isCRXRequest } from '@/@type-guards';

import getCharacter from '../character';
import characterSpeech from './generate';

// メッセージをルームIDごとに保存
const messages:{[key:string]:CCMessage[]} = {};

// 会話を生成する
function generate(tabID:number, message:{roomID:string}&CCMessage) {

  // メッセージ情報を取得
  const {roomID,person,content} = message;

  // メッセージを保存
  if(!(roomID in messages)) { messages[roomID] = []; }
  messages[roomID].push({person,content});

  // キャラクター情報を取得
  const {characters} = getCharacter();

  // キャラクターの発言を生成する
  characterSpeech(messages[roomID], characters[0].name).then(content => {

    // 取得したキャラクターをポップアップに返す
    const response:CRXResponse = {
      command: 'generate',
      data: {
        person: characters[0].name,
        content: content
      },
    };
    chrome.tabs.sendMessage<CRXResponse>(tabID, response);
});
}

// メッセージを受け取ったときのイベントリスナーを追加
chrome.runtime.onMessage.addListener((message,sender) => {
  if(sender.tab?.id && isCRXRequest(message)) {
    switch(message.command) {
      case 'generate': generate(sender.tab.id, message.argument); break;
      default: break;
    }
  }
});
