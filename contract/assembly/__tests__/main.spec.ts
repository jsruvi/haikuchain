import {
	haikuList,
	getMyHaikuList,
	getSellingHaikuList,
	addHaiku,
	buyHaiku,
	removeHaiku,
	toggleHaikuSelling,
	editHaiku,
} from '..';
import { VMContext, u128 } from 'near-sdk-as';

const CURRENT_ACCOUNT_ID = 'currentAccount';
const SENDER_ACCOUNT = 'senderAccount';
const ANOTHER_SENDER_ACCOUNT = 'anotherSenderAccount';

describe('Haikuchain ', () => {
	beforeEach(() => {
		VMContext.setCurrent_account_id(CURRENT_ACCOUNT_ID);
		VMContext.setSigner_account_id(SENDER_ACCOUNT);
	});

	describe('addHaiku', () => {
		it('should add new haiku', () => {
			expect(haikuList.length).toBe(0);

			const text = 'test text';
			const price = '999999999';
			VMContext.setAttached_deposit(u128.from('10'));
			addHaiku(text, price);

			expect(haikuList.length).toBe(1);

			const haiku = haikuList[0];

			expect(haiku.text).toBe(text);
			expect(haiku.price).toBe(u128.from(price));
			expect(haiku.author).toBe(SENDER_ACCOUNT);
			expect(haiku.owner).toBe(SENDER_ACCOUNT);
			expect(haiku.selling).toBe(false);
		});

		describe('haiku with this text already exists', () => {
			const text = 'existing haiku text';

			beforeEach(() => {
				VMContext.setAttached_deposit(u128.from('10'));
				addHaiku(text, '77777');
			});

			it("shouldn't add new haiku", () => {
				expect(haikuList.length).toBe(1);
				const existingHaiku = haikuList[0];

				const price = '999999999';
				VMContext.setAttached_deposit(u128.from('10'));
				addHaiku(text, price);

				expect(haikuList.length).toBe(1);
				expect(haikuList[0].id).toBe(existingHaiku.id);
			});
		});
	});

	describe('editHaiku', () => {
		const text = 'test text';
		const price = '77777';

		beforeEach(() => {
			VMContext.setAttached_deposit(u128.from('10'));
			addHaiku(text, price);
		});

		it('should edit existing haiku', () => {
			expect(haikuList.length).toBe(1);

			const existingHaiku = haikuList[0];

			expect(existingHaiku.text).toBe(text);
			expect(existingHaiku.price).toBe(u128.from(price));
			expect(existingHaiku.author).toBe(SENDER_ACCOUNT);
			expect(existingHaiku.owner).toBe(SENDER_ACCOUNT);
			expect(existingHaiku.selling).toBe(false);

			const editedText = 'edited test text';
			const editedPrice = '999999999';

			editHaiku(existingHaiku.id, editedText, editedPrice);

			expect(haikuList.length).toBe(1);

			const editedHaiku = haikuList[0];

			expect(editedHaiku.text).toBe(editedText);
			expect(editedHaiku.price).toBe(u128.from(editedPrice));
			expect(editedHaiku.author).toBe(SENDER_ACCOUNT);
			expect(editedHaiku.owner).toBe(SENDER_ACCOUNT);
			expect(editedHaiku.selling).toBe(false);
		});
	});

	describe('removeHaiku', () => {
		beforeEach(() => {
			VMContext.setAttached_deposit(u128.from('10'));
			addHaiku('haiku 1', '1');
			VMContext.setAttached_deposit(u128.from('10'));
			addHaiku('haiku 2', '2');
		});

		it('should remove haiku', () => {
			expect(haikuList.length).toBe(2);

			const firstInitialHaiku = haikuList[0];
			const secondInitialHaiku = haikuList[1];

			removeHaiku(firstInitialHaiku.id);

			expect(haikuList.length).toBe(1);
			expect(haikuList[0].id).toBe(secondInitialHaiku.id);

			removeHaiku(secondInitialHaiku.id);
			expect(haikuList.length).toBe(0);
		});
	});

	describe('toggleHaikuSelling', () => {
		beforeEach(() => {
			VMContext.setAttached_deposit(u128.from('10'));
			addHaiku('haiku 1', '1');
		});

		it('should toggle haiku selling field', () => {
			expect(haikuList.length).toBe(1);
			expect(haikuList[0].selling).toBe(false);

			toggleHaikuSelling(haikuList[0].id);
			expect(haikuList[0].selling).toBe(true);
			toggleHaikuSelling(haikuList[0].id);
			expect(haikuList[0].selling).toBe(false);
		});
	});

	describe('getMyHaikuList', () => {
		const MY_HAIKU_AMOUNT = 5;
		const ANOTHER_HAIKU_AMOUNT = 6;
		const MY_HAIKU_PRICE = '777';
		const ANOTHER_HAIKU_PRICE = '111';

		beforeEach(() => {
			for (let i = 0; i < MY_HAIKU_AMOUNT; i++) {
				VMContext.setAttached_deposit(u128.from('10'));
				addHaiku(`my haiku ${i}`, MY_HAIKU_PRICE);
			}

			VMContext.setSigner_account_id(ANOTHER_SENDER_ACCOUNT);

			for (let i = 0; i < ANOTHER_HAIKU_AMOUNT; i++) {
				VMContext.setAttached_deposit(u128.from('10'));
				addHaiku(`another haiku ${i}`, ANOTHER_HAIKU_PRICE);
			}

			VMContext.setSigner_account_id(SENDER_ACCOUNT);
		});

		it('should return only mine haiku', () => {
			expect(haikuList.length).toBe(
				MY_HAIKU_AMOUNT + ANOTHER_HAIKU_AMOUNT
			);

			const myHaiku = getMyHaikuList(SENDER_ACCOUNT);

			expect(myHaiku.length).toBe(MY_HAIKU_AMOUNT);

			for (let i = 0; i < myHaiku.length; i++) {
				expect(myHaiku[i].price).toBe(u128.from(MY_HAIKU_PRICE));
			}
		});
	});

	describe('getSellingHaikuList', () => {
		const MY_HAIKU_AMOUNT = 5;
		const ANOTHER_HAIKU_AMOUNT = 6;
		const SELLING_HAIKU_AMOUNT = 7;
		const MY_HAIKU_PRICE = '777';
		const NON_SELLING_HAIKU_PRICE = '111';
		const SELLING_HAIKU_PRICE = '222';

		beforeEach(() => {
			for (let i = 0; i < MY_HAIKU_AMOUNT; i++) {
				VMContext.setAttached_deposit(u128.from('10'));
				addHaiku(`my haiku ${i}`, MY_HAIKU_PRICE);
			}

			VMContext.setSigner_account_id(ANOTHER_SENDER_ACCOUNT);

			for (let i = 0; i < ANOTHER_HAIKU_AMOUNT; i++) {
				VMContext.setAttached_deposit(u128.from('10'));
				addHaiku(`another haiku ${i}`, NON_SELLING_HAIKU_PRICE);
			}
			for (let i = 0; i < SELLING_HAIKU_AMOUNT; i++) {
				VMContext.setAttached_deposit(u128.from('10'));
				addHaiku(`selling haiku ${i}`, SELLING_HAIKU_PRICE);
			}

			for (let i = 0; i < haikuList.length; i++) {
				const haiku = haikuList[i];
				if (haiku.text.includes('selling haiku')) {
					toggleHaikuSelling(haiku.id);
				}
			}

			VMContext.setSigner_account_id(SENDER_ACCOUNT);
		});

		it('should return only not mine selling haiku', () => {
			expect(haikuList.length).toBe(
				MY_HAIKU_AMOUNT + ANOTHER_HAIKU_AMOUNT + SELLING_HAIKU_AMOUNT
			);

			const sellingHaiku = getSellingHaikuList(SENDER_ACCOUNT);

			expect(sellingHaiku.length).toBe(SELLING_HAIKU_AMOUNT);

			for (let i = 0; i < sellingHaiku.length; i++) {
				expect(sellingHaiku[i].price).toBe(
					u128.from(SELLING_HAIKU_PRICE)
				);
			}
		});
	});

	describe('buyHaiku', () => {
		const haikuText = 'test text';

		beforeEach(() => {
			VMContext.setSigner_account_id(ANOTHER_SENDER_ACCOUNT);
			VMContext.setAttached_deposit(u128.from('10'));
			addHaiku(haikuText, '77777');
			VMContext.setSigner_account_id(SENDER_ACCOUNT);
			VMContext.setAccount_balance(u128.from('99999999999'));
			VMContext.setSigner_account_id(SENDER_ACCOUNT);
		});

		it('should set correct "owner"', () => {
			expect(haikuList[0].owner).toBe(ANOTHER_SENDER_ACCOUNT);
			expect(haikuList[0].text).toBe(haikuText);

			buyHaiku(haikuList[0].id);

			expect(haikuList[0].owner).toBe(SENDER_ACCOUNT);
			expect(haikuList[0].text).toBe(haikuText);
		});
	});
});
