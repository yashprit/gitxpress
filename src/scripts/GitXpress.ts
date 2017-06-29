/// <reference path="./provider/Provider.ts" />
/// <reference path="./provider/ProviderFactory.ts" />
/// <reference path="../../typings/index.d.ts" />

import * as GitFactory from './provider/ProviderFactory';
import * as IProvider from './provider/Provider';
//import * as Slideout from 'slideout';
import $ from 'jquery';

declare var chrome:any;

interface DOM {
  body:any
}

class GitXpress {

  DOM:DOM;
  location:string;
  htmlTemplate: string;
  
  constructor(){
    this.DOM = {
      body: (<any>document).body
    }

    document.addEventListener('DOMContentLoaded', this.onDomReady.bind(this));
  }

  onDomReady(){
    this.htmlTemplate = (<any>window).template['sidebar.template.html'];
    this.location = document.location.href;
    let provider: IProvider.GitProvider.GitAbstract = GitFactory.GitProvider.GitFactory.createProvider(this.location);
    (<any>$)(this.DOM.body).append(this.htmlTemplate);
    provider.loadRepo(null);
    //this.loadSidebar();
    //console.log(Slideout);
  }

  loadSidebar() {
    /*const slideout = new Slideout({
      'panel': document.getElementById('js-repo-pjax-container'),
      'menu': document.getElementById('gitxpress-menu'),
      'padding': 256,
      'tolerance': 70
    });*/
  }
}

(<any>window).gitXpress = new GitXpress();