export interface RepoParam {
  repo: string;
  username: string;
  branch: string;
}

export interface Tree {
  nodes?: Array<Tree>;
  text: string;
  type: string;
  path: string;
  url: string;
  size?: number;
  icon?: string;
  href:string
}

export abstract class GitAbstract {
  abstract loadRepo(parsedInfo:RepoParam, callback:any) :void;
  abstract getRepoInformation(url:string): RepoParam;
  abstract parseTree(data:any, parsedInfo:RepoParam) :Array<Tree>; 
  _load = (parsedInfo:RepoParam, callback:any) => {
    const url = `https://api.github.com/repos/${parsedInfo.username}/${parsedInfo.repo}/git/trees/${parsedInfo.branch}?recursive=1`
    $.getJSON(url, (data:any) => {
      let parsedTreeObj:Array<Tree> =  this.parseTree(data, parsedInfo);
      callback(parsedTreeObj);
    });
  }
}

export interface GitTree {

}