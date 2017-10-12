import { 
  createStore, 
  Reducer, 
  GitFactory, 
  Service, 
  Tag, 
  RepoParam, 
  whichBrowser,
  BrowserType,
  Message
} from './service';
import Sidebar from './view/Sidebar';
import { 
  StorageFactory, 
  IStorage, 
  StorageData,
  ChromeStorage 
} from './service/StorageFactory';
import BookmarkPopupView from './view/BookmarkPopup.View';

const KEYNAME = 'gitxpress';

const initalSettings = {
  page: 'tree', 
  bookmarks: {}, 
  sync: false,
  token: ''
}

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
  }

  bootstrap = (user:any):void => {
    this.storage.get(KEYNAME).then((value:StorageData) => {

      let intialState:StorageData = Object.assign({}, initalSettings, value);
  
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
    });
  }

  addToken = (token:any):void => {
    this.store.dispatch({
      type: 'PAGE_CHANGE',
      payload: {
        token: token
      }
    });
  }

  storeEvent = (state:any, actionType:string):void => {
    this.storage.set(KEYNAME, state).then((newState:StorageData) => {
      if(actionType === 'PAGE_CHANGE') {
        this.sidebar.renderRoute(newState);
      }

      if(actionType === 'SYNC') {
        if(newState.sync && !newState.fb) {
          let message:Message = {
            type: 'SYNC',
            payload: {
              interactive: true,
              state: newState
            }
          }
          chrome.runtime.sendMessage(message)
        }
      }
  
      if(actionType === 'FIREBASE_STATUS') {}
  
      if(actionType === 'ADD_TAG') {}
    });
  }

  syncEnabled = (status:boolean):void => {
    this.store.dispatch({
      type: 'SYNC',
      payload: {
        sync: status
      }
    });
  }
  
  openPage = (currentPage:string):void => {
    this.store.dispatch({
      type: 'PAGE_CHANGE',
      payload: {
        page: currentPage
      }
    });
  }
}

window.addEventListener ("load", () => {
  (<any>window).gitxpress = new Main();
  (<any>window).gitxpress.bootstrap();
}, false);