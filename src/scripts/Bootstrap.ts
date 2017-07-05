import Store from './Store';

class BootStrap {

  private store:Store;

  constructor(){
    //on dom load start plugin
    document.addEventListener('DOMContentLoaded', this.bootStrap);
  }

  bootStrap(){
    //
    this.store = new Store();
    this.store.dispatch();
  }
}

(<any>window).gitxpress = new BootStrap();