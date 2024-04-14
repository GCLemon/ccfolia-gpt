import { isCRXResponse } from '@/@type-guards';

// メッセージを受け取ったときのイベントを設定
chrome.runtime.onMessage.addListener(message => {

  if(isCRXResponse(message) && message.command === 'generate') {

    // テキストエリアを取得
    const textQuery = 'textarea.MuiInputBase-input';
    const textElement = document.querySelector(textQuery);
    if(!textElement) { throw new Error('input not found'); }
    const text = textElement as HTMLTextAreaElement;

    // 名前入力欄を取得
    const nameQuery = '#root > div > div.MuiDrawer-root.MuiDrawer-docked.css-oms1ax > div > div > form > div:nth-child(2) > div > div > input';
    const nameElement = document.querySelector(nameQuery);
    if(!nameElement) { throw new Error('input not found'); }
    const name = nameElement as HTMLInputElement;

    // ボタンを取得
    const buttonQuery = '#root > div > div.MuiDrawer-root.MuiDrawer-docked.css-oms1ax > div > div > form > div:nth-child(3) > button.MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textWhite.MuiButton-sizeSmall.MuiButton-textSizeSmall.MuiButton-root.MuiButton-text.MuiButton-textWhite.MuiButton-sizeSmall.MuiButton-textSizeSmall';
    const buttonElement = document.querySelector(buttonQuery);
    if(!buttonElement) { throw new Error('button not found'); }
    const button = buttonElement as HTMLButtonElement;

    // 名前を控える
    const nameTmp = name.value;
    
    // 受け取ったメッセージを入力ボックスに入れ、送信ボタンを押す
    text.value = message.data.content;
    text.dispatchEvent(new Event('input', {bubbles:true,cancelable:true}));
    name.value = message.data.person;
    name.dispatchEvent(new Event('input', {bubbles:true,cancelable:true}));
    button.click();

    // 控えておいた名前を戻す
    name.value = nameTmp;
    name.dispatchEvent(new Event('input', {bubbles:true,cancelable:true}));
  }

  // 正常終了
  return true;
});