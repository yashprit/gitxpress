import Service from './Service';
import {RepoParam, Tree} from './FunctionalInterface';
import * as $ from 'jquery';
import Icon from '../Icon';
import IStorage from './IStorage';

const GIT_KEYWORD = [
  'settings', 'orgs', 'organizations',
  'site', 'blog', 'about', 'explore',
  'styleguide', 'showcases', 'trending',
  'stars', 'dashboard', 'notifications',
  'search', 'developer', 'account',
  'pulls', 'issues', 'features', 'contact',
  'security', 'join', 'login', 'watching',
  'new', 'integrations', 'gist', 'business',
  'mirrors', 'open-source', 'personal',
  'pricing', 'followers', 'following', 'repositories'
];

export default class GithubProvider extends Service {

  private static instance:GithubProvider;

  constructor(url:string, storage:IStorage) {
    super(url, storage);
  }

  static getInstance(url:string, storage:IStorage) {
    if (!GithubProvider.instance) {
      GithubProvider.instance = new GithubProvider(url, storage);
    }
    return GithubProvider.instance;
  }

  getRepoInformation(): RepoParam {
    let paths = this.url.pathname.split('/');
    let username = paths[1];
    let repo = paths[2];

    const branchName = $('.branch-select-menu .select-menu-item.selected').data('name') || 'master';

    if(username && repo && GIT_KEYWORD.indexOf(username) === -1 &&  GIT_KEYWORD.indexOf(repo) === -1) {
      return <RepoParam> {
        repo: repo,
        username: username,
        branch: branchName
      } 
    }
    return null;
  }

  parseTree(data:any, parsedInfo:RepoParam): Array<Tree> {
    let treeObj = new Array<Tree>();
    
    let iconElement:Icon = new Icon();

    const username = parsedInfo.username;
    const repoName = parsedInfo.repo;
    const branch = parsedInfo.branch;

    data.tree.forEach((value:any, key:number) => {
      if (value.path.indexOf('/') !== -1) {
        let currentNodeOfRoot = treeObj;
        let paths = value.path.split('/');
        if (value.type === 'tree') {
          for (var i = 0; i < paths.length; i++) {
            let index = currentNodeOfRoot.findIndex((value:any) => {
              return value.text === paths[i]
            });
            if (index !== -1) {
              currentNodeOfRoot = currentNodeOfRoot[index].nodes;
            } else {
              let pathValue = paths.slice(0, i+1).join("/");
              currentNodeOfRoot.push({
                type: value.type,
                path: value.path,
                url: value.url,
                size: value.size,
                text: paths[i],
                href: `/${username}/${repoName}/${value.type}/${branch}/${pathValue}`,
                nodes: new Array<Tree>()
              })
              let index = currentNodeOfRoot.length - 1;
              currentNodeOfRoot = currentNodeOfRoot[index].nodes;
            }
          }
        } else if (value.type === 'blob') {
          let keyName = paths.pop();
          for (let i = 0; i < paths.length; i++) {
            let index = currentNodeOfRoot.findIndex((value:any) => {
              return value.text === paths[i]
            });
            if (index !== -1) {
              currentNodeOfRoot = currentNodeOfRoot[index].nodes;
            } else {
              let pathValue = paths.slice(0, i+1).join("/");
              currentNodeOfRoot.push({
                type: value.type,
                path: value.path,
                url: value.url,
                size: value.size,
                text: paths[i],
                nodes: new Array<Tree>(),
                href: `/${username}/${repoName}/${value.type}/${branch}/${pathValue}`,
              })
              let index = currentNodeOfRoot.length - 1;
              currentNodeOfRoot = currentNodeOfRoot[index].nodes;
            }
          }
          currentNodeOfRoot.push({
            type: value.type,
            path: value.path,
            url: value.url,
            size: value.size,
            text: keyName,
            icon: iconElement.icon(keyName),
            href: `/${username}/${repoName}/${value.type}/${branch}/${value.path}`
          });
        }
      } else if(value.type === 'blob'){
        treeObj.push({
          type: value.type,
          path: value.path,
          url: value.url,
          size: value.size,
          text: value.path,
          icon: iconElement.icon(value.path),
          href: `/${username}/${repoName}/${value.type}/${branch}/${value.path}`
        });
      } else {
        treeObj.push({
          type: value.type,
          path: value.path,
          url: value.url,
          size: value.size,
          text: value.path,
          nodes: new Array<Tree>(),
          href: `/${username}/${repoName}/tree/${branch}/${value.path}`
        });
      }
    });

    function sortNodesAndChildren(nodes:any) {
      nodes.sort((a:any, b:any) => {
        if(a.type === b.type) {
          let nameA = a.text.toUpperCase(); 
          let nameB = b.text.toUpperCase(); 
          if (nameA < nameB) {
            return -1;
          }
          
          if (nameA > nameB) {
            return 1;
          }

          return 0;
        } else {
          if(a.type === 'tree') {
            return -1
          }

          if(b.type === 'tree') {
            return 1
          }

          return 0;
        }
      });
      nodes.forEach(function (node:any) {
        if (node.nodes) {
          sortNodesAndChildren(node.nodes);
        }
      })
    }

    sortNodesAndChildren(treeObj);

    return treeObj;
  }
  
  loadRepo(parsedInfo:RepoParam, callback:any){
    const url = `https://api.github.com/repos/${parsedInfo.username}/${parsedInfo.repo}/git/trees/master?recursive=1`
    this._load(parsedInfo, callback);
  }

  selectFile(e:any, container:string){
    ($.pjax as any).click(e, {container: container})
  }
}