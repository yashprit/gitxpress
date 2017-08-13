import Service from './Service';
import GithubService from './GithubService';

export default class TreeFactory {
  public static createProvider(type: string) : Service {
    if(type.includes('https://github.com')) {
      return GithubService.getInstance();
    }
    return null;
  }
}