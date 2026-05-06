import { createContext, useContext, useEffect, useRef, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

interface NetworkContextType {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  // True only when transitioning from offline → online
  justReconnected: boolean;
}

const NetworkContext = createContext<NetworkContextType>({
  isConnected: true,
  isInternetReachable: true,
  justReconnected: false,
});

export const NetworkProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState<
    boolean | null
  >(true);
  const [justReconnected, setJustReconnected] = useState(false);
  const prevConnected = useRef<boolean | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNetworkChange = (state: NetInfoState) => {
    const connected = state.isConnected ?? false;

    // Detect reconnection
    if (prevConnected.current === false && connected) {
      setJustReconnected(true);
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      // Reset justReconnected flag after consumers have reacted
      reconnectTimer.current = setTimeout(() => setJustReconnected(false), 500);
    }

    prevConnected.current = connected;
    setIsConnected(connected);
    setIsInternetReachable(state.isInternetReachable);
  };

  useEffect(() => {
    // Fetch initial state
    NetInfo.fetch().then(handleNetworkChange);

    // Subscribe to changes
    const unsubscribe = NetInfo.addEventListener(handleNetworkChange);

    return () => {
      unsubscribe();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, []);

  return (
    <NetworkContext.Provider
      value={{ isConnected, isInternetReachable, justReconnected }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = (): NetworkContextType => useContext(NetworkContext);
