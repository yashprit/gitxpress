import IView from './IView';
import { Tag, Bookmark } from '../service';
import * as octicons from "octicons";

const template:string = `
  <div class="gitxpress__sidebar--bookmark" id="gxBookmarkView">
    <select class="gitxpress__sidebar--bookmark__list--dropdown" placeholder="Type your tag..."></select>
    <ul class="gitxpress__sidebar--bookmark__list"></ul>
  </div>
`;

export default class BookmarkView extends IView {

  private props:any;
  private tags:Tag;

  constructor(props:any) {
    super('#gxContentArea', template);
    this.props = props;
    this.tags = props.state.tags || {};
  }

  componentDidRender(){
    $('#gxHeaderArea').html(`<span class="gitxpress__sidebar--header--action">Bookmark</span>`);
    let tagList = Object.keys(this.tags).reduce((acc:Array<String>, value:String, key:Number) => {
      acc.push(`<option value="${value}">${value}</option>`);
      return acc;
    }, ['<option value="all">All</option>']).join('');
    $('#gxBookmarkView select').html(tagList);
    $('#gxBookmarkView select').selectize();

    let repoListPromise = this.findRepos().reduce((acc:Array<any>, value:String, key:Number) => {
      let repoPath = value.split('_').join('/');
      let repoPromise = new Promise((resolve:Function, reject:Function) => {
        $.getJSON(`https://api.github.com/repos/${repoPath}`, (data:any) => {
          let description = data.description.replace(/:([a-zA-Z]*):/, "").trim();
          let download:string = octicons['cloud-download'].toSVG();
          let repoElement = `
          <li>
            <div style="text-align: right;">
              <a href="https://github.com/${repoPath}/archive/master.zip" download>${download}</a>
            </div>
            <div class="gitxpress__sidebar--bookmark__list--left gitxpress--clearfix">
              <a href="${data.owner.html_url}">
                <img src="${data.owner.avatar_url}&s=40" alt="${data.owner.login}" class="circle">
              </a>
            </div>
            <div class="gitxpress__sidebar--bookmark__list--right gitxpress--clearfix">
              <a href="https://github.com/${repoPath}">${repoPath}</a>
              <span title=${description}>${description}</span>
            </div>
            <div style="clear:both;">
              <span class="topic-tag topic-tag-link">sample</span>
              <span class="topic-tag topic-tag-link">another</span>
            </div>
          </li>`;
          resolve(repoElement);
        })
      });
      acc.push(repoPromise);
      return acc;
    }, []);

    Promise.all(repoListPromise).then((data:any) => {
      console.log(data);
      $('#gxBookmarkView ul').html(data.join(''));
    }, (error:any) => {

    })

    //$('#gxBookmarkView ul').html(repoList);
  }

  componentWillRender(){}

  findRepos(tag?:string) {

    let tagsValue:Tag = this.props.state.tags;

    if(tag) {
      let obj:Bookmark = {};
      obj[tag] = <Array<string>>this.tags[tag];
      tagsValue = obj;
    }

    return Object.keys(tagsValue).reduce((acc:Array<string>, value:string, key:number) => {
      let repos = tagsValue[value];
      acc = acc.concat(repos);
      return acc;
    }, []);
  }
}