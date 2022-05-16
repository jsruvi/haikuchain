import {
	Context,
	PersistentVector,
	ContractPromiseBatch,
	u128,
	logging,
} from 'near-sdk-as';
import { Haiku, EditHaikuResponse, BuyHaikuResponse } from './models';
import {
	generateId,
	getPriceWithFee,
	castPrice,
	getUniquenessError,
	getAuthorIncome,
} from './utils';

export const haikuList = new PersistentVector<Haiku>('haiku-list');

const checkTextUniqueness = (text: string): boolean => {
	let isUnique = true;

	for (let i = 0; i < haikuList.length; i++) {
		const haikuFromList = haikuList[i];
		if (haikuFromList.text == text) {
			isUnique = false;
			break;
		}
	}

	return isUnique;
};

const checkHaikuUniqueness = (text: string, id: string): boolean => {
	let isUnique = true;

	for (let i = 0; i < haikuList.length; i++) {
		const haikuFromList = haikuList[i];
		if (haikuFromList.id != id && haikuFromList.text == text) {
			isUnique = false;
			break;
		}
	}

	return isUnique;
};

function filterHaikuListByOwner(accountId: string): Array<Haiku> {
	let result = new Array<Haiku>();

	for (let i = 0; i < haikuList.length; i++) {
		const haiku = haikuList[i];
		if (haiku.owner == accountId) {
			result.push(haiku);
		}
	}
	return result;
}

function filterSellingHaikuList(accountId: string): Array<Haiku> {
	let result = new Array<Haiku>();

	for (let i = 0; i < haikuList.length; i++) {
		const haiku = haikuList[i];
		if (haiku.selling && haiku.owner != accountId) {
			result.push(haiku);
		}
	}
	return result;
}

function removeHaikuById(accountId: string, id: string): void {
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

export function getSellingHaikuList(accountId: string): Haiku[] {
	return filterSellingHaikuList(accountId);
}

export function addHaiku(text: string, price: string): EditHaikuResponse {
	const accountId = Context.sender;
	const createdAt = Context.blockTimestamp;
	const attachedDeposit = Context.attachedDeposit;
	const isUnique = checkTextUniqueness(text);

	assert(castPrice(price) > u128.from(0), 'Price should be positive number!');
	assert(attachedDeposit > u128.from(0), 'Haiku should be prepaid!');

	if (isUnique) {
		haikuList.push({
			id: `${Context.blockIndex.toString()}-${generateId()}`,
			author: accountId,
			owner: accountId,
			text: text,
			price: castPrice(price),
			priceWithFee: getPriceWithFee(price),
			createdAt: createdAt,
			selling: false,
		});

		ContractPromiseBatch.create(Context.contractName).transfer(
			attachedDeposit
		);
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
	const isUnique = checkHaikuUniqueness(text, id);

	assert(castPrice(price) > u128.from(0), 'Price should be positive number!');

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

function setHaikuOwner(id: string, accountId: string): void {
	for (let i = 0; i < haikuList.length; i++) {
		const haiku = haikuList[i];
		if (haiku.id == id) {
			haiku.owner = accountId;
			haiku.selling = false;
			haiku.price = haiku.priceWithFee;
			haikuList.replace(i, haiku);
			break;
		}
	}
}

function findHaikuById(id: string): Haiku[] {
	for (let i = 0; i < haikuList.length; i++) {
		const haiku = haikuList[i];
		if (haiku.id == id) {
			return [haiku];
		}
	}

	return [];
}

export function buyHaiku(id: string): BuyHaikuResponse {
	const accountId = Context.sender;
	const haiku = findHaikuById(id)[0];

	if (haiku) {
		const receiver = haiku.owner;
		const priceWithFee = haiku.priceWithFee;

		const authorIncome = getAuthorIncome(priceWithFee);
		const fee = u128.sub(priceWithFee, authorIncome);

		logging.log(`Haiku price with fee: ${priceWithFee}`);
		logging.log(`Author income: ${authorIncome}`);
		logging.log(`Fee: ${fee}`);

		ContractPromiseBatch.create(receiver).transfer(authorIncome);
		ContractPromiseBatch.create(Context.contractName).transfer(fee);
		setHaikuOwner(id, accountId);
	}

	return {
		myItems: filterHaikuListByOwner(accountId),
		sellingItems: filterSellingHaikuList(accountId),
	};
}
