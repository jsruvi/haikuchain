import {useContext} from 'react';
import {HaikuContext} from '../contexts';

export const useHaikuContext = () => {
  return useContext(HaikuContext)
}
