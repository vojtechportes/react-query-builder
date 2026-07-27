import * as React from 'react';

export interface IClientOnlyProps {
  loader: () => Promise<{ default: React.ComponentType }>;
  label: string;
  minHeight?: string;
}

export const ClientOnly: React.FC<IClientOnlyProps> = ({
  loader,
  label,
  minHeight = '12rem',
}) => {
  const [hydrated, setHydrated] = React.useState(false);
  const Component = React.useMemo(() => React.lazy(loader), [loader]);
  const placeholder = (
    <div
      data-client-only-placeholder="true"
      role="status"
      aria-live="polite"
      style={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        minHeight,
        padding: '1rem',
      }}
    >
      {label}
    </div>
  );

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return placeholder;

  return (
    <React.Suspense fallback={placeholder}>
      <Component />
    </React.Suspense>
  );
};
