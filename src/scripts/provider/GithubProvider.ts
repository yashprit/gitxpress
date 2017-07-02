/// <reference path="Provider.ts" />

import {RepoParam, GitAbstract, Tree} from './Provider';
import $ from 'jquery';
import Icon from '../Icon';

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
]

export default class GithubProvider extends GitAbstract {

  getRepoInformation(url: any): RepoParam {
    let paths = url.pathname.split('/');
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

  parseTree(data:any): Array<Tree> {
    let treeObj = new Array<Tree>();
    
    let iconElement:Icon = new Icon();

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
              currentNodeOfRoot.push({
                type: value.type,
                path: value.path,
                url: value.url,
                size: value.size,
                text: paths[i],
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
              currentNodeOfRoot.push({
                type: value.type,
                path: value.path,
                url: value.url,
                size: value.size,
                text: paths[i],
                nodes: new Array<Tree>()
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
            icon: iconElement.icon(keyName)
          });
        }
      } else if(value.type === 'blob'){
        treeObj.push({
          type: value.type,
          path: value.path,
          url: value.url,
          size: value.size,
          text: value.path,
          icon: iconElement.icon(value.path)
        });
      } else {
        treeObj.push({
          type: value.type,
          path: value.path,
          url: value.url,
          size: value.size,
          text: value.path,
          nodes: new Array<Tree>()
        });
      }
    });
    return treeObj;
  }
  
  loadRepo(parsedInfo:RepoParam, callback:any){
    const url = `https://api.github.com/repos/${parsedInfo.username}/${parsedInfo.repo}/git/trees/master?recursive=1`
    this._load(parsedInfo, callback);
  }
}