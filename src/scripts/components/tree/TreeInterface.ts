import {RepoParam, Tree, TreeInfo} from './FunctionalInterface';

export default abstract class TreeInterface {
  abstract loadRepo(parsedInfo:RepoParam, callback:any) :void;
  abstract getRepoInformation(url:string): RepoParam;
  abstract parseTree(data:any, parsedInfo:RepoParam) :Array<Tree>; 
  public parsedTree:TreeInfo;
  _load = (parsedInfo:RepoParam, callback:any) => {
    const url = `https://api.github.com/repos/${parsedInfo.username}/${parsedInfo.repo}/git/trees/${parsedInfo.branch}?recursive=1`
    $.getJSON(url, (data:any) => {
      let parsedTreeObj:Array<Tree> =  this.parseTree(data, parsedInfo);
      this.parsedTree = {
        repoInfo: parsedInfo,
        tree: parsedTreeObj
      }
      callback(this.parsedTree);
    });
  }

  selectFile(e:any, container:string){
    window.open(e, '_blank');
  }
}