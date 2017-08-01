import { Storage } from '../../Store';
import { RepoParam } from '../../FunctionalInterface';

interface Tag {
  key: string,
  repos: Array<string>
}

export default class BookmarkService {

  private static instance:BookmarkService;

  private tags:Array<Tag>;

  static getInstance(){
    if (!BookmarkService.instance) {
      BookmarkService.instance = new BookmarkService();
    }
    return BookmarkService.instance;
  }

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
}