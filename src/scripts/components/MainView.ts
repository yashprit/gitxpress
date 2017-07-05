import IView from './IView';
import octicons from "octicons";

const template:string = `
  <div class="gitxpress" id="gxMainView">
    <a class="push gitxpress--toogle-link tooltipped-s js-menu-target" id="gxSideMenuLink">{{templateIcon}}</a>
  </div>
`;

export default class MainView extends IView{

  constructor() {
    super(template);
  }

  render() {
    let templateIcon:object = octicons['three-bars'].toSVG();
    this.compile(templateIcon);
    this.addOrUpdateDom();
  }
}