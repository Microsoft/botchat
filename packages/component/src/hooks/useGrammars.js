import { useContext } from 'react';
import WebChatUIContext from '../WebChatUIContext';

export default function useGrammars() {
  return useContext(WebChatUIContext).grammars;
}
