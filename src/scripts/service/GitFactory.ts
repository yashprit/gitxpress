import Service from './Service';
import GithubService from './GithubService';

export default class GitFactory {
  public static createProvider(type: any) : Service {
    if(type.href.includes('https://github.com')) {
      return GithubService.getInstance(type);
    }
    return null;
  }
}