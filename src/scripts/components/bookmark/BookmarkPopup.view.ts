import IView from '../IView';
import octicons from "octicons";
import $ from 'jquery';
import BookmarkService from './BookmarkService';

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
                </div>
                <button id="gxAddTag" class="gitxpress__tag-popup--tag-action">Add</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </li>
`;

export default class BookmarkPopupView extends IView {

  private location:any;
  private props:any;
  private service:BookmarkService;

  constructor(props:any) {
    super('.pagehead-actions', template);
    this.props = props;
  }

  componentWillRender(){
    this.service = BookmarkService.getInstance();
  }

  componentDidRender(){
    $('#gxAddTag').on("click", this.onTagAdd);
    $('#gxNewTagValue').on("keypress", this.onTagAdd);
  }

  onTagAdd = (e) => {
    if(event.type === 'click' || e.keyCode == 13) {
      let tagValue = $('#gxNewTagValue').val();
      $('#gxNewTagValue').val("")
      this.props.addTag(tagValue);
    }
  }

  initView(){
    let tagIcon:string = octicons['bookmark'].toSVG();
    this.render({
      tags: this.props.state.tags,
      tagIcon: tagIcon
    }, 'prepend');
  }

  updateTags(state:any) {
    let stateHtml = [];
    for(let i = 0; i < state.tags.length; i++) {
      stateHtml.push(`
        <li class='md-checkbox'>
          <input id="gxtag_${state.tags[i]}" type="checkbox">
          <label for="gxtag_${state.tags[i]}">${state.tags[i]}</label>
        </li>`
      );
    }
    $('#gxAvaiableTags').html(stateHtml.join(''));
  }
}