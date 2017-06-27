/// <reference path="Provider.ts" />

import * as IProvider from './Provider';

export namespace GitProvider {
  export class GithubProvider implements IProvider.GitProvider.GitAbstract {
    loadRepo= (params:any) => {
      console.log("github provider")
    }
  }
}