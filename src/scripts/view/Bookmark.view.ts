import IView from './IView';

const template:string = `<div class="gitxpress--sidebar__settings" id="gxBookmarkView">BookMark</div>`;

export default class BookmarkView extends IView {

  private location:any;

  constructor(state:any) {
    super('#gxContentArea', template);
  }

  componentDidRender(){
    $('#gxHeaderArea').html(`<span class="header-nav-link gitxpress__sidebar--header--action">Bookmark</span>`);
  }

  componentWillRender(){

  }

}