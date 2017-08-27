import IView from './IView';

const template:string = `<div class="gitxpress__sidebar--bookmark" id="gxBookmarkView"></div>`;

export default class BookmarkView extends IView {

  private props:any;

  constructor(props:any) {
    super('#gxContentArea', template);
    this.props = props;
  }

  componentDidRender(){
    $('#gxHeaderArea').html(`<span class="gitxpress__sidebar--header--action">Bookmark</span>`);
    let tagList = Object.keys(this.props.state.tags).reduce((acc:Array<String>, value:String, key:Number) => {
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

  componentWillRender(){
    console.log("will render");
  }

  findRepos(tag?:String) {

    let tagValue = tag? {[tag]: this.props.state.tags[tag]}: this.props.state.tags;

    return Object.keys(tagValue).reduce((acc:Array<String>, value:String, key:Number) => {
      let repos = tagValue[value];
      acc = acc.concat(repos);
      return acc;
    }, []);
  }


}