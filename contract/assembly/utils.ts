import { base64, math, u128 } from 'near-sdk-as';

const FEE = 13;

export const generateId = (): string => {
	return base64.encode(math.randomBuffer(4));
};

export const castPrice = (yoctoNearAmount: string): u128 => {
	return u128.from(yoctoNearAmount);
};

export const getPriceWithFee = (yoctoNearAmount: string): u128 => {
	return u128.div10(u128.mul(u128.from(yoctoNearAmount), u128.from(FEE)));
};

export const getUniquenessError = (isUnique: boolean): string => {
	return isUnique ? '' : 'Haiku is not unique';
};

export const getAuthorIncome = (priceWithFee: u128): u128 => {
	return u128.div(
		u128.mul(u128.from(priceWithFee), u128.from(10)),
		u128.from(FEE)
	);
};
