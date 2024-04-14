import { isCRXRequest } from '@/@type-guards';

let apiKey:string|null = null;
let maxRepeat:number|null = null;

// 設定を取得する
export function getPreference(tabID:number) {
  const response:CRXResponse = {
    command: 'getPreference',
    data: {apiKey,maxRepeat},
  };
  chrome.tabs.sendMessage<CRXResponse>(tabID, response);
}

// 設定を更新する
export function setPreference(tabID:number, argument:{apiKey:string|null,maxRepeat:number|null}) {

  // 設定を更新
  apiKey = argument.apiKey;
  maxRepeat = argument.maxRepeat;

  // ポップアップに返す
  const response:CRXResponse = {
    command: 'setPreference',
    data: {},
  };
  chrome.tabs.sendMessage<CRXResponse>(tabID, response);
}

// メッセージを受け取ったときのイベントリスナーを追加
chrome.runtime.onMessage.addListener((message,sender) => {
  if(sender.tab?.id && isCRXRequest(message)) {
    switch(message.command) {
      case 'getPreference':
        getPreference(sender.tab.id);
        break;
      case 'setPreference':
        setPreference(sender.tab.id, message.argument);
        break;
      default:
        break;
    }
  }
});
