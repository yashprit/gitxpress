import IView from './IView';
import { RepoParam, Tag } from '../service/';
import octicons from "octicons";
import $ from 'jquery';

const tagIcon:string = octicons['three-bars'].toSVG();

const template:string = `
  <li>
    <div class="select-menu js-menu-container js-select-menu js-transitionable">
      <a href="javascript:void(0)" class=" btn btn-sm select-menu-button js-menu-target css-truncate" role="button" aria-haspopup="true" aria-expanded="true" aria-label="Toggle repository notifications menu" data-ga-click="Repository, click Watch settings, action:files#disambiguate">
        <span class="js-select-button">
          <%this.tagIcon%>
          Tag
        </span>
      </a>
      <div class="select-menu-modal-holder">
        <div class="select-menu-modal subscription-menu-modal js-menu-content" aria-expanded="false">
          <div class="select-menu-header js-navigation-enable" tabindex="-1">
            <svg aria-label="Close" class="octicon octicon-x js-menu-close" height="16" role="img" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48z"></path></svg>
            <span class="select-menu-title">Tags</span>
          </div>
          <div class="select-menu-list js-navigation-container js-active-navigation-container" role="menu">
            <div class="select-menu-item" role="menuitem" tabindex="0" style="padding: 10px;">
              <div class="select-menu-item-text">
                <ul id="gxAvaiableTags" class="gitxpress__tag-popup--tags"></ul>
                <div class="gitxpress__tag-popup--tag-box">
                  <input type="text" placeholder="enter tag name, press enter" id="gxNewTagValue">
                  <button id="gxAddTag" class="gitxpress__tag-popup--tag-action">Add</button>
                </div>
                <button id="gxUpdateTag" class="gitxpress__tag-popup--tag-action">Done</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </li>
`;

export default class BookmarkPopupView extends IView {

  private props:any;
  private tags:Array<any>;

  constructor(props:any) {
    super('.pagehead-actions', template);
    this.props = props;
    this.tags = props.state.tags;
  }

  componentWillRender(){
    console.log("Will render")
  }

  componentDidRender(){
    $('#gxAddTag').on("click", this.onTagAdd);
    $('#gxUpdateTag').on("click", this.onTagUpdate);
    $('#gxNewTagValue').on("keypress", this.onTagAdd);
    $("ul").on("change", "li.md-checkbox > input[type='checkbox']", this.onTagChanged);
    this.updateTags(this.props.state.tags);
  }

  onTagAdd = (e:any) => {
    let currentRepo:RepoParam = this.props.provider.getRepoInformation(document.location.href);

    let repoStr = `${currentRepo.username}_${currentRepo.repo}`;

    if(event.type === 'click' || e.keyCode == 13) {
      let tagValue = $('#gxNewTagValue').val();
      if(this.tags[tagValue]) {
        //error
      } else {
        this.tags[tagValue] = [];
        this.tags[tagValue].push(repoStr);
        $('#gxNewTagValue').val("");
        this.updateTags(this.tags);
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
    let tagIcon:string = octicons['bookmark'].toSVG();
    this.render({tagIcon: tagIcon}, 'prepend');
  }

  updateTags(tags:Array<any>=[]) {
    let currentRepo:RepoParam = this.props.provider.getRepoInformation(document.location.href);
    let repoStr = `${currentRepo.username}_${currentRepo.repo}`;
    let stateHtmlStr = Object.keys(tags).reduce((acc:String, value:String, key:number) => {
      let checkBoxStatus = tags[value].indexOf(repoStr) > -1 ? `<input id="gxtag_${value}" type="checkbox" data-name="${value}" checked>` :`<input id="gxtag_${value}" type="checkbox" data-name="${value}" >`;
      acc.push(`<li class='md-checkbox'>${checkBoxStatus}<label for="gxtag_${value}">${value}</label></li>`);
      return acc;
    }, []).join('');

    $('#gxAvaiableTags').html(stateHtmlStr);
  }
}