using System.Diagnostics.CodeAnalysis;

namespace API.Crypto.Solana.SolanaObjects;

[ExcludeFromCodeCoverage]
public class RpcTransactionResult
{
    public string? jsonrpc { get; set; }
    public string? result { get; set; }
    public Error? error { get; set; }
    public int id { get; set; }

    public bool WasSuccessful()
    {
        return result != null;
    }

    public override string ToString()
    {
        var txHash = "";
        var errorLogs = "";
        var wasSuccessful = "";
        if (result != null)
        {
            wasSuccessful = "Transaction State: success";
            txHash = "\nTransaction Hash: " + result;
        }

        if (error != null)
        {
            wasSuccessful = "Transaction State: error";
            errorLogs = "\nError Code: " + error.code
                                         + "\nError Message: " + error.message;

            errorLogs = error.data!.logs!.Aggregate(errorLogs, (current, errorlog) => current + "\n" + errorlog);
        }

        return wasSuccessful + txHash + errorLogs;
    }

    public class Error
    {
        public int code { get; set; }
        public string? message { get; set; }
        public Data? data { get; set; }
    }

    public class Data
    {
        public object? accounts { get; set; }
        public List<string>? logs { get; set; }
        public int unitsConsumed { get; set; }
    }
}