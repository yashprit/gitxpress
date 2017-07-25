/// <reference path="../../typings.d.ts" />

import Store from './Store';
import IView from './components/IView';
import TreeView from './components/tree/Tree.View';
import Bookmark from './components/bookmark/Bookmark.View';
import Settings from './components/settings/Settings.View';
import $ from 'jquery';
import octicons from "octicons";
import 'bigslide';

const template:string = `
  <div class="gitxpress" id="gxMainView">
    <a class="push gitxpress--toogle-link tooltipped-s js-menu-target" id="gxSideMenuLink">{{toggleIcon}}</a>
    <div id="menu" class="gitxpress__sidebar">
      <div class="header gitxpress__sidebar--header" id="gxSidebarHeader">
        <div class="gitxpress__sidebar--header--linkLarge" id="gxHeaderArea"></div>
        <div class="gitxpress__sidebar--header--linkSmall" id="gxActions">
          <a class="header-navlink gitxpress__sidebar--header--action" data-page="tree">{{branchIcon}}</a>
          <a class="header-navlink gitxpress__sidebar--header--action" data-page="bookmark">{{bookMarkIcon}}</a>
          <a class="header-navlink gitxpress__sidebar--header--action" data-page="settings">{{settingIcon}}</a>
        </div>
      </div>
      <div id='gxContentArea'></div>
    </div>
  </div>
`;

const config = {
  apiKey: '<YOUR_API_KEY>',
  databaseURL: '<YOUR_DATABASE_URL>',
  storageBucket: '<YOUR_STORAGE_BUCKET_NAME>'
};

declare var firebase;

firebase.initializeApp(config);

class Main extends IView {
  private store:Store;

  constructor(){
    super('body', template);
    document.addEventListener('DOMContentLoaded', this.bootStrap);
    firebase.auth().onAuthStateChanged(this.onFirebaseAuth);
  }

  onFirebaseAuth = (user:any):void => {
    if (user) {
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      let linkStatus:string = octicons['issue-thumbsup'].toSVG();
      $('#gxFirebaseLinkStatus').html(linkStatus);
    } else {
      let linkStatus:string = octicons['issue-thumbsdown'].toSVG();
      $('#gxFirebaseLinkStatus').html(linkStatus);
    }
  }

  bootStrap = ():void => {
    this.store = new Store(this.actions());
  }

  actions(){
    return {
      'PAGE_CHANGE': this.openPage,
      'INIT': this.initView
    }
  }

  initView = (state:any, actionType:string):void => {
    let toggleIcon:string = octicons['three-bars'].toSVG();
    let bookMarkIcon:string = octicons['bookmark'].toSVG();
    let settingIcon:string = octicons['gear'].toSVG();
    let branchIcon:string = octicons['git-branch'].toSVG();

    this.render({
      toggleIcon: toggleIcon,
      settingIcon: settingIcon,
      bookMarkIcon: bookMarkIcon,
      branchIcon: branchIcon
    }, 'append');
    this.openPage(state, actionType);
  }

  componentDidRender(){
    $('#gxSideMenuLink').bigSlide({
      state: true,
      menuWidth: '301px',
      menu: ('#menu')
    });
    $(document).on('click', '.gitxpress__sidebar--header--action', this.showPageHandler);
  }

  componentWillRender(){
    console.log("empty will render")
  }

  showPageHandler = (e:any):void => {
    let currentPage = $(e.currentTarget).data('page');
    this.store.dispatch({
      type: 'PAGE_CHANGE',
      payload: {
        page: currentPage
      }
    })
  }

  openPage = (state:any, actionType:string):void => {
    $('.gitxpress__sidebar--header--action').removeClass('gitxpress__action--selected');
    $(`a[data-page='${state.page}']`).addClass('gitxpress__action--selected');

    if(state.page === 'tree') {
      let treeView = new TreeView();
      treeView.render({}, 'html');
    } else if(state.page === 'bookmark') {
      let bookmark = new Bookmark();
      bookmark.render({}, 'html');
    } else if(state.page === 'settings') {
      let settings = new Settings();
      settings.render({}, 'html');
    }
  }
}

(<any>window).gitxpress = new Main();