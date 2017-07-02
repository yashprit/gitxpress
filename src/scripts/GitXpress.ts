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
    $("#sidebar_menu").attr('aria-label', 'Toggle GitXpress');
    $("#sidebar_menu").append(octicons['three-bars'].toSVG());
    $("#branchLink").prepend(octicons['git-branch'].toSVG());
    this.loadSidebar();
  }

  loadSidebar() {
    $('.menu-link').bigSlide({
      state: true,
      menuWidth: '301px',
      menu: ('#menu')
    });
  }

  populateTree(){
    $('#treeView').treeview({
      data: this.tree,
      showBorder: false,
      expandIcon: 'gitxpress__icon gitxpress__icon--folder',
      collapseIcon: 'gitxpress__icon gitxpress__icon--folder'
    });
  }
}

(<any>window).gitXpress = new GitXpress();