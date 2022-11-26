/* eslint-disable @shopify/jsx-no-hardcoded-content */
import {FullWidthColumn} from '@shared/components/FullWidthColumn';
import PageFrame from '@shared/components/PageFrame';
import {useEffect} from 'react';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {useAlertContext} from '@shared/hooks/Alerts';

import getTransactions from '@/data/api/requests/transactions';
import ITransaction from '@/data/api/types/ITransaction';
import {selfTransferTokens} from '@/data/api/requests/crypto';

function Wallet() {
  const dispatchAlert = useAlertContext();
  const queryClient = useQueryClient();
  const {data, status} = useQuery<ITransaction[]>(
    'transactions',
    getTransactions,
  );

  useEffect(() => {
    if (status === 'error') {
      dispatchAlert.error('Error fetching data');
    }
  }, [dispatchAlert, status]);

  const {mutate} = useMutation((amount: number) => selfTransferTokens(amount), {
    onSuccess: () => {
      dispatchAlert.success('Tokens transferred successfully');
    },
    onError: () => {
      dispatchAlert.error('Error transferring tokens');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['transactions']);
    },
  });

  return (
    <PageFrame>
      <FullWidthColumn>
        {status === 'success' && (
          // eslint-disable-next-line @shopify/jsx-prefer-fragment-wrappers
          <div>
            {data.map((t) => (
              <p key={t.id}>
                {t.description} : {t.tokenAmount} coins at {t.timestamp} from
                wallet: {t.walletType}
              </p>
            ))}
          </div>
        )}
      </FullWidthColumn>
    </PageFrame>
  );
}

export default Wallet;
