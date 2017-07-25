import IView from '../IView';
import Service from './SettingService';

const template:string = `
  <div class="gitxpress--sidebar--settings" id="gxSettingsView">
    <h1>Settings</h1>
    <div class="gitxpress--sidebar--settings__body">
      <div>Link to firebase <span id='gxFirebaseLinkStatus'></span></div>
    </div>
  </div>
`;

export default class Settings extends IView {

  private provider:Service;

  constructor(state:any) {
    super('#gxContentArea', template);
    this.provider = Service.getInstance();
  }

  componentDidRender(){
    $('#gxHeaderArea').html(`<span class="header-navlink gitxpress__sidebar--header--action">Settings</span>`);
  }

  componentWillRender(){

  }
}