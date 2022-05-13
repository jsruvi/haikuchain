import {
	Context,
	PersistentVector,
	ContractPromiseBatch,
	u128,
} from 'near-sdk-as';
import { Haiku, EditHaikuResponse } from './models';

const haikuList = new PersistentVector<Haiku>('haiku-list');

const FEE = 13;

const castPrice = (yoctoNearAmount: string): u128 => {
	return u128.from(yoctoNearAmount);
};

const getPriceWithFee = (yoctoNearAmount: string): u128 => {
	return u128.div10(u128.mul(u128.from(yoctoNearAmount), u128.from(FEE)));
};

const checkHaikuUniqueness = (haiku: string): boolean => {
	let isUnique = true;

	for (let i = 0; i < haikuList.length; i++) {
		const haikuFromList = haikuList[i];
		if (haikuFromList.text == haiku) {
			isUnique = false;
			break;
		}
	}

	return isUnique;
};

const checkHaikuUniquenessById = (haiku: string, id: string): boolean => {
	let isUnique = true;

	for (let i = 0; i < haikuList.length; i++) {
		const haikuFromList = haikuList[i];
		if (haikuFromList.id != id && haikuFromList.text == haiku) {
			isUnique = false;
			break;
		}
	}

	return isUnique;
};

const getUniquenessError = (isUnique: boolean): string => {
	return isUnique ? '' : 'Haiku is not unique';
};

export function filterHaikuListByOwner(accountId: string): Array<Haiku> {
	let result = new Array<Haiku>();

	for (let i = 0; i < haikuList.length; i++) {
		const haiku = haikuList[i];
		if (haiku.owner == accountId) {
			result.push(haiku);
		}
	}
	return result;
}

export function filterHaikuListByAnother(accountId: string): Array<Haiku> {
	let result = new Array<Haiku>();

	for (let i = 0; i < haikuList.length; i++) {
		const haiku = haikuList[i];
		if (haiku.owner != accountId) {
			result.push(haiku);
		}
	}
	return result;
}

export function removeHaikuById(accountId: string, id: string): void {
	for (let i = 0; i < haikuList.length; i++) {
		const haiku = haikuList[i];
		if (haiku.owner == accountId && haiku.id == id) {
			haikuList.swap_remove(i);
			break;
		}
	}
}

export function getMyHaikuList(accountId: string): Haiku[] {
	return filterHaikuListByOwner(accountId);
}

export function getAnotherHaikuList(accountId: string): Haiku[] {
	return filterHaikuListByAnother(accountId);
}

export function addHaiku(text: string, price: string): EditHaikuResponse {
	const accountId = Context.sender;
	const createdAt = Context.blockTimestamp;
	const isUnique = checkHaikuUniqueness(text);

	if (isUnique) {
		haikuList.push({
			id: Context.blockIndex.toString(),
			author: accountId,
			owner: accountId,
			text: text,
			price: castPrice(price),
			priceWithFee: getPriceWithFee(price),
			createdAt: createdAt,
			selling: false,
		});
	}

	return {
		error: getUniquenessError(isUnique),
		items: filterHaikuListByOwner(accountId),
	};
}

export function removeHaiku(id: string): Haiku[] {
	const accountId = Context.sender;

	removeHaikuById(accountId, id);

	return filterHaikuListByOwner(accountId);
}

export function toggleHaikuSelling(id: string): Haiku[] {
	const accountId = Context.sender;

	for (let i = 0; i < haikuList.length; i++) {
		const haiku = haikuList[i];
		if (haiku.owner == accountId && haiku.id == id) {
			haiku.selling = !haiku.selling;
			haikuList.replace(i, haiku);
			break;
		}
	}

	return filterHaikuListByOwner(accountId);
}

export function editHaiku(
	id: string,
	text: string,
	price: string
): EditHaikuResponse {
	const accountId = Context.sender;
	const isUnique = checkHaikuUniquenessById(text, id);

	if (isUnique) {
		for (let i = 0; i < haikuList.length; i++) {
			const haiku = haikuList[i];
			if (haiku.owner == accountId && haiku.id == id) {
				haiku.text = text;
				haiku.price = castPrice(price);
				haiku.priceWithFee = getPriceWithFee(price);
				haikuList.replace(i, haiku);
				break;
			}
		}
	}

	return {
		error: getUniquenessError(isUnique),
		items: filterHaikuListByOwner(accountId),
	};
}

export function buyHaiku(id: string): void {
	// TODO get it from haiku owner
	const receiver = 'ruvijs.testnet';

	ContractPromiseBatch.create(receiver).transfer(Context.attachedDeposit);
}
