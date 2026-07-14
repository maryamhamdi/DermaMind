'use client';

import { Provider } from 'react-redux';
import { useRef } from 'react';
import { createStore, preloadedStateType } from '@/src/store/store';

type ProvidersProps = {
  children: React.ReactNode;
  preloadedState: preloadedStateType;
};

export default function Providers({
  children,
  preloadedState,
}: ProvidersProps) {

  const storeRef = useRef<any>(null);

  if (!storeRef.current) {
    storeRef.current = createStore(preloadedState);
  }

  return (
    <Provider store={storeRef.current}>
      {children}
    </Provider>
  );
}