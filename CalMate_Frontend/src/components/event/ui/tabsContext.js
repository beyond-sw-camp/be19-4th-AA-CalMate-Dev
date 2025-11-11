import { inject } from 'vue';

export const tabsSymbol = Symbol('TabsContext');

export function useTabsContext() {
  const context = inject(tabsSymbol, null);

  if (!context) {
    throw new Error('Tabs components must be used inside <Tabs>.');
  }

  return context;
}
