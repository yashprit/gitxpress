export interface Action {
  type:string;
  payload?: object
}

export class Storage {
  set(key:string, val:any):void {
    localStorage.setItem(key, JSON.stringify(val));
  }

  get(key: string):any {
    let value:string = localStorage.getItem(key);
    try {
      let jsonValue:object = JSON.parse(value);
      return jsonValue;
    } catch(e) {
      return value
    }
  }
}

export function compareObj(a:object, b:object):boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

export default class Store {
  private currentState:object;
  private actions: object;
  private storage: Storage;

  constructor(actions:object) {
    this.storage = new Storage();
    this.actions = actions;
    this.currentState = {};

    this.dispatch({
      type: 'INIT',
      payload: this.storage.get('gxStore') || {
        page: 'tree',
        sidebarWith: 301
      }
    });
  }

  _setOrUpdateCurrentState(payload:any):boolean{
    let newState = Object.assign({}, this.currentState, payload || {});

    if(compareObj(this.currentState, newState)) {
      return false
    } else {
      this.currentState = newState;
      this.storage.set('gxStore', this.currentState);
      return true;
    }
  }

  dispatch(action:Action) {
    if(this._setOrUpdateCurrentState(action.payload)){
      (<any>this.actions)[action.type](this.currentState, action.type);
    }
  }

  get state(){
    return this.currentState;
  }
}