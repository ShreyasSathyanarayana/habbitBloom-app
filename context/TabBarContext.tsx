import React, { createContext, useContext, useState } from "react";

type TabBarContextType = {
  isTabBarVisible: boolean;
  showTabBar: () => void;
  hideTabBar: () => void;
};

const TabBarContext = createContext<TabBarContextType | undefined>(undefined);

export const TabBarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);

  const showTabBar = () => setIsTabBarVisible(true);
  const hideTabBar = () => setIsTabBarVisible(false);

  return (
    <TabBarContext.Provider value={{ isTabBarVisible, showTabBar, hideTabBar }}>
      {children}
    </TabBarContext.Provider>
  );
};

export const useTabBar = () => {
  const context = useContext(TabBarContext);
  if (!context) {
    throw new Error("useTabBar must be used within a TabBarProvider");
  }
  return context;
};
