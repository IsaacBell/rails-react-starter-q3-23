import { Consumer, Subscription } from '@rails/actioncable';
import {
  useState, useEffect, useRef, useCallback,
} from 'react';

// Needed for @rails/actioncable
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let global: any;
global.addEventListener = () => {};
global.removeEventListener = () => {};

type Data = {
  channel: string;
  id?: number;
};

type Callbacks<T> = {
  received?: (_message: T) => void;
  initialized?: () => void;
  connected?: () => void;
  disconnected?: () => void;
};

export default function useChannel<ReceivedType>(actionCable: Consumer) {
  const [connected, setConnected] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const channelRef = useRef<Subscription<Consumer> | null>(null);

  const subscribe = (data: Data, callbacks: Callbacks<ReceivedType>) => {
    console.log(`useChannel - INFO: Connecting to ${data.channel}`);
    const channel = actionCable.subscriptions.create(data, {
      received: (message: ReceivedType) => {
        if (callbacks.received) {
          callbacks.received(message);
        }
      },
      initialized: () => {
        console.log(`useChannel - INFO: Init ${data.channel}`);
        setSubscribed(true);
        if (callbacks.initialized) {
          callbacks.initialized();
        }
      },
      connected: () => {
        console.log(`useChannel - INFO: Connected to ${data.channel}`);
        setConnected(true);
        if (callbacks.connected) {
          callbacks.connected();
        }
      },
      disconnected: () => {
        console.log('useChannel - INFO: Disconnected');
        setConnected(false);
        if (callbacks.disconnected) {
          callbacks.disconnected();
        }
      },
    });
    channelRef.current = channel;
  };

  const unsubscribe = useCallback(() => {
    setSubscribed(false);
    if (channelRef.current) {
      console.log(
        `useChannel - INFO: Unsubscribing from ${
          channelRef.current.identifier}`,
      );
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }
  }, []);

  useEffect(() => () => {
    unsubscribe();
  }, [unsubscribe]);

  const send = (action: string, payload: {} | undefined) => {
    if (subscribed && !connected) {
      throw 'useChannel - ERROR: not connected';
    }

    if (!subscribed) {
      throw 'useChannel - ERROR: not subscribed';
    }

    try {
      channelRef?.current?.perform(action, payload);
    } catch (e) {
      throw `useChannel - ERROR: ${e}`;
    }
  };

  return { subscribe, unsubscribe, send };
}
