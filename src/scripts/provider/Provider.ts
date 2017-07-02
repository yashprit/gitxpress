export interface RepoParam {
  repo: string;
  username: string
}

export interface GitAbstract {
  loadRepo(parsedInfo:RepoParam, callback:any) :void;
  parseUserAndReponame(url:string): RepoParam
}