using System.Text.Json;
using API.Crypto.Solana.SolanaObjects;
using Solnet.Extensions;
using Solnet.Extensions.TokenMint;
using Solnet.Rpc;
using Solnet.Wallet;

namespace API.Crypto.Solana;

public static class SolanaTransactions
{
    private static readonly IRpcClient RpcClient = ClientFactory.GetClient(Cluster.DevNet);

    /// <summary>
    ///     Get the Token wallet and sub-accounts from a wallet's Public Key and the Solana Token
    /// </summary>
    /// <param name="pb">Wallet's Public Key</param>
    /// <param name="tokenDescription">
    ///     Token Definition object used by the TokenMintResolver
    ///     which uniquely identifies a token on the Solana blockchain
    /// </param>
    /// <returns>TokenWallet object</returns>
    private static TokenWallet GetTokenWallet(PublicKey pb, TokenDef tokenDescription)
    {
        // add TokenDef for a DevNet minted token created
        var tokens = new TokenMintResolver();
        tokens.Add(tokenDescription);

        // load snapshot of wallet and sub-accounts
        var tokenWallet = TokenWallet.Load(RpcClient, tokens, pb);

        return tokenWallet;
    }

    /// <summary>
    ///     Gets the individual Token Account associated with the user public key and the Token def
    /// </summary>
    /// <param name="tokenWallet"></param>
    /// <param name="tokenDescription">
    ///     Token Definition object used by the TokenMintResolver
    ///     which uniquely identifies a token on the Solana blockchain
    /// </param>
    /// <param name="pb">Wallet's Public Key</param>
    /// <returns>TokenWalletAccount object</returns>
    private static TokenWalletAccount GetTokenWalletAccount(TokenWallet tokenWallet, TokenDef tokenDescription,
        PublicKey pb)
    {
        var tokenAccountList = tokenWallet.TokenAccounts().ForToken(tokenDescription);
        var tokenWalletAcc = tokenAccountList.WithCustomFilter(x => x.Owner.Equals(pb)).AssociatedTokenAccount();

        return tokenWalletAcc;
    }

    /// <summary>
    ///     Get the token balance of a wallet
    /// </summary>
    /// <param name="pb">Wallet's Public Key</param>
    /// <param name="tokenAddress">Address of required token</param>
    /// <returns>token balance</returns>
    public static double GetTokenWalletBalance(PublicKey pb, string tokenAddress)
    {
        // Gets all SPL Token accounts by token owner and based on token address
        var tokenAccounts = RpcClient.GetTokenAccountsByOwner(pb, tokenAddress);
        if (tokenAccounts.Result.Value.Count != 0)
        {
            var account = tokenAccounts.Result.Value[0];
            var balance = account.Account.Data.Parsed.Info.TokenAmount.Amount;
            var balanceNumber = double.Parse(balance) / 1000000000;

            return balanceNumber;
        }

        return 0;
    }

    /// <summary>
    ///     Send Tokens from one wallet to another.
    /// </summary>
    /// <param name="amount">Amount to send</param>
    /// <param name="sender">Wallet of sender account</param>
    /// <param name="feePayer">Wallet of fee payer (owner account)</param>
    /// <param name="receiver">Public key of receiver</param>
    /// <param name="tokenAddress">Address of token to be sent</param>
    /// <returns>RpcTransactionResult object</returns>
    public static RpcTransactionResult SendTokens(double amount, Wallet sender, Wallet feePayer, string receiver,
        string tokenAddress)
    {
        var amountToSend = (decimal)amount;
        var tokenDescription = new TokenDef(tokenAddress, "Cryoto Token", "CT", 9);

        // Get source of token funds
        var tokenWallet = GetTokenWallet(sender.Account.PublicKey, tokenDescription);
        var tokenWalletAcc = GetTokenWalletAccount(tokenWallet, tokenDescription, sender.Account.PublicKey);

        // Add signers of the transaction
        IList<Account> signers = new List<Account>();
        if (!sender.Equals(feePayer))
        {
            signers.Add(feePayer.Account);
            signers.Add(sender.Account);
        }
        else
        {
            signers.Add(feePayer.Account);
        }

        // Sends token and signs transaction in callback to avoid passing private keys out of this scope
        var sig = tokenWallet.Send(tokenWalletAcc, amountToSend, receiver, feePayer.Account.PublicKey,
            txBuilder => txBuilder.Build(signers));

        // Deserializes Json result of transaction response
        var dataResult = JsonSerializer.Deserialize<RpcTransactionResult>(sig.RawRpcResponse);
        return dataResult!;
    }
}