import IView from '../IView';
import TreeFactory from './TreeFactory';
import TreeInterface from './TreeInterface';
import $ from 'jquery';
import 'jquery-pjax';
import {Tree, RepoParam, TreeInfo} from './FunctionalInterface';

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

export default class TreeView extends IView {
  
  private provider:TreeInterface;
  private parsedInfo:RepoParam;
  private location:any;

  constructor() {
    super('#gxContentArea', template);
    this.location = document.location;
    this.provider = TreeFactory.createProvider(this.location.href);
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
  }

  populateTree = (parsedRepoInfo:TreeInfo):void => {
    $('#gxTreeView').treeview({
      data: parsedRepoInfo.tree,
      showBorder: false,
      enableLinks:true,
      levels: 0,
      expandIcon: 'gitxpress__icon gitxpress__icon--folder',
      collapseIcon: 'gitxpress__icon gitxpress__icon--folder'
    });
    $(document).on('click', '.node-gxTreeView > a', this.handleFileSelect);
  }
}