import IView from './IView';

const template:string = `
  <div class="gitxpress__sidebar--settings" id="gxSettingsView">
    <h1>Settings</h1>
    <div class="gitxpress--sidebar--settings__body">
      <div>Link to firebase <span id='gxFirebaseLinkStatus'></span></div>
    </div>
  </div>
`;

export default class Settings extends IView {

  constructor(state:any) {
    super('#gxContentArea', template);
  }

  componentDidRender(){
    $('#gxHeaderArea').html(`<span class="header-navlink gitxpress__sidebar--header--action">Settings</span>`);
  }

  componentWillRender(){
    console.log("component will render");
  }
}