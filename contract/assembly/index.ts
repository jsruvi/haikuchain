import { Context, logging, storage, PersistentVector } from 'near-sdk-as'
import { Haiku } from './models'

const haikuList = new PersistentVector<Haiku>("haiku-list");

export function filterHaikuListByAuthor(accountId: string): Array<Haiku> {
  let result = new Array<Haiku>();

  for (let i = 0; i < haikuList.length; i++) {
    const haiku = haikuList[i];
    if (haiku.author == accountId) {
      result.push(haiku);
    }
  }
  return result;
}

export function getMyHaikuList(accountId: string): Haiku[] {
  return filterHaikuListByAuthor(accountId)
}

export function addHaiku(text: string): void {
  const accountId = Context.sender

  haikuList.push({
    author: accountId,
    text: text,
    price: 0
  })
}
