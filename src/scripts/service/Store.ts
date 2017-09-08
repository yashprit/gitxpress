function compareObj(a:object, b:object):boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

export {
  compareObj
}

export default function createStore(reducer:any, intialState:any){
  let state = intialState;
  let subscribers:Array<any> = [];

  function subscribe(listener:any) {
    subscribers.push(listener);

    var unsubscribed = false;

    return function() {
      if (!unsubscribed) {
        subscribers.splice(subscribers.indexOf(listener), 1);
        unsubscribed = true;
        return true;
      }
      return false;
    }
  }

  function dispatch(action:any){
    state = reducer(state, action);

    subscribers.forEach((subscriber) => {
      subscriber(state, action.type);
    });
  }

  function getState(){
    return state;
  }

  return {dispatch, subscribe, getState};

}