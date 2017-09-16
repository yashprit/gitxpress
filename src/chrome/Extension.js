var config = {
  apiKey: "AIzaSyA9a76pLyvVXLXhlDZgHElmnfq5Ogz93Lg",
  authDomain: "gitxpress-17df9.firebaseapp.com",
  databaseURL: "https://gitxpress-17df9.firebaseio.com",
  storageBucket: "gitxpress-17df9.appspot.com",
};
firebase.initializeApp(config);

function initApp() {
  // Listen for auth state changes.
  firebase.auth().onAuthStateChanged(function(user) {
    console.log('User state change detected from the Background script of the Chrome Extension:', user);
    saveUser(user);
  });
}

function saveUser(user){
  if(user) {
    chrome.storage.local.get('__gitxpress__', (oldProps) => {
      let newProps = Object.assign({}, oldProps, {
        __fb__: user
      })
      chrome.storage.sync.set('__gitxpress__', JSON.stringify(newProps));
    });
  }
}

window.onload = function() {
  initApp();
};

var identity = chrome.identity;

console.log(chrome.identity)

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'loading') return

  chrome.tabs.executeScript(tabId, {
    code: 'var injected = window.octotreeInjected; window.octotreeInjected = true; injected;',
    runAt: 'document_start'
  }, (res) => {
    if (chrome.runtime.lastError || // don't continue if error (i.e. page isn't in permission list)
        res[0]) // value of `injected` above: don't inject twice
      return

    const cssFiles = [
      'style/gitxpress.css'
    ]

    const jsFiles = [
      'js/gitxpress.js',
      'js/gitxpress-vendor.js'
    ]

    eachTask([
      (cb) => eachItem(cssFiles, inject('insertCSS'), cb),
      (cb) => eachItem(jsFiles, inject('executeScript'), cb)
    ])

    function inject(fn) {
      return (file, cb) => {
        chrome.tabs[fn](tabId, { file: file, runAt: 'document_start' }, cb)
      }
    }
  })
})

chrome.runtime.onMessage.addListener((req, sender, sendRes) => {
  const handler = {
    requestPermissions: () => {
      const urls = (req.urls || [])
        .filter((url) => url.trim() !== '')
        .map((url) => {
          if (url.slice(-2) === '/*') return url
          if (url.slice(-1) === '/') return url + '*'
          return url + '/*'
        })

      if (urls.length === 0) {
        sendRes(true)
        removeUnnecessaryPermissions()
      }
      else {
        chrome.permissions.request({ origins: urls }, (granted) => {
          sendRes(granted)
          removeUnnecessaryPermissions()
        })
      }
      return true

      function removeUnnecessaryPermissions() {
        const whitelist = urls.concat([
          'https://github.com/*'
        ])
        chrome.permissions.getAll((permissions) => {
          const toBeRemovedUrls = permissions.origins.filter((url) => {
            return !~whitelist.indexOf(url)
          })

          if (toBeRemovedUrls.length) {
            chrome.permissions.remove({ origins: toBeRemovedUrls })
          }
        })
      }
    }
  }

  return handler[req.type]()
})

function eachTask(tasks, done) {
  (function next(index = 0) {
    if (index === tasks.length) done && done()
    else tasks[index](() => next(++index))
  })()
}

function eachItem(arr, iter, done) {
  const tasks = arr.map((item) => {
    return (cb) => iter(item, cb)
  })
  return eachTask(tasks, done)
}

var connections = {};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('incoming message from injected script');
  console.log(request);

  // Messages from content scripts should have sender.tab set
  if (sender.tab) {
    var tabId = sender.tab.id;
    if (tabId in connections) {
      connections[tabId].postMessage(request);
    } else {
      console.log("Tab not found in connection list.");
    }
  } else {
    console.log("sender.tab not defined.");
  }

  let interactive = request.interactive;

  startAuth(interactive);
  

  return true;
});

chrome.runtime.onConnect.addListener(function(port) {
  
    // Listen to messages sent from the DevTools page
    port.onMessage.addListener(function(request) {
      console.log('incoming message from dev tools page');
  
      // Register initial connection
      if (request.name == 'init') {
        connections[request.tabId] = port;
  
        port.onDisconnect.addListener(function() {
          delete connections[request.tabId];
        });
  
        return;
      }
    });
  
  });

function startAuth(interactive){
  identity.getAuthToken({interactive: !!interactive}, (token) => {
    console.log(token);
    if (chrome.runtime.lastError && !interactive) {
      console.log('It was not possible to get a token programmatically.');
    } else if(chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else if (token) {
      // Authrorize Firebase with the OAuth Access Token.
      var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
      firebase.auth().signInWithCredential(credential).catch( (error) => {
        // The OAuth token might have been invalidated. Lets' remove it from cache.
        if (error.code === 'auth/invalid-credential') {
          identity.removeCachedAuthToken({token: token}, function() {
            startAuth(interactive);
          });
        }
      });
    } else {
      console.error('The OAuth Token was null');
    }
  });
}