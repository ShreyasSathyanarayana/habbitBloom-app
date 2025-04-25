import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";

type TabBarContextType = {
  isTabBarVisible: boolean;
  showTabBar: () => void;
  hideTabBar: () => void;
};

const TabBarContext = createContext<TabBarContextType | undefined>(undefined);

type TabBarProviderProps = {
  children: ReactNode;
};

export function TabBarProvider({ children }: TabBarProviderProps) {
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);

  const showTabBar = () => setIsTabBarVisible(true);
  const hideTabBar = () => setIsTabBarVisible(false);

  const value = useMemo(
    () => ({ isTabBarVisible, showTabBar, hideTabBar }),
    [isTabBarVisible]
  );

  return (
    <TabBarContext.Provider value={value}>{children}</TabBarContext.Provider>
  );
}

export function useTabBar() {
  const context = useContext(TabBarContext);
  if (!context) {
    throw new Error("useTabBar must be used within a TabBarProvider");
  }
  return context;
}
