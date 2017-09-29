import IView from './IView';
import { Tag } from '../service';

const template:string = `<div class="gitxpress__sidebar--bookmark" id="gxBookmarkView"></div>`;

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
    }, []).join('');

    let tagHtmlList = `<select class="gitxpress__sidebar--bookmark__list--dropdown"><option value="all">All</option>${tagList}</select>`;

    let repoList = this.findRepos().reduce((acc:Array<String>, value:String, key:Number) => {
      let repoPath = value.split('_').join('/');
      let repoElement = `<li>
        <a href="https://github.com/${repoPath}">
          <span>${repoPath}</span>
        </a>
      </li>`;

      acc.push(repoElement);
      return acc;
    }, []).join('');

    $('#gxBookmarkView').html(`${tagHtmlList}<ul class="gitxpress__sidebar--bookmark__list">${repoList}</ul>`);
  }

  componentWillRender(){}

  findRepos(tag?:string) {

    let tagsValue:Tag = this.props.state.tags;

    if(tag) {
      let obj:Tag = {};
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