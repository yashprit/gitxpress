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

export interface TreeInfo {
  repoInfo: RepoParam,
  tree: Array<Tree>
}

export interface Tag {
  owner: string;
  tags: Array<string>;
  description: string;
  avatar: string;
}

export interface Bookmark {
  [key: string]: Tag
}

export interface Action {
  type:string;
  payload?: object
}

export interface Message {
  type:string;
  payload:any;
}