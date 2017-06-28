/// <reference path="./provider/Provider.ts" />
/// <reference path="./provider/ProviderFactory.ts" />
/// <reference path="../../typings/globals/jquery/index.d.ts" />

import * as GitFactory from './provider/ProviderFactory';
import * as IProvider from './provider/Provider';
import $ from 'jquery';
import template from './sidebar.template.js';

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
    this.htmlTemplate = template['sidebar.template.html'];
    this.location = document.location.href;
    let provider: IProvider.GitProvider.GitAbstract = GitFactory.GitProvider.GitFactory.createProvider(this.location);
    $(this.DOM.body).append(this.htmlTemplate);
    //this.DOM.body.append(this.htmlTemplate);
    provider.loadRepo(null);
  }
}

(<any>window).gitXpress = new GitXpress();