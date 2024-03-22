import { IconMistOff, IconPlus } from '@tabler/icons-react';
import { ReactNode } from 'react';
import { useTranslation } from 'next-i18next';

import { CloseSidebarButton, OpenSidebarButton } from './OpenCloseButton';

import Search from '../Search';

interface Props<T> {
  isOpen: boolean;
  addItemButtonTitle: string;
  side: 'left' | 'right';
  items: T[];
  itemComponent: ReactNode;
  footerComponent?: ReactNode;
  searchTerm: string;
  handleSearchTerm: (searchTerm: string) => void;
  toggleOpen: () => void;
  handleCreateItem: () => void;
  handleDrop: (e: any) => void;
  hasModel: () => boolean;
}

const Sidebar = <T,>({
  isOpen,
  addItemButtonTitle,
  side,
  items,
  itemComponent,
  footerComponent,
  searchTerm,
  handleSearchTerm,
  toggleOpen,
  handleCreateItem,
  handleDrop,
  hasModel,
}: Props<T>) => {
  const { t } = useTranslation('promptbar');

  const allowDrop = (e: any) => {
    e.preventDefault();
  };

  const highlightDrop = (e: any) => {
    e.target.style.background = '#343541';
  };

  const removeHighlight = (e: any) => {
    e.target.style.background = 'none';
  };

  return isOpen ? (
    <div>
      <div
        className={`fixed top-0 ${side}-0 z-40 flex h-full w-[260px] flex-none flex-col space-y-2 text-black bg-[#f9f9f9] dark:bg-black dark:text-white p-2 text-[14px] transition-all sm:relative sm:top-0`}
      >
        <div className='flex items-center'>
          {hasModel() && (
            <button
              className='text-sidebar flex w-full flex-shrink-0 cursor-pointer select-none items-center gap-3 rounded-md p-3 text-black dark:text-white transition-colors duration-200 hover:bg-[#ececec] hover:dark:bg-[#343541]/90'
              onClick={() => {
                handleCreateItem();
                handleSearchTerm('');
              }}
            >
              <IconPlus size={16} />
              {addItemButtonTitle}
            </button>
          )}
        </div>
        <Search
          placeholder={t('Search...') || ''}
          searchTerm={searchTerm}
          onSearch={handleSearchTerm}
        />

        <div className='flex-grow overflow-auto'>
          {items?.length > 0 ? (
            <div
              className='pt-2'
              onDrop={handleDrop}
              onDragOver={allowDrop}
              onDragEnter={highlightDrop}
              onDragLeave={removeHighlight}
            >
              {itemComponent}
            </div>
          ) : (
            <div className='mt-8 select-none text-center text-white opacity-50'>
              <IconMistOff className='mx-auto mb-3' />
              <span className='text-[14px] leading-normal'>
                {t('No data.')}
              </span>
            </div>
          )}
        </div>
        {footerComponent}
      </div>

      <CloseSidebarButton onClick={toggleOpen} side={side} />
    </div>
  ) : (
    <OpenSidebarButton onClick={toggleOpen} side={side} />
  );
};

export default Sidebar;
