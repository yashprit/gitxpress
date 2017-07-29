/// <reference path="../../typings.d.ts" />

import IView from './components/IView';
import TreeView from './components/tree/Tree.View';
import Bookmark from './components/bookmark/Bookmark.View';
import Settings from './components/settings/Settings.View';
import $ from 'jquery';
import octicons from "octicons";
import 'bigslide';

const template:string = `
  <div class="gitxpress" id="gxMainView">
    <a class="push gitxpress--toogle-link tooltipped-s js-menu-target" id="gxSideMenuLink"><%this.toggleIcon%></a>
    <div id="menu" class="gitxpress__sidebar">
      <div class="header gitxpress__sidebar--header" id="gxSidebarHeader">
        <div class="gitxpress__sidebar--header--linkLarge" id="gxHeaderArea"></div>
        <div class="gitxpress__sidebar--header--linkSmall" id="gxActions">
          <a class="header-navlink gitxpress__sidebar--header--action" data-page="tree"><%this.branchIcon%></a>
          <a class="header-navlink gitxpress__sidebar--header--action" data-page="bookmark"><%bookMarkIcon%></a>
          <a class="header-navlink gitxpress__sidebar--header--action" data-page="settings"><%settingIcon%></a>
        </div>
      </div>
      <div id='gxContentArea'></div>
    </div>
  </div>
`;

export default class Sidebar extends IView {
  private props:any;

  constructor(props:any){
    super('body', template);
    this.props = props;
  }

  initView(){
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
    //render bookmark
    
  }

  showPageHandler(e){
    let currentPage = $(e.currentTarget).data('page');
    this.props.onPageChange(currentPage);
  }

  renderRoute(state:any){
    $('.gitxpress__sidebar--header--action').removeClass('gitxpress__action--selected');
    $(`a[data-page='${state.page}']`).addClass('gitxpress__action--selected');

    if(state.page === 'tree') {
      let treeView = new TreeView(state);
      treeView.render({}, 'html');
    } else if(state.page === 'bookmark') {
      let bookmark = new Bookmark(state);
      bookmark.render({}, 'html');
    } else if(state.page === 'settings') {
      let settings = new Settings(state);
      settings.render({}, 'html');
    }
  }
}