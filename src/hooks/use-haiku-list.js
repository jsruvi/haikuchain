import {useState, useEffect, useCallback} from 'react';

export const useHaikuList = () => {
  const [haikuList, setHaikuList] = useState([]);

  useEffect(async () => {
    if (!window.walletConnection.isSignedIn()) {
      return
    }

    const haikuListFromContract = await window.contract.getMyHaikuList({ accountId: window.accountId })
    setHaikuList(haikuListFromContract)
  }, []);

  const addHaiku = useCallback(async (text) => {
    if (!window.walletConnection.isSignedIn()) {
      return
    }

    const haikuListFromContract = await window.contract.addHaiku({
      text
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


  return {haikuList, addHaiku, buyHaiku};
}
