import IStorage, {StorageData} from './IStorage';
import { isEmpty } from '../Utils';

export default class ChromeStorage extends IStorage {
  set(key:string, val:any) {

    return new Promise((resolve:Function, reject:Function) => {
      this.get(key).then((value:StorageData) => {
        
        let newValue:StorageData = value? Object.assign({}, value, val) : Object.assign({}, val);
        
        chrome.storage.local.set({
          [key]: newValue
        }, () => {
          if (chrome.runtime.error) {
            reject(chrome.runtime.error)
          } else {
            resolve(newValue)
          }
        });
      }, (error:any) => {
        reject(error);
      })
    });
  }

  get(key: string):any {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, (result:any) => {
        if (!chrome.runtime.error) {
          let data = isEmpty(result)? undefined : result[key];
          resolve(data);
        } else {
          reject(chrome.runtime.error);
        }
      });
    })
  }
}