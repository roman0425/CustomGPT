import React, { createRef, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import useStore from '@store/store';

import ScrollToBottomButton from './ScrollToBottomButton';
import ChatTitle from './ChatTitle';
import Message from './Message';
import NewMessageButton from './Message/NewMessageButton';
import CrossIcon from '@icon/CrossIcon';

import useSubmit from '@hooks/useSubmit';

const ChatContent = () => {
  const [messages, inputRole, setError] = useStore((state) => [
    state.messages,
    state.inputRole,
    state.setError,
  ]);
  const { handleSubmit, error } = useSubmit();

  return (
    <div className='flex-1 overflow-hidden'>
      <ScrollToBottom
        className='h-full dark:bg-gray-800'
        followButtonClassName='hidden'
      >
        <ScrollToBottomButton />
        <div className='flex flex-col items-center text-sm dark:bg-gray-800'>
          <ChatTitle />
          {messages?.length === 0 && <NewMessageButton messageIndex={-1} />}
          {messages?.map((message, index) => (
            <>
              <Message
                role={message.role}
                content={message.content}
                messageIndex={index}
              />
              <NewMessageButton messageIndex={index} />
            </>
          ))}
          <Message role={inputRole} content='' messageIndex={-1} sticky />

          {error !== '' && (
            <div className='relative bg-red-600/50 p-2 rounded-sm w-3/5 mt-3'>
              <div className='text-gray-900 dark:text-gray-300 text-sm break-words'>
                {error}
              </div>
              <div
                className='text-white absolute top-1 right-1 cursor-pointer'
                onClick={() => {
                  setError('');
                }}
              >
                <CrossIcon />
              </div>
            </div>
          )}

          <div className='text-center mt-6 flex justify-center gap-2'>
            <button
              className='btn relative btn-primary mt-2'
              onClick={() => {
                handleSubmit();
              }}
            >
              Submit
            </button>
          </div>
          <div className='w-full h-10'></div>
        </div>
      </ScrollToBottom>
    </div>
  );
};

export default ChatContent;
