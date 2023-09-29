import { useEffect, useMemo } from 'react';
import { createConsumer } from '@rails/actioncable';

const useActionCable = (url: string) => {
  const actionCable = useMemo(() => createConsumer(url), [url]);

  useEffect(() => () => {
    // eslint-disable-next-line no-console
    console.info('Socket connection closed.');
    actionCable.disconnect();
  }, [actionCable]);

  return { actionCable };
};

export default useActionCable;
