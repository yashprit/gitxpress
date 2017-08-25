import { createStore, Storage, Reducer, GitFactory, Service, Tag, RepoParam } from './service';
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

  contentLoaded = ():void => {
    firebase.auth().onAuthStateChanged(this.bootstrap);
  }

  bootstrap = (user:any):void => {
    let intialState = Storage.get('__gitxpress__') || {
      page: 'tree', 
      tags: {}, 
      settings: {
        sync: false
      }
    };

    if(user) {
      intialState.user = user;
      intialState.settings = {
        sync: true
      }
    }

    this.location = document.location;

    this.gitService = GitFactory.createProvider(this.location);

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
      provider: this.gitService,
      addTag: this.onTagAdd.bind(this),
      state: currentState 
    });
    this.bookmarkPopup.initView();

    this.store.dispatch({type: 'PAGE_CHANGE', payload:{page: currentState.page}});
  }

  onTagAdd = (newTags:any):void => {
    this.store.dispatch({
      type: 'ADD_TAG',
      payload: {
        tags: newTags
      }
    })
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
      //if sync enabled make api call to firebase
      console.log(state);
    }
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