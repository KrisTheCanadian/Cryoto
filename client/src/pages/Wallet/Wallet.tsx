import {FullWidthColumn} from '@shared/components/FullWidthColumn';
import PageFrame from '@shared/components/PageFrame';
import {useEffect} from 'react';
import {useQuery} from 'react-query';
import {useAlertContext} from '@shared/hooks/Alerts';

import getTransactions from '@/data/api/requests/transactions';
import ITransaction from '@/data/api/types/ITransaction';

function Wallet() {
  const rightBarContent = 'Wallet Route';
  const dispatchAlert = useAlertContext();

  const {data, status} = useQuery<ITransaction[]>(
    'transactions',
    getTransactions,
  );

  useEffect(() => {
    if (status === 'error') {
      dispatchAlert.error('Error fetching data');
    }
  }, [dispatchAlert, status]);

  return (
    <PageFrame>
      <FullWidthColumn>
        {status === 'success' && (
          // eslint-disable-next-line @shopify/jsx-prefer-fragment-wrappers
          <div>
            {data.map((t) => (
              // eslint-disable-next-line @shopify/jsx-no-hardcoded-content
              <p key={t.id}>
                {t.description} : {t.tokenAmount} coins at {t.timestamp} from
                wallet: {t.walletType}
              </p>
            ))}
          </div>
        )}
        {rightBarContent}
      </FullWidthColumn>
    </PageFrame>
  );
}

export default Wallet;
