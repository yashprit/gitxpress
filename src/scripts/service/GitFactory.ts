import Service from './Service';
import GithubService from './GithubService';
import IStorage from './IStorage';

export default class GitFactory {
  public static createProvider(type: any, storage:IStorage) : Service {
    if(type.href.includes('https://github.com')) {
      return GithubService.getInstance(type, storage);
    }
    return null;
  }
}