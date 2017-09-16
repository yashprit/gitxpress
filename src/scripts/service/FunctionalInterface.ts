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
  [key: string]: Array<string>
}

export interface Action {
  type:string;
  payload?: object
}