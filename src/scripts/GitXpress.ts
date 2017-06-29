/// <reference path="../../typings.d.ts" />

import * as GitFactory from './provider/ProviderFactory';
import * as IProvider from './provider/Provider';
import $ from 'jquery';
import 'bigslide';
import 'bootstrap-treeview';

class GitXpress {
  location:string;
  htmlTemplate: string;
  
  constructor(){

    document.addEventListener('DOMContentLoaded', this.onDomReady.bind(this));
  }

  onDomReady(){

    this.htmlTemplate = (<any>window).template['sidebar.template.html'];
    this.location = document.location.href;
    let provider: IProvider.GitProvider.GitAbstract = GitFactory.GitProvider.GitFactory.createProvider(this.location);
    //$('div[role="main"]').addClass('push gitxpress--relative')
    $(document.body).append(this.htmlTemplate);
    provider.loadRepo(null);
    this.loadSidebar();
  }

  loadSidebar() {
    $('.menu-link').bigSlide({
      state: true,
      menuWidth: '301px'
    });
  }
}

(<any>window).gitXpress = new GitXpress();