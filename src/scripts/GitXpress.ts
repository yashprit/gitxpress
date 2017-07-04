/// <reference path="../../typings.d.ts" />

import GitFactory from './provider/ProviderFactory';
import {GitAbstract, RepoParam, Tree} from './provider/Provider';
import $ from 'jquery';
import 'bigslide';
import 'jquery-pjax';
import octicons from "octicons";

class GitXpress {
  location:any;
  htmlTemplate: string;
  tree: Array<Tree>;
  parsedInfo:RepoParam;
  
  constructor(){
    document.addEventListener('DOMContentLoaded', this.onDomReady.bind(this));
  }

  onDomReady(){

        //if(window.innerWidth < 1670) {
      $("div[role='main']").addClass('push');
    //}

    this.htmlTemplate = (<any>window).template['sidebar.template.html'];
    this.location = document.location;
    let provider: GitAbstract = GitFactory.createProvider(this.location.href);
    this.parsedInfo = provider.getRepoInformation(this.location);

    if(this.parsedInfo) {
      this.updateDOM();
      provider.loadRepo(this.parsedInfo, (tree:Array<Tree>) => {
        this.tree = tree
        this.populateTree();
        
      });
    } else {
      //handle error while not able to parse username and password
    }
  }

  updateDOM() {


    $(document.body).append(this.htmlTemplate);
    $("#gxSideMenuLink").attr('aria-label', 'Toggle GitXpress').append(octicons['three-bars'].toSVG());
    $("#gxBranchLink").append(`<span class="header-nav-link gitxpress__sidebar--header--action">${this.parsedInfo.branch}</span>`)
    $("#gxBranchLink").prepend(octicons['git-branch'].toSVG());
    const actionHtml = `
      <a class="header-nav-link gitxpress__sidebar--header--action" id="gxBookmarkAction">
        ${octicons['bookmark'].toSVG()}
      </a>
      <a class="header-nav-link gitxpress__sidebar--header--action" id="gxGearAction">
        ${octicons['gear'].toSVG()}
      </a>`;
    $("#gxActions").append(actionHtml);
    this.loadSidebar();
    this.bindAction();
  }

  bindAction(){
    $(document).on('#gxBookmarkAction', 'click', this.showBookmarkView);
    $(document).on('#gxGearAction', 'click', this.showSettingsView);
    //$(document).pjax('.node-gxTreeView > a', '#js-repo-pjax-container');
    $(document).on('click', '.node-gxTreeView > a', this.handleFileSelect);
  }

  handleFileSelect(e:any){
    //e.preventDefault();
    //var container = $()
    $.pjax.click(e, {container: '#js-repo-pjax-container'})
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
    $('#gxTreeView').treeview({
      data: this.tree,
      showBorder: false,
      enableLinks:true,
      levels: 0,
      expandIcon: 'gitxpress__icon gitxpress__icon--folder',
      collapseIcon: 'gitxpress__icon gitxpress__icon--folder'
    });
  }
}

(<any>window).gitXpress = new GitXpress();