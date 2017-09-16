import IStorage, {StorageData} from './IStorage';

export default class ChromeStorage extends IStorage {
  set(key:string, val:any) {

    return new Promise((resolve:Function, reject:Function) => {
      this.get(key).then((value:any) => {
        console.log(value)
        let obj:StorageData = value[key];
        let data:any = {};
        if(obj) {
          
        } else {
          data[key] = val
        }

        console.log(obj, val, data);
        
        chrome.storage.local.set(data);
        resolve()
      }, (error:any) => {
        reject(error);
      })
    });
  }

  get(key: string):any {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, (result:StorageData) => {
        resolve(result)
      });
    })
  }
}