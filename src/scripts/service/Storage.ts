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

export default Storage;