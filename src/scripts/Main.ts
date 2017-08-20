import { createStore, Storage, Reducer, GitFactory, Service } from './service';
import Sidebar from './view/Sidebar';
import * as firebase from 'firebase';
import BookmarkPopupView from './view/BookmarkPopup.View';

const config = {
  apiKey: '<YOUR_API_KEY>',
  databaseURL: '<YOUR_DATABASE_URL>',
  storageBucket: '<YOUR_STORAGE_BUCKET_NAME>'
};

firebase.initializeApp(config);

export default class Main {

  private store:any;
  private sidebar:Sidebar;
  private bookmarkPopup:BookmarkPopupView;
  private gitService:Service;
  private location:any;

  constructor(){
    document.addEventListener('DOMContentLoaded', this.bootstrap);
  }

  bootstrap = ():void => {
    this.location = document.location;

    this.gitService = GitFactory.createProvider(this.location);

    let tags = this.gitService.getAllTags();

    let savedState = Storage.get('__gitxpress__');
    let intialState = savedState && Object.keys(savedState).length > 0? savedState : {page: 'tree'};
    this.store = createStore(Reducer, intialState);
    this.store.subscribe(this.storeEvent);

    let currentState = this.store.getState();

    this.sidebar = new Sidebar({
      onPageChange: this.openPage.bind(this),
      state: currentState,
      provider: this.gitService
    });
    this.sidebar.initView();

    this.bookmarkPopup = new BookmarkPopupView({
      state: tags,
      addTag: this.onTagAdd.bind(this),
      provider: this.gitService
    });
    this.bookmarkPopup.initView();

    this.store.dispatch({type: 'PAGE_CHANGE', payload:{page: currentState.page}});
    firebase.auth().onAuthStateChanged(this.onFirebaseAuth);
  }

  onFirebaseAuth = (user:any):void => {
    this.store.dispatch({
      type: 'FIREBASE_STATUS',
      payload: {
        user: user
      }
    });
  }

  storeEvent = (state:any, actionType:string):void => {
    Storage.set('__gitxpress__', state);
    if(actionType === 'PAGE_CHANGE') {
      this.sidebar.renderRoute(state);
    }

    if(actionType === 'FIREBASE_STATUS') {
      console.log(state);
    }

    if(actionType === 'ADD_TAG') {
      this.bookmarkPopup.updateTags(state);
    }
  }

  onTagAdd = (tagValue:string):void => {
    let currentState = this.store.getState();
    let tags = currentState.tags;
    tags.push(tagValue);
    this.store.dispatch({
      type: 'ADD_TAG',
      payload: {
        tags: tags
      }
    })
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


(<any>window).gitxpress = new Main();