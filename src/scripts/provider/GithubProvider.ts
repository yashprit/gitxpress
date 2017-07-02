/// <reference path="Provider.ts" />

import * as IProvider from './Provider';
import * as $ from 'jquery';
import Icon from '../Icon';

function getIcon(path:string):string {
  return 'gitxpress__icon gitxpress__icon--apple';
}

export class GithubProvider implements IProvider.GitAbstract {
    loadRepo = (parsedInfo:IProvider.RepoParam, callback:any) => {
      let treeObj = <any>[];

      let iconElement:Icon = new Icon();
      
      $.getJSON('https://api.github.com/repos/yashprit/gitxpress/git/trees/master?recursive=1', (data:any) => {
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
                    nodes: []
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
                    nodes: []
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
              nodes: []
            });
          }
        });

        callback(treeObj);
      });
    }

    parseUserAndReponame = (url: string): IProvider.RepoParam =>  {
      return <IProvider.RepoParam> {
        repo: "gitxpress",
        username: "yashprit"
      }
    }
  }