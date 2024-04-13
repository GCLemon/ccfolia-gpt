import './characters';
import './messages';
import './preference';

// 拡張機能のアイコンをクリックしたときのイベント
chrome.action.onClicked.addListener(_ => {

  // ポップアップウィンドウを作る
  chrome.windows.create({
    url: chrome.runtime.getURL('index.html'),
    type: 'popup',
    width: 640,
    height: 480,
  });
});