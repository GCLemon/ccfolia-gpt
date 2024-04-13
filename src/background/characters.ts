import { isCRXRequest } from '@/@type-guards';

let characters:Character[] = [];

function getCharacters(tabID:number) {
  const response = {
    command:'getCharacters',
    data: characters,
  };
  chrome.tabs.sendMessage<CRXResponse>(tabID, response);
}

chrome.runtime.onMessage.addListener((message,sender) => {

  if(isCRXRequest(message)) {
    switch(message.command) {
      case 'getCharacters':
        if(sender.tab?.id) { getCharacters(sender.tab.id); }
        break;
      default:
        break;
    }
  }
});