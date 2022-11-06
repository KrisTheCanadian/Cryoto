namespace API.Crypto.Solana.SolanaObjects;

public class RpcTransactionResult
{
    public string? jsonrpc { get; set; }
    public string? result { get; set; }
    public Error? error { get; set; }
    public int id { get; set; }
    
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

    public bool WasSuccessful()
    {
        if (result != null) return true;
        return false;
    }
    
    public override string ToString()
    {
        string txHash = "";
        string errorLogs = "";
        string wasSuccessful = "";
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

            foreach (string errorlog in error.data!.logs!) errorLogs += "\n" + errorlog;

        }
        
        return wasSuccessful + txHash + errorLogs;
    }
}
