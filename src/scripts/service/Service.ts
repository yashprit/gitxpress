//this is main service, define eveything which is common to entire application
import { RepoParam, Tag, TreeInfo, Tree } from './FunctionalInterface';
import Storage from './Storage';

export default abstract class Service {

  private tags:Array<Tag>;

   getAllTags(){
    let currentState = Storage.get('__gitxpress__');

    let isUserAuthenticated = currentState.isFirebaseAuthenticated;

    return new Promise((resolve:any, reject:any) => {
      if(isUserAuthenticated) {
        //make api call to firebase, store inside allTags
      } else {
        this.tags = currentState.tags || [];
        let tagKeys = this.tags.map((value:Tag) => value.key);
        resolve(tagKeys);
      }
    });
  }

  saveTag(repoParam:RepoParam, tagKey:string){
    let key = `${repoParam.username}${repoParam.branch}`;
    let index = this.tags.findIndex((value:Tag, index:number) => {
      return value.key === tagKey;
    });

    if(index === -1) {
      this.tags.push({
        key: tagKey,
        repos: [key]
      })
    } else {
      this.tags[index].repos.push(key);
    }
  }

  getCurrentRepoTags(repoParam:RepoParam){
    let key = `${repoParam.username}${repoParam.branch}`;

    return this.tags.reduce((acc:string[], value:Tag, key:number) => {
      if(value.repos.indexOf('key') >= 0 ) {
        acc.push(value.key);
      }
      return acc;
    }, []);
  }

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