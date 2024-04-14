// チャットの監視処理
const observe = () => {

  // チャット要素を取得、出来なければ時間をおいて再実行する
  const chatQuery = '#root > div > div.MuiDrawer-root.MuiDrawer-docked.css-oms1ax > div > ul > div > div';
  
  const chatElement = document.querySelector(chatQuery);
  if(!chatElement) {
    setTimeout(observe, 500);
    return;
  }

  // MutationObserverを設定
  const observer = new MutationObserver(mutations => {

    // 追加されたノードそれぞれについて処理
    for(const mutation of mutations) {
      const elements = [...mutation.addedNodes.values()].map(node => node as Element);
      for(const message of elements) {

        // 送信者を取得
        const personElement = message.querySelector('h6');
        if(!personElement) {
            console.error('Failed to get person info.');
            continue;
        }
        const person = (personElement.innerHTML ?? '').replace(/<span( [^=]+="[^"]+")*>(.|\n)*<\/span>/, '');

        // テキスト内容を取得
        const contentElement = message.querySelector('p');
        if(!contentElement) {
            console.error('Failed to get content info.');
            continue;
        }
        const content = (contentElement.innerHTML ?? '').replace(/<span( [^=]+="[^"]+")*>(.|\n)*<\/span>/, '');

        // ダイスロールの内容を取得
        const dicerollElement = message.querySelector('p > span');
        const diceroll = dicerollElement?.textContent?.slice(1);

        // 送信者が自分のものではなかった場合、
        // バックグラウンドスクリプトにメッセージを送る
        // const url = new URL(document.URL);
        const roomID = 'RmqpbVNbG';
        chrome.runtime.sendMessage<CRXRequest>({
          command: 'generate',
          argument: {roomID,person,content:diceroll?diceroll:content},
        });
      }
    }
  });

  // MutationObserverを起動
  observer.observe(chatElement, { childList:true });
}

// ページが読み込まれた時のイベントを設定
if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', observe);
}
else { observe(); }