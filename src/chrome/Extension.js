firebase.initializeApp(window.config);

chrome.storage.onChanged.addListener((changes, area) => {
  let data = changes.gitxpress
  handleStorageChange(data.newValue, data.oldValue)
});

let firebaseUid;

function initApp() {
  // Listen for auth state changes.
  firebase.auth().onAuthStateChanged(function(user) {
    console.log('User state change detected from the Background script of the Chrome Extension:', user);
    saveUser(user);
  });
}

function saveUser(user){
  if(user) {
    firebaseUid
    chromeStorageSet('gitxpress', {fb: user}).then((data) => {
      console.log("user is set", data);
    }, (error) => {
      console.log("error ", error);
    });
  }  
}

window.onload = function() {
  initApp();
};

var identity = chrome.identity;

var connections = {};


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'loading') return

  chrome.tabs.executeScript(tabId, {
    code: 'var injected = window.gitxpressInjected; window.gitxpressInjected = true; injected;',
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
    requestPermissions(){
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
    },
    sync(payload){
      startAuth(payload.interactive);
    }
  }

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

function chromeStorageSet(key, val) {
  return new Promise((resolve, reject) => {
    chromeStorageGet(key).then((value) => {
      console.log(value)

      let newValue = value? Object.assign({}, value[key], val) : Object.assign({}, val);

      console.log(key, newValue);
      
      chrome.storage.local.set({
        [key]: newValue
      }, () => {
        if (chrome.runtime.error) {
          reject(chrome.runtime.error)
        } else {
          resolve(newValue)
        }
      });
    }, (error) => {
      reject(error);
    })
  });
}
  
function chromeStorageGet(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, (result) => {
      if (!chrome.runtime.error) {
        let data = Object.keys(result).length === 0 && result.constructor === Object? undefined : result;
        resolve(data);
      } else {
        reject(chrome.runtime.error);
      }
    });
  })
}

function handleStorageChange(newValue, oldValue) {
  let isUpload = newValue.tags !== oldValue.tags;

  if(isUpload) {
    let uploadValue = {
      tags: newValue.tags,
      token: newValue.token
    }
    let uid = newValue.fb.uid;
    firebase.database().ref(`/${uid}`).set(uploadValue);
  }
}