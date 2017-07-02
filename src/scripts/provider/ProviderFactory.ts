import * as IProvider from './Provider';
import * as Provider from './GithubProvider';

export class GitFactory {
  public static createProvider(type: string) : IProvider.GitAbstract {
    if(type.includes('https://github.com')) {
      return new Provider.GithubProvider();
    }
    return null;
  }
}