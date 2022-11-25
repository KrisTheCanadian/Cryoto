using System.Security.Claims;
using API.Crypto.Solana.SolanaObjects;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web;

namespace API.Controllers;

[Authorize]
[ApiController]
[Route("[controller]/[action]")]
public class CryptoController : ControllerBase
{
    private readonly ICryptoService _cryptoService;
    private readonly ClaimsIdentity? _identity;
    private readonly string _oId;


    public CryptoController(ICryptoService cryptoService, IHttpContextAccessor contextAccessor)
    {
        _cryptoService = cryptoService;
        _identity = contextAccessor.HttpContext!.User.Identity as ClaimsIdentity;
        _oId = _identity?.FindFirst(ClaimConstants.ObjectId)?.Value!;
    }

    [HttpPost]
    public async Task<ActionResult<RpcTransactionResult>> PostTransaction(double amount, string receiverOId)
    {
        var rpcTransactionResult = await _cryptoService.SendTokens(amount, _oId, receiverOId);
        if (rpcTransactionResult?.error != null)
            return BadRequest(rpcTransactionResult.error);

        await _cryptoService.UpdateTokenBalance((amount), receiverOId, "toSpend");
        await _cryptoService.UpdateTokenBalance((-amount), _oId, "toAward");
        _cryptoService.QueueTokenUpdate(new List<string> { _oId, receiverOId });

        return Ok(rpcTransactionResult);
    }

    [HttpPost]
    public async Task<ActionResult<RpcTransactionResult>> PurchaseTransaction(double amount)
    {
        var rpcTransactionResult = await _cryptoService.CreatePurchase(amount, _oId);
        if (rpcTransactionResult.error != null)
            return BadRequest(rpcTransactionResult.error);
        await _cryptoService.UpdateTokenBalance((-amount), _oId, "toSpend");

        _cryptoService.QueueTokenUpdate(new List<string> { _oId });
        return Ok(rpcTransactionResult);
    }

    [HttpPost]
    public async Task<ActionResult<RpcTransactionResult>> PostTokens(double amount, string walletType)
    {
        var rpcTransactionResult = await _cryptoService.AddTokensAsync(amount, _oId, walletType);
        if (rpcTransactionResult.error != null)
            return BadRequest(rpcTransactionResult.error);
        await _cryptoService.UpdateTokenBalance(amount, _oId, walletType);

        _cryptoService.QueueTokenUpdate(new List<string> { _oId });
        return Ok(rpcTransactionResult);
    }

    [HttpGet]
    public async Task<ActionResult<double>> GetTokenBalance(string walletType)
    {
        return Ok(await _cryptoService.GetTokenBalanceAsync(_oId, walletType, _identity));
    }
}