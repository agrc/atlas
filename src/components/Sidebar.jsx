import { Bars3Icon } from '@heroicons/react/24/solid';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Button, Dialog, DialogTrigger, Modal, ModalOverlay } from 'react-aria-components';

export function Sidebar({ children }) {
  return (
    <div className="flex flex-col">
      <button
        aria-label="sidebar toggle"
        className="self-end rounded-md outline-none transition-shadow ease-in-out focus:ring-2 focus:ring-primary-900 focus:ring-offset-2 dark:ring-offset-transparent dark:focus:ring-secondary-600"
      >
        <Bars3Icon aria-hidden className="h-full w-6" />
      </button>
      <div className="p-2" id="main-content">
        {children}
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
};

export const SideDrawer = ({ children }) => {
  let [isOpen, setOpen] = useState(true);

  return (
    <DialogTrigger>
      <Button
        aria-label="sidebar toggle"
        className="rounded-md outline-none transition-shadow ease-in-out focus:ring-2 focus:ring-primary-900 focus:ring-offset-2 dark:ring-offset-transparent dark:focus:ring-secondary-600"
      >
        <Bars3Icon aria-hidden className="h-full w-6" />
      </Button>
      <ModalOverlay className="fixed inset-0">
        <Modal
          isOpen={isOpen}
          onOpenChange={setOpen}
          className="anim-ease-in-out anim-duration-1000 fixed top-[113px] bottom-0 left-0 w-[300px] bg-primary-900 outline-none data-[entering=true]:animate-in data-[entering=true]:slide-in-from-left data-[exiting=true]:animate-out data-[exiting=true]:fade-out"
        >
          <Dialog>
            {({ close }) => (
              <>
                {children}
                <Button onPress={close}>Close</Button>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
};

SideDrawer.propTypes = {
  children: PropTypes.node.isRequired,
};

export const DoubleSidebar = ({ children }) => {
  return (
    <div className="overflow-y-auto p-2 hidden md:block" id="main-content">
      {children}
    </div>
  );
};

export const Drawer = () => {
  return (
    <div className="group left-2.5 pl-9 relative h-full w-80 shrink-0 border-yellow-400 bg-white/10 shadow-md transition-[width] duration-500 ease-in-out data-[open='false']:w-0 data-[open='true']:border-r">
      <aside className='h-full w-80 overflow-y-auto text-zinc-900 duration-500 ease-in-out data-[type="sidebar"]:data-[open="false"]:-translate-x-full data-[type="sidebar"]:data-[open="true"]:translate-x-0 dark:text-zinc-100'></aside>
      <p className="flex h-10 w-6 items-center justify-center rounded-none border border-l-0 bg-transparent p-1 shadow-md hover:bg-current group-hover:bg-red-900/5 group-pressed:bg-black/10 disabled:bg-transparent dark:group-hover:bg-white/10 dark:group-pressed:bg-white/20"></p>
    </div>
  );
};

export const DefaultDrawerTrigger = () => (
  <div className="absolute -right-8 top-[calc(50%-24px)] block h-10 w-6 rounded rounded-l-none border border-l-0 bg-white shadow-md">
    <ChevronLeftIcon className="h-6 w-full shrink-0 fill-zinc-900 transition-transform duration-500 -rotate-180" />
    <p className="flex h-10 w-6 items-center justify-center rounded-none border border-l-0 bg-transparent p-1 shadow-md hover:bg-current group-hover:bg-black/10 group-pressed:bg-black/50 disabled:bg-transparent dark:group-hover:bg-white/10 dark:group-pressed:bg-white/20"></p>
  </div>
);
