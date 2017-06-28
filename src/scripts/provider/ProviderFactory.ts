/// <reference path="Provider.ts" />
/// <reference path="GithubProvider.ts" />

import * as IProvider from './Provider';
import * as Provider from './GithubProvider';

export namespace GitProvider {

  export class GitFactory {
    public static createProvider(type: string) : IProvider.GitProvider.GitAbstract {
      if(type.includes('https://github.com')) {
        return new Provider.GitProvider.GithubProvider();
      }
      return null;
    }
  }
}