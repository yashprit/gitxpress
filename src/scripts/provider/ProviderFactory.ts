import {GitAbstract} from './Provider';
import GithubProvider from './GithubProvider';

export default class GitFactory {
  public static createProvider(type: string) : GitAbstract {
    if(type.includes('https://github.com')) {
      return new GithubProvider();
    }
    return null;
  }
}