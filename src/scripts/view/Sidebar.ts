/// <reference path="../../../typings.d.ts" />

import IView from './IView';
import TreeView from './Tree.View';
import Bookmark from './Bookmark.View';
import Settings from './Settings.View';
import * as $ from 'jquery';
import * as octicons from "octicons";
import { RepoParam } from '../service/';
import 'bigslide';

const template:string = `
  <div class="gitxpress" id="gxMainView">
    <a class="push gitxpress--toogle-link" id="gxSideMenuLink"><%this.toggleIcon%></a>
    <div id="menu" class="gitxpress__sidebar">
      <div class="gitxpress__sidebar--header" id="gxSidebarHeader">
        <div class="gitxpress__sidebar--header--linkLarge" id="gxHeaderArea"></div>
        <div class="gitxpress__sidebar--header--linkSmall" id="gxActions">
          <a class="gitxpress__sidebar--header--action" data-page="tree"><%this.branchIcon%></a>
          <a class="gitxpress__sidebar--header--action" data-page="bookmark"><%bookMarkIcon%></a>
          <a class="gitxpress__sidebar--header--action" data-page="settings"><%settingIcon%></a>
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

  showPageHandler = (e:any) => {
    let currentPage = $(e.currentTarget).data('page');
    this.props.onPageChange(currentPage);
  }

  renderRoute(state:any){
    $('.gitxpress__sidebar--header--action').removeClass('gitxpress__action--selected');
    $(`a[data-page='${state.page}']`).addClass('gitxpress__action--selected');

    let currentRepo:RepoParam = this.props.provider.getRepoInformation(document.location.href);

    if(!currentRepo && state.page == 'tree') {
      state.page = 'bookmark';
    }

    if(state.page === 'tree') {
      let treeView = new TreeView(this.props);
      treeView.render({}, 'html');
    } else if(state.page === 'bookmark') {
      let bookmark = new Bookmark(this.props);
      bookmark.render({}, 'html');
    } else if(state.page === 'settings') {
      let settings = new Settings(this.props);
      settings.render(state, 'html');
    }
  }
}