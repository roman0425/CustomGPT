import React, { useState } from 'react';
import PopupModal from '@components/PopupModal';
import AboutIcon from '@icon/AboutIcon';

const AboutMenu = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <a
        className='flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm'
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <div>
          <AboutIcon />
        </div>
        About
      </a>
      {isModalOpen && (
        <PopupModal
          title='About'
          setIsModalOpen={setIsModalOpen}
          cancelButton={false}
        >
          <div className='p-6 border-b border-gray-200 dark:border-gray-600'>
            <div className='min-w-fit text-gray-900 dark:text-gray-300 text-sm flex flex-col gap-2'>
              <p>Free ChatGPT is an amazing open-source web app that allows you to play with OpenAI's ChatGPT API for free!</p>

              <h2 className='text-lg font-bold'>Discord Server</h2>
              <p>We invite you to join our Discord community! Our Discord server is a great place to exchange ChatGPT ideas and tips, and submit feature requests for Free ChatGPT. You'll have the opportunity to interact with the developers behind Free ChatGPT as well as other AI enthusiasts who share your passion.</p>

              <p>To join our server, simply click on the following link: <a className='link' href='https://discord.gg/g3Qnwy4V6A' target='_blank'>https://discord.gg/g3Qnwy4V6A</a>. We can't wait to see you there!</p>

              <h2 className='text-lg font-bold'>Privacy Statement</h2>
              <p>We highly value your privacy and are committed to safeguarding the privacy of our users. We do not collect or store any text you enter or receive from the OpenAI server in any form. Our source code is available for your inspection to verify this statement.</p>

              <p>We prioritise the security of your API key and handle it with utmost care. If you use your own API key, your key is exclusively stored on your browser and never shared with any third-party entity. It is solely used for the intended purpose of accessing the OpenAI API and not for any other unauthorised use.</p>
            </div>
          </div>
        </PopupModal>
      )}
    </>
  );
};

export default AboutMenu;
