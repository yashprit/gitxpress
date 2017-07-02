export default class Icons {
  private iconsMap: object

  constructor() {
    this.iconsMap = {
      'babelrc': 'babel',
      'editorconfig': 'editorconfig',
      'gitignore': 'gitignore',
      'gitkeep': 'github',
      LICENSE:'license',
      md: 'markdown',
      js: 'javascript',
      json: 'json',
      ts: 'typescript',
      png: 'image'
    }
  }

  icon = (fileName:string):string => {
    let extensionSplit = fileName.split('.');
    let extension = extensionSplit.pop();

    let iconName = (<any>this.iconsMap)[extension] || 'newFile';

    return `gitxpress__icon gitxpress__icon--${iconName}`;
  }
}