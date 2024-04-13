import { isCRXRequest } from '@/@type-guards';

let apiKey:string|null = null;
let maxRepeat:number|null = null;

// 設定を取得する
function getPreference(tabID:number) {
  const response:CRXResponse = {
    command: 'getPreference',
    data: {apiKey,maxRepeat},
  };
  chrome.tabs.sendMessage<CRXResponse>(tabID, response);
}

// 設定を更新する
function setPreference(tabID:number, argument:object) {
  if('apiKey' in argument && typeof argument.apiKey ==='string') { apiKey = argument.apiKey; }
  if('maxRepeat' in argument && typeof argument.maxRepeat === 'number') { maxRepeat = argument.maxRepeat; }
  const response:CRXResponse = {
    command: 'setPreference',
    data: {},
  };
  chrome.tabs.sendMessage<CRXResponse>(tabID, response);
}

// メッセージを受け取ったときのイベントリスナーを追加
chrome.runtime.onMessage.addListener((message,sender) => {
  console.log(message);
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
