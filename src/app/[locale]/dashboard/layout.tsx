

import { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="container py-12">
      { children }
    </div>
  );
}