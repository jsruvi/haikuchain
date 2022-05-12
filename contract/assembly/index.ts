import { Context, logging, PersistentVector, ContractPromiseBatch } from 'near-sdk-as'
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

export function removeHaikuById(accountId: string, id: string): void {
  for (let i = 0; i < haikuList.length; i++) {
    const haiku = haikuList[i];
    if (haiku.author == accountId && haiku.id == id) {
      haikuList.swap_remove(i);
      break;
    }
  }
}

export function getMyHaikuList(accountId: string): Haiku[] {
  return filterHaikuListByAuthor(accountId)
}

export function addHaiku(text: string, price: u64): Haiku[] {
  const accountId = Context.sender
  const createdAt = Context.blockTimestamp;

  haikuList.push({
    id: Context.blockIndex.toString(),
    author: accountId,
    owner: accountId,
    text: text,
    price: price as u64,
    createdAt: createdAt,
    selling: false,
  });

  return filterHaikuListByAuthor(accountId);
}

export function removeHaiku(id: string): Haiku[] {
  const accountId = Context.sender

  removeHaikuById(accountId, id);

  return filterHaikuListByAuthor(accountId);
}

export function toggleHaikuSelling(id: string): Haiku[] {
  const accountId = Context.sender

  for (let i = 0; i < haikuList.length; i++) {
    const haiku = haikuList[i];
    if (haiku.author == accountId && haiku.id == id) {
      haiku.selling = !haiku.selling;
      haikuList.replace(i, haiku);
      break;
    }
  }

  return filterHaikuListByAuthor(accountId);
}

export function buyHaiku(id: string): void {
  // TODO get it from haiku owner
  const receiver = 'ruvijs.testnet';

  ContractPromiseBatch.create(receiver).transfer(Context.attachedDeposit)
}
