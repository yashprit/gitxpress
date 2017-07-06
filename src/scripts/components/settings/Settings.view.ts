import IView from '../IView';

const template:string = `<div class="gitxpress--sidebar__bookmark" id="gxSettingsView">Settings</div>`;

export default class Settings extends IView {

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