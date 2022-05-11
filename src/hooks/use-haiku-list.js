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


  return {haikuList, addHaiku};
}
