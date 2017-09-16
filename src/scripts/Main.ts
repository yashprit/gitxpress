import { 
  createStore, 
  Reducer, 
  GitFactory, 
  Service, 
  Tag, 
  RepoParam, 
  whichBrowser,
  BrowserType
} from './service';
import Sidebar from './view/Sidebar';
import { 
  StorageFactory, 
  IStorage, 
  ChromeStorage 
} from './service/StorageFactory';
import BookmarkPopupView from './view/BookmarkPopup.View';

export default class Main {

  private store:any;
  private sidebar:Sidebar;
  private bookmarkPopup:BookmarkPopupView;
  private gitService:Service;
  private location:any;
  private storage:IStorage;

  constructor(){
    let browser:BrowserType = whichBrowser();
    this.storage = StorageFactory.createProvider(browser);
    if(browser.isChrome) {
      chrome.storage.onChanged.addListener(function(changes:any, area:any) {
        console.log(changes, area);
      });
    }
  }

  bootstrap = (user:any):void => {
    this.storage.get('__gitxpress__').then((value:any) => {
      let intialState =  value || {
        page: 'tree', 
        tags: {}, 
        settings: {
          sync: false
        }
      };

      /*if(user) {
        intialState.user = user;
        intialState.settings = {
          sync: true,
          token: undefined
        }
      }*/
  
      this.location = document.location;
  
      this.gitService = GitFactory.createProvider(this.location, this.storage);
  
      this.store = createStore(Reducer, intialState);
      this.store.subscribe(this.storeEvent);
  
      let currentState = this.store.getState();
  
      this.sidebar = new Sidebar({
        onPageChange: this.openPage.bind(this),
        state: currentState,
        provider: this.gitService,
        addToken: this.addToken.bind(this),
        onSyncEnabled: this.syncEnabled.bind(this)
      });
      this.sidebar.initView();
  
      this.bookmarkPopup = new BookmarkPopupView({
        provider: this.gitService,
        addTag: this.onTagAdd.bind(this),
        state: currentState 
      });
      this.bookmarkPopup.initView();
  
      this.store.dispatch({type: 'PAGE_CHANGE', payload:{page: currentState.page}});
    }, (error:any) => {
      console.error(error)
    })
  }

  onTagAdd = (newTags:any):void => {
    this.store.dispatch({
      type: 'ADD_TAG',
      payload: {
        tags: newTags
      }
    })
  }

  addToken = (token:any):void => {
    this.store.dispatch({
      type: 'PAGE_CHANGE',
      payload: {
        settings: {
          token: token
        }
      }
    })
  }

  storeEvent = (state:any, actionType:string):void => {
    this.storage.set('__gitxpress__', state).then(() => {
      if(actionType === 'PAGE_CHANGE') {
        this.sidebar.renderRoute(state);
      }
  
      if(actionType === 'FIREBASE_STATUS') {
        console.log(state);
      }
  
      if(actionType === 'ADD_TAG') {
        //if sync enabled make api call to firebase
        console.log(state);
      }
    });
  }

  syncEnabled = ():void => {
    chrome.runtime.sendMessage({interactive: true})
   // window.postMessage({interactive: true}, '*');
  }

  processMessage = (message:any):void => {
    console.log(message)
  }
  

  openPage = (currentPage:string):void => {
    this.store.dispatch({
      type: 'PAGE_CHANGE',
      payload: {
        page: currentPage
      }
    })
  }
}

window.addEventListener ("load", () => {
  (<any>window).gitxpress = new Main();
  (<any>window).gitxpress.bootstrap();
}, false);