import IView from './IView';
import { RepoParam, Tag, Bookmark } from '../service/';
import * as octicons from "octicons";
import * as $ from 'jquery';

const tagIcon:string = octicons['three-bars'].toSVG();

const template:string = 
`
  <li>
    <div class="popover-wrapper select-menu js-menu-container js-select-menu js-transitionable">
      <a href="#" data-role="popover" data-target="gxBookmark" class="gitxpress--btn">
        <span class="js-select-button">
          <%this.tagIcon%>
          Bookmark
        </span>
      </a>
      <div class="popover-modal gxBookmark">
        <div class="popover-header select-menu-header">Bookmarks
          <a href="#" data-toggle-role="close" style="float: right">
            <svg aria-label="Close" class="octicon octicon-x js-menu-close" height="16" role="img" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48z"></path></svg>
          </a>
        </div>
        <div class="popover-body">
          <ul id="gxAvaiableTags" class="gitxpress__tag-popup--tags"></ul>
          <div class="gitxpress__tag-popup--tag-box">
            <input type="text" placeholder="enter tag name, press enter" id="gxNewTagValue">
            <button id="gxAddTag" class="gitxpress__tag-popup--tag-action">Add</button>
          </div>
          <button id="gxUpdateTag" class="gitxpress__tag-popup--tag-action">Done</button>
        </div>
      </div>
    </div>
  </li>
`;

export default class BookmarkPopupView extends IView {

  private props:any;
  private bookmark:Bookmark;

  constructor(props:any) {
    super('.pagehead-actions', template);
    this.props = props;
    this.bookmark = props.state.bookmark;
  }

  componentWillRender(){}

  componentDidRender(){
    this.renderTags();
    $('[data-role="popover"]').popover();
    $('#gxAddTag').on("click", this.onTagAdd);
    $('#gxUpdateTag').on("click", this.onTagUpdate);
    $('#gxNewTagValue').on("keypress", this.onTagAdd);
    $("ul").on("change", "li.md-checkbox > input[type='checkbox']", this.onTagChanged);
  }

  renderTags(){
    let currentRepo:RepoParam = this.props.provider.getRepoInformation(document.location.href);
    let repoStr:string = `${currentRepo.username}_${currentRepo.repo}`;
    let keys = Object.keys(this.bookmark);
    let allTagsHtml = keys.reduce((acc:Array<string>, value:string, index:number ) => {
      acc.push(this.renderTagList(this.bookmark[value].tags, repoStr == value));
      return acc;
    }, []).join('');

    $("#gxAvaiableTags").html(allTagsHtml);
  }

  renderTagList(elements:Array<string>, isCurrentRepo:boolean){
    return elements.reduce((acc:Array<string>, value:string, index:number) => {
      let checkBoxStatus = isCurrentRepo ? `<input id="gxtag_${value}" type="checkbox" data-name="${value}" checked>` :`<input id="gxtag_${value}" type="checkbox" data-name="${value}" >`;
      acc.push(`<li class='md-checkbox'>${checkBoxStatus}<label for="gxtag_${value}">${value}</label></li>`);
    }, []).join('');
  }

  onTagAdd = (e:any) => {
    let currentRepo:RepoParam = this.props.provider.getRepoInformation(document.location.href);
    let repoStr = `${currentRepo.username}_${currentRepo.repo}`;
    if(event.type === 'click' || e.keyCode == 13) {
      let tagValue:string = <string>$('#gxNewTagValue').val();
      if(this.tags[tagValue]) {
        //error
      } else {
        this.tags[tagValue] = [];
        this.tags[tagValue].push(repoStr);
        $('#gxNewTagValue').val("");
        this.updateTags(this.tags, currentRepo);
      }
    }
  }

  onTagUpdate = (e:any) => {
    this.props.addTag(this.tags);
  }

  onTagChanged = (e:any) => {
    let currentRepo:RepoParam = this.props.provider.getRepoInformation(document.location.href);
    let repoStr = `${currentRepo.username}_${currentRepo.repo}`;
    let tagName = $(e.currentTarget).data('name');
    let repos = this.tags[tagName];
    let index = repos.indexOf(repoStr);
    
    if($(e.currentTarget).is(":checked")) {
      if (index == -1) {
        this.tags[tagName].push(repoStr);
      }
    } else {
      if (index > -1) {
        repos.splice(index, 1);
      }
      this.tags[tagName] = repos;
    }
    e.preventDefault();
  }

  initView(){
    let currentRepo:RepoParam = this.props.provider.getRepoInformation(document.location.href);
    if(currentRepo) {
      this.updateTags(this.props.state.tags, currentRepo);
      let tagIcon:string = octicons['bookmark'].toSVG();
      this.render({tagIcon: tagIcon}, 'prepend');
    } else {
      //not a repo page
    }
  }

  /*updateTags(tags:Tag={}, currentRepo:RepoParam) {
    let repoStr = `${currentRepo.username}_${currentRepo.repo}`;
    let stateHtmlStr = Object.keys(tags).reduce((acc:Array<string>, value:string, key:number) => {
      let checkBoxStatus = tags[value].indexOf(repoStr) > -1 ? `<input id="gxtag_${value}" type="checkbox" data-name="${value}" checked>` :`<input id="gxtag_${value}" type="checkbox" data-name="${value}" >`;
      acc.push(`<li class='md-checkbox'>${checkBoxStatus}<label for="gxtag_${value}">${value}</label></li>`);
      return acc;
    }, []).join('');

    $('#gxAvaiableTags').html(stateHtmlStr);
  }*/
}