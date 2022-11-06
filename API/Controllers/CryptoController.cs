using API.Crypto.Solana.SolanaObjects;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
[ApiController]
[Route("[controller]/[action]")]
public class CryptoController : ControllerBase
{
    private readonly ICryptoService _cryptoService;
    private readonly IUserProfileService _userProfileService;


    public CryptoController(ICryptoService cryptoService, IUserProfileService userProfileService)
    {
        _cryptoService = cryptoService;
        _userProfileService = userProfileService;
    }

    [HttpPost]
    public async Task<ActionResult<RpcTransactionResult>> PostTransaction([FromHeader] string authorization,
        double amount, string receiverOId)
    {
        var userDetails = _userProfileService.GetUserProfileDetails(authorization);
        var senderOId = userDetails.OId;

        var rpcTransactionResult = await _cryptoService.SendTokens(amount, senderOId, receiverOId);
        if (rpcTransactionResult?.error != null)
            return BadRequest(rpcTransactionResult.error);
        
        await _cryptoService.UpdateTokenBalance((amount), receiverOId, "toSpend");
        await _cryptoService.UpdateTokenBalance((-amount), senderOId, "toAward");
        _cryptoService.QueueTokenUpdate(new List<string> { senderOId, receiverOId });

        return Ok(rpcTransactionResult);
    }
    
    [HttpPost("/purchase", Name = "PurchaseTransactionController")]
    public async Task<ActionResult<RpcTransactionResult>> PurchaseTransaction([FromHeader] string authorization, double amount)
    {
        var userDetails = _userProfileService.GetUserProfileDetails(authorization);
        var userOId = userDetails.OId;
        
        var rpcTransactionResult = await _cryptoService.CreatePurchase(amount, userOId);
        if (rpcTransactionResult.error != null)
            return BadRequest(rpcTransactionResult.error);
        await _cryptoService.UpdateTokenBalance((-amount), userOId, "toSpend");

        _cryptoService.QueueTokenUpdate(new List<string> { userOId });
        return Ok(rpcTransactionResult);
    }

    [HttpGet]
    public async Task<ActionResult<double>> GetTokenBalance([FromHeader] string authorization, string walletType)
    {
        var userDetails = _userProfileService.GetUserProfileDetails(authorization);
        return Ok(await _cryptoService.GetTokenBalanceAsync(userDetails.OId, walletType));
    }
}