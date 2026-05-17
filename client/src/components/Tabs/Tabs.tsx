import { Component, For, JSX, createSignal } from 'solid-js';
import styles from './Tabs.module.css';
import clsx from 'clsx';

interface Tab {
  label: () => JSX.Element;
  content: () => JSX.Element;
}

interface TabsProps {
  tabs: Tab[];
  footer?: (activeIndex: () => number) => JSX.Element;
}

const Tabs: Component<TabsProps> = (props) => {
  const [activeIndex, setActiveIndex] = createSignal(0);

  return (
    <div class={styles.container}>
      <div class={styles.tabBar}>
        <For each={props.tabs}>
          {(tab, index) => (
            <button
              class={clsx(styles.tab, index() === activeIndex() && styles.activeTab)}
              onClick={() => setActiveIndex(index())}
            >
              {tab.label()}
            </button>
          )}
        </For>
      </div>
      <div class={styles.panel}>
        <div class={styles.panelContent}>{props.tabs[activeIndex()]?.content()}</div>
        {props.footer && <div class={styles.panelFooter}>{props.footer(activeIndex)}</div>}
      </div>
    </div>
  );
};

export { Tabs };
export type { Tab };
