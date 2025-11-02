import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import './Tabs.css';

export interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export default function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  // Sincronizar el tab activo cuando cambia el defaultTab
  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className="tabs">
      {/* Tab navigation */}
      <div className="tabs__nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tabs__button ${activeTab === tab.id ? 'tabs__button--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.icon && <span className="tabs__icon">{tab.icon}</span>}
            <span className="tabs__label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="tabs__content">{activeTabContent}</div>
    </div>
  );
}
