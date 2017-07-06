import IView from '../IView';

const template:string = `<div class="gitxpress--sidebar__settings" id="gxBookmarkView">BookMark</div>`;

export default class BookmarkView extends IView {

  private location:any;

  constructor() {
    super('#gxContentArea', template);
  }

  componentDidRender(){
    console.log('empty did render')
  }

  componentWillRender(){

  }

}