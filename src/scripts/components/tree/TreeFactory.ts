import TreeInterface from './TreeInterface';
import GithubTreeImpl from './GithubTreeImpl';

export default class TreeFactory {
  public static createProvider(type: string) : TreeInterface {
    if(type.includes('https://github.com')) {
      return GithubTreeImpl.getInstance();
    }
    return null;
  }
}