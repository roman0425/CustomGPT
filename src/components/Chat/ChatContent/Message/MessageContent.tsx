import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';
import useStore from '@store/store';

import CopyIcon from '@icon/CopyIcon';
import EditIcon2 from '@icon/EditIcon2';
import DeleteIcon from '@icon/DeleteIcon';
import TickIcon from '@icon/TickIcon';
import CrossIcon from '@icon/CrossIcon';
import DownChevronArrow from '@icon/DownChevronArrow';

import { MessageInterface } from '@type/chat';

const MessageContent = ({
  content,
  messageIndex,
  sticky = false,
}: {
  content: string;
  messageIndex: number;
  sticky?: boolean;
}) => {
  const [isEdit, setIsEdit] = useState<boolean>(sticky);

  return (
    <div className='relative flex flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]'>
      <div className='flex flex-grow flex-col gap-3'></div>
      {isEdit ? (
        <EditView
          content={content}
          setIsEdit={setIsEdit}
          messageIndex={messageIndex}
          sticky={sticky}
        />
      ) : (
        <ContentView
          content={content}
          setIsEdit={setIsEdit}
          messageIndex={messageIndex}
        />
      )}
    </div>
  );
};

const ContentView = ({
  content,
  setIsEdit,
  messageIndex,
}: {
  content: string;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  messageIndex: number;
}) => {
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const [messages, setMessages] = useStore((state) => [
    state.messages,
    state.setMessages,
  ]);

  const handleDelete = () => {
    const updatedMessages = JSON.parse(JSON.stringify(messages));
    updatedMessages.splice(messageIndex, 1);
    setMessages(updatedMessages);
  };

  const handleMove = (direction: 'up' | 'down') => {
    const updatedMessages = JSON.parse(JSON.stringify(messages));
    const temp = updatedMessages[messageIndex];
    if (direction === 'up') {
      updatedMessages[messageIndex] = updatedMessages[messageIndex - 1];
      updatedMessages[messageIndex - 1] = temp;
    } else {
      updatedMessages[messageIndex] = updatedMessages[messageIndex + 1];
      updatedMessages[messageIndex + 1] = temp;
    }
    setMessages(updatedMessages);
  };

  return (
    <>
      <div className='markdown prose w-full break-words dark:prose-invert dark'>
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              if (inline) return <code>{children}</code>;
              let highlight;

              const match = /language-(\w+)/.exec(className || '');
              const lang = match && match[1];
              if (lang)
                highlight = hljs.highlight(children.toString(), {
                  language: lang,
                });
              else highlight = hljs.highlightAuto(children.toString());

              return (
                <div className='bg-black rounded-md'>
                  <div className='flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans'>
                    <span className=''>{highlight.language}</span>
                    <button
                      className='flex ml-auto gap-2'
                      onClick={() => {
                        navigator.clipboard
                          .writeText(children.toString())
                          .then(() => {
                            setCopied(true);
                            setTimeout(() => setCopied(false), 3000);
                          });
                      }}
                    >
                      {copied ? (
                        <>
                          <TickIcon />
                          Copied!
                        </>
                      ) : (
                        <>
                          <CopyIcon />
                          Copy code
                        </>
                      )}
                    </button>
                  </div>
                  <div className='p-4 overflow-y-auto'>
                    <code
                      className={`!whitespace-pre hljs language-${highlight.language}`}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(highlight.value, {
                            USE_PROFILES: { html: true },
                          }),
                        }}
                      />
                    </code>
                  </div>
                </div>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
      <div className='flex justify-end gap-2 w-full mt-2'>
        {isDelete || (
          <>
            {messageIndex !== 0 && (
              <UpButton onClick={() => handleMove('up')} />
            )}
            {messageIndex !== messages?.length - 1 && (
              <DownButton onClick={() => handleMove('down')} />
            )}
            <EditButton setIsEdit={setIsEdit} />
            <DeleteButton setIsDelete={setIsDelete} />
          </>
        )}
        {isDelete && (
          <>
            <button className='p-1 hover:text-white' onClick={handleDelete}>
              <TickIcon />
            </button>
            <button
              className='p-1 hover:text-white'
              onClick={() => setIsDelete(false)}
            >
              <CrossIcon />
            </button>
          </>
        )}
      </div>
    </>
  );
};

const MessageButton = ({
  onClick,
  icon,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  icon: React.ReactElement;
}) => {
  return (
    <div className='text-gray-400 flex self-end lg:self-center justify-center gap-3 md:gap-4  visible'>
      <button
        className='p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400 md:invisible md:group-hover:visible'
        onClick={onClick}
      >
        {icon}
      </button>
    </div>
  );
};

const EditButton = ({
  setIsEdit,
}: {
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return <MessageButton icon={<EditIcon2 />} onClick={() => setIsEdit(true)} />;
};

const DeleteButton = ({
  setIsDelete,
}: {
  setIsDelete: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <MessageButton icon={<DeleteIcon />} onClick={() => setIsDelete(true)} />
  );
};

const DownButton = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return <MessageButton icon={<DownChevronArrow />} onClick={onClick} />;
};

const UpButton = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <MessageButton
      icon={<DownChevronArrow className='rotate-180' />}
      onClick={onClick}
    />
  );
};

const EditView = ({
  content,
  setIsEdit,
  messageIndex,
  sticky,
}: {
  content: string;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  messageIndex: number;
  sticky?: boolean;
}) => {
  const [messages, setMessages, inputRole] = useStore((state) => [
    state.messages,
    state.setMessages,
    state.inputRole,
  ]);

  const [_content, _setContent] = useState<string>(content);
  const textareaRef = React.createRef<HTMLTextAreaElement>();

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${e.target.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  return (
    <>
      <textarea
        ref={textareaRef}
        className='m-0 resize-none border border-gray-400/30 rounded-lg bg-transparent px-2 py-1 overflow-y-hidden focus:ring-0 focus-visible:ring-0'
        onChange={(e) => {
          _setContent(e.target.value);
        }}
        value={_content}
        onInput={handleInput}
        rows={10}
      ></textarea>
      <div className='text-center mt-2 flex justify-center'>
        <button
          className='btn relative btn-primary mr-2'
          onClick={() => {
            const updatedMessages: MessageInterface[] = JSON.parse(
              JSON.stringify(messages)
            );
            if (sticky) {
              updatedMessages.push({ role: inputRole, content: _content });
              _setContent('');
            } else {
              updatedMessages[messageIndex].content = _content;
              setIsEdit(false);
            }
            setMessages(updatedMessages);
          }}
        >
          <div className='flex items-center justify-center gap-2'>Save</div>
        </button>
        {sticky || (
          <button
            className='btn relative btn-neutral'
            onClick={() => setIsEdit(false)}
          >
            <div className='flex items-center justify-center gap-2'>Cancel</div>
          </button>
        )}
      </div>
    </>
  );
};

export default MessageContent;
