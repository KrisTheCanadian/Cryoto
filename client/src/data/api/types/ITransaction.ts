interface ITransaction {
  id: string;
  userId: string;
  walletType: string;
  tokenAmount: number;
  description: string;
  timestamp: string;
}

export default ITransaction;
