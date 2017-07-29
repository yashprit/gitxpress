interface Action {
  type:string;
  payload?: object
}


let Storage = {
  set: function(key:string, val:any) {
    localStorage.setItem(key, JSON.stringify(val));
  },

  get: function(key: string):any {
    let value:string = localStorage.getItem(key);
    try {
      let jsonValue:object = JSON.parse(value);
      return jsonValue;
    } catch(e) {
      return value
    }
  }
}

function compareObj(a:object, b:object):boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

export {
  Storage,
  compareObj,
  Action
}

export default function createStore(reducer:any, intialState:any){
  let state = intialState;
  let subscribers = [];

  function subscribe(listener) {
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

  function dispatch(action){
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