import IView from './IView';
import $ from 'jquery';
import 'jquery-pjax';
import {TreeInfo, Service, RepoParam} from '../service';

const template:string = `
  <div class="gitxpress--sidebar__tree" id="gxTreeView">
    <div class="gitxpress-sidebar__spinner">
      <div class="spinner">
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div>
      </div>
    </div>
  </div>
`;

const header:string = `
  <span class="header-navlink gitxpress__sidebar--header--action">Tree</span>
`

export default class TreeView extends IView {
  
  private provider:Service;
  private parsedInfo:RepoParam;

  constructor(state:any, service:Service) {
    super('#gxContentArea', template);
    this.provider = service;
    this.parsedInfo = this.provider.getRepoInformation(this.location);
  }

  componentWillRender(){
    console.log('empty did render')
  }

  componentDidRender(){
    if(this.parsedInfo) {
      if(this.provider.parsedTree && this.provider.parsedTree.repoInfo.branch == this.parsedInfo.branch) {
        this.populateTree(this.provider.parsedTree);
      } else {
        this.provider.loadRepo(this.parsedInfo, this.populateTree);
      }
    } else {
      //handle error while not able to parse username and password
    }
  }

  handleFileSelect = (e) => {
    this.provider.selectFile(e, '#js-repo-pjax-container');
    e.preventDefault();
  }

  populateTree = (parsedRepoInfo:TreeInfo):void => {
    $('#gxHeaderArea').html(header);
    const treeConfig = {
      data: parsedRepoInfo.tree,
      showBorder: false,
      enableLinks:true,
      levels: 0,
      expandIcon: 'gitxpress__icon gitxpress__icon--folder',
      collapseIcon: 'gitxpress__icon gitxpress__icon--folder'
    }
    $('#gxTreeView').treeview(treeConfig);
    $(document).on('click', '.node-gxTreeView > a', this.handleFileSelect);
  }
}