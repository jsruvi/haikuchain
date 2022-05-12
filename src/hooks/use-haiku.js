import {useState, useEffect, useCallback} from 'react';

export const useHaiku = () => {
  const [haikuList, setHaikuList] = useState([]);

  useEffect(async () => {
    if (!window.walletConnection.isSignedIn()) {
      return
    }

    const haikuListFromContract = await window.contract.getMyHaikuList({ accountId: window.accountId })
    setHaikuList(haikuListFromContract)
  }, []);

  const addHaiku = useCallback(async ({text, price}) => {
    if (!window.walletConnection.isSignedIn()) {
      return
    }

    const haikuListFromContract = await window.contract.addHaiku({
      text,
      price: price || 0
    });

    setHaikuList(haikuListFromContract)
  }, [])

  const removeHaiku = useCallback(async ({id}) => {
    if (!window.walletConnection.isSignedIn()) {
      return
    }

    const haikuListFromContract = await window.contract.removeHaiku({
      id
    });

    setHaikuList(haikuListFromContract)
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


  return {haikuList, addHaiku, removeHaiku, buyHaiku};
}
