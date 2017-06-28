/// <reference path="./provider/Provider.ts" />
/// <reference path="./provider/ProviderFactory.ts" />

import * as GitFactory from './provider/ProviderFactory';
import * as IProvider from './provider/Provider';
import template from './sidebar.template.js';

declare var chrome:any;

class GitXpress {

  DOM:object;
  location:string;
  htmlTemplate: string;
  
  constructor(){
    this.DOM = {
      body: document.body
    }

    document.addEventListener('DOMContentLoaded', this.onDomReady.bind(this));
  }

  onDomReady(){
    this.htmlTemplate = template['sidebar.template.html'];
    this.location = document.location.href;
    let provider: IProvider.GitProvider.GitAbstract = GitFactory.GitProvider.GitFactory.createProvider(this.location);
    this.DOM.body.append(this.htmlTemplate);
    provider.loadRepo(null);
  }
}

(<any>window).gitXpress = new GitXpress();