import IStorage, { StorageData } from './IStorage';
import ChromeStorage from './ChromeStorage';
import { whichBrowser, BrowserType } from './Browser';

class StorageFactory {
  public static createProvider(version:BrowserType) : IStorage {
    if(version.isChrome) {
      return new ChromeStorage();
    }
    return new IStorage()
  }
}

export {
  StorageFactory,
  IStorage,
  ChromeStorage,
  StorageData
}