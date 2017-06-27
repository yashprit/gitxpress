/// <reference path="Provider.ts" />
/// <reference path="GithubProvider.ts" />

namespace GitProvider {

  export class GitFactory {
    public static createProvider(type: string) : GitAbstract {
      if(type === 'A') {
        return new GithubProvider();
      }
      return null;
    }
  }
}