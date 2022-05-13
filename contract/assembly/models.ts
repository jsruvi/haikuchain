import { u128 } from 'near-sdk-as'

@nearBindgen
export class Haiku {
  id: string;
  author: string;
  owner: string;
  text: string;
  price: u128;
  priceWithFee: u128;
  createdAt: u64;
  selling: boolean;
}
