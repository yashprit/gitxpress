/// <reference path="Provider.ts" />

namespace GitProvider {
  export class GithubProvider implements GitAbstract {
    loadRepo= (params:any) => {
      console.log("github provider")
    }
  }
}