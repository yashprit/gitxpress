window.addEventListener('message', function(event) {
  // Only accept messages from same frame
  if (event.source !== window) {
    return;
  }

  var message = event.data;

  // Only accept messages that we know are ours
  if (typeof message !== 'object' || message === null || !message.interactive) {
    return;
  }

  chrome.runtime.sendMessage(message);
});

chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    
    sendResponse({farewell: "goodbye"});
    if (request.__fb__) {
      var evt=document.createEvent("FB_STATUS");
      evt.initCustomEvent("yourCustomEvent", true, true, request.__fb__);
      document.dispatchEvent(evt);
    }
});