//this is main service, define eveything which is common to entire application
import { RepoParam, TreeInfo, Tree, Bookmark } from './FunctionalInterface';
import IStorage from './IStorage';

export default abstract class Service {

  private tags:Bookmark;
  private storage:IStorage;
  url:any;

  constructor(url:any, storage:IStorage) {
    this.url = url;
    this.storage = storage;
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

  getAllTags(){
    let currentState = this.storage.get('__gitxpress__').then((value:any) => {
      let isUserAuthenticated = currentState.isFirebaseAuthenticated;
      
      return new Promise((resolve:any, reject:any) => {
        if(isUserAuthenticated) {
          //make api call to firebase, store inside allTags
        } else {
          this.bookmarks = currentState.bookmarks || {};
          let tagKeys = Object.keys(this.bookmarks);
          resolve(tagKeys);
        }
      });
    }, (error:any) => {
      console.error(error);
    });
  }

  saveTag(repoParam:RepoParam, tagKey:string){
    let key = `${repoParam.username}${repoParam.branch}`;
    let index = Object.keys(this.tags).findIndex((value:string, index:number) => {
      return value == tagKey;
    });

    if(index === -1) {
      this.tags[tagKey] = [key]
    } else {
      this.tags[tagKey].push(key);
    }
  }

  getCurrentRepoTags(repoParam:RepoParam){
    let keyVal = `${repoParam.username}${repoParam.branch}`;

    return Object.keys(this.tags).reduce((acc:Array<string>, value:string, key:number) => {
      if(this.tags[value].indexOf(keyVal) >= 0 ) {
        acc.push(value);
      }
      return acc;
    }, []);
  }
}