import * as browser from 'detect-browser';

interface BrowserType {
  isOpera: Boolean;
  isFirefox: Boolean;
  isSafari: Boolean;
  isIE: Boolean;
  isEdge: Boolean;
  isChrome: Boolean;
  isBlink: Boolean;
}



let BrowserProcessing = {
  which: function():Function{
    
    let type:BrowserType = {
      isOpera: false,
      isFirefox: false,
      isSafari: false,
      isIE: false,
      isEdge: false,
      isChrome: false,
      isBlink: false
    } 

    switch (browser && browser.name) {
      case 'chrome':
        type.isChrome = true;
        break;

      case 'firefox':
        type.isFirefox = true;
        break;

      case 'edge':
        type.isEdge = true;
        break;
     
      default:
        console.log('not supported');
    }

    return function():BrowserType{
      return type
    }
  }
}

let whichBrowser = BrowserProcessing.which();

export { whichBrowser, BrowserType };