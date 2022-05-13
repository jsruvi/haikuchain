import {useState, useEffect, useCallback, useMemo} from 'react';
import Big from 'big.js'

const nearToYoctoNear = (nearAmount) => {
  return Big(nearAmount)
    .times(10 ** 24)
    .toFixed()
}

const yoctoNearToNear = (yoctoNearAmount) => {
  return Big(yoctoNearAmount)
    .div(10 ** 24)
    .toFixed()
}

const sortByNewest = (items) => [...items].sort((a, b) => Number(b.createdAt) - Number(a.createdAt))

export const useHaiku = () => {
  const [rawHaikuList, setHaikuList] = useState([]);
  const [pendingChange, setPendingChange] = useState(false);

  useEffect(async () => {
    if (!window.walletConnection.isSignedIn()) {
      return
    }

    const haikuListFromContract = await window.contract.getMyHaikuList({ accountId: window.accountId })
    setHaikuList(haikuListFromContract)
  }, []);

  const haikuList = useMemo(() => sortByNewest(rawHaikuList).map(({price, priceWithFee, ...item}) => ({
    ...item,
    price: yoctoNearToNear(price),
    priceWithFee: yoctoNearToNear(priceWithFee),
  })), [rawHaikuList]);

  const mySellingHaikuList = useMemo(() => haikuList.filter(({selling}) => selling), [haikuList])

  const addHaiku = useCallback(async ({text, price}) => {
    if (!window.walletConnection.isSignedIn()) {
      return
    }

    const haikuListFromContract = await window.contract.addHaiku({
      text,
      price: nearToYoctoNear(price || 0)
    });

    setHaikuList(haikuListFromContract)
  }, [])

  const removeHaiku = useCallback(async ({id}) => {
    if (!window.walletConnection.isSignedIn()) {
      return
    }
    setPendingChange(true);
    const haikuListFromContract = await window.contract.removeHaiku({
      id
    });

    setHaikuList(haikuListFromContract)
    setPendingChange(false);
  }, [])

  const toggleHaikuSelling = useCallback(async ({id}) => {
    if (!window.walletConnection.isSignedIn()) {
      return
    }

    setPendingChange(true);
    const haikuListFromContract = await window.contract.toggleHaikuSelling({
      id
    });

    setHaikuList(haikuListFromContract)
    setPendingChange(false);
  }, [])

  const editHaiku = useCallback(async ({id, text, price}) => {
    if (!window.walletConnection.isSignedIn()) {
      return
    }

    setPendingChange(true);
    const haikuListFromContract = await window.contract.editHaiku({
      id, text, price: nearToYoctoNear(price)
    });

    setHaikuList(haikuListFromContract)
    setPendingChange(false);
  }, [])

  const buyHaiku = useCallback(async (id) => {
    if (!window.walletConnection.isSignedIn()) {
      return
    }
    const BOATLOAD_OF_GAS = '300000000000000'
    const PREMIUM_COST = '100000000000000000000'

    await window.contract.buyHaiku({
      id
    }, BOATLOAD_OF_GAS, PREMIUM_COST);
  }, [])


  return {haikuList, addHaiku, removeHaiku, buyHaiku, toggleHaikuSelling, pendingChange, mySellingHaikuList, editHaiku};
}
