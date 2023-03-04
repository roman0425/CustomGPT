import React, { useEffect } from 'react';
import useStore from '@store/store';

import Chat from './components/Chat';
import Menu from './components/Menu';
import ConfigMenu from './components/ConfigMenu';

import useSaveToLocalStorage from '@hooks/useSaveToLocalStorage';
import useUpdateCharts from '@hooks/useUpdateChats';

import { ChatInterface, MessageInterface } from '@type/chat';
import { defaultSystemMessage } from '@constants/chat';

function App() {
  useSaveToLocalStorage();
  useUpdateCharts();

  const [setChats, setMessages, setCurrentChatIndex] = useStore((state) => [
    state.setChats,
    state.setMessages,
    state.setCurrentChatIndex,
  ]);

  const initialiseNewChat = () => {
    const message: MessageInterface = {
      role: 'system',
      content: defaultSystemMessage,
    };
    setChats([
      {
        title: 'New Chat',
        messages: [message],
      },
    ]);
    setMessages([message]);
    setCurrentChatIndex(0);
  };

  useEffect(() => {
    // localStorage.removeItem('chats');
    const storedChats = localStorage.getItem('chats');
    if (storedChats) {
      try {
        const chats: ChatInterface[] = JSON.parse(storedChats);
        if (chats.length > 0) {
          setChats(chats);
          setMessages(chats[0].messages);
          setCurrentChatIndex(0);
        } else {
          initialiseNewChat();
        }
      } catch (e: unknown) {
        setChats([]);
        setMessages([]);
        setCurrentChatIndex(-1);
        console.log(e);
      }
    } else {
      initialiseNewChat();
    }
  }, []);

  return (
    <div className='overflow-hidden w-full h-full relative'>
      <Menu />
      <Chat />
      <ConfigMenu />
    </div>
  );
}

export default App;
