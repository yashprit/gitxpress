/// <reference path="../../typings.d.ts" />

import * as GitFactory from './provider/ProviderFactory';
import * as IProvider from './provider/Provider';
import $ from 'jquery';
import 'bigslide';
import octicons from "octicons";
import request from 'request';

class GitXpress {
  location:string;
  htmlTemplate: string;
  tree: Array<object>;
  
  constructor(){
    document.addEventListener('DOMContentLoaded', this.onDomReady.bind(this));
  }

  onDomReady(){

    this.htmlTemplate = (<any>window).template['sidebar.template.html'];
    this.location = document.location.href;
    let provider: IProvider.GitAbstract = GitFactory.GitFactory.createProvider(this.location);
    let parsedInfo: IProvider.RepoParam = provider.parseUserAndReponame(this.location);

    if(parsedInfo) {
      this.updateDOM();
      provider.loadRepo(parsedInfo, (tree:Array<object>) => {
        this.tree = tree;
        this.populateTree();
      });
    } else {
      //handle error while not able to parse username and password
    }
  }

  updateDOM() {
    $(document.body).append(this.htmlTemplate);
    $("#gxSideMenuLink").attr('aria-label', 'Toggle GitXpress').append(octicons['three-bars'].toSVG());
    $("#gxBranchLink").prepend(octicons['git-branch'].toSVG());
    let bookmark = octicons['bookmark'].toSVG();
    let gear = octicons['gear'].toSVG();
    $("#gxActions").append(`<a class="header-nav-link gitxpress__sidebar--header--action" id="gxBookmarkAction">${bookmark}</a><a class="header-nav-link gitxpress__sidebar--header--action" id="gxGearAction">${gear}</a>`);
    this.loadSidebar();
    this.bindClick();
  }

  bindClick(){
    $(document).on('#gxBookmarkAction', 'click', this.showBookmarkView);
    $(document).on('#gxGearAction', 'click', this.showSettingsView);
  }

  showBookmarkView() {
    console.log("bookmark")
  }

  showSettingsView() {
    console.log("settings")
  }

  loadSidebar() {
    $('#gxSideMenuLink').bigSlide({
      state: true,
      menuWidth: '301px',
      menu: ('#menu')
    });
  }

  populateTree(){
    $('#gsTreeView').treeview({
      data: this.tree,
      showBorder: false,
      expandIcon: 'gitxpress__icon gitxpress__icon--folder',
      collapseIcon: 'gitxpress__icon gitxpress__icon--folder'
    });
  }
}

(<any>window).gitXpress = new GitXpress();