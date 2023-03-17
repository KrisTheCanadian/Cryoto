using System.Security.Claims;
using API.Crypto.Solana.SolanaObjects;
using API.Models.Transactions;
using API.Models.Users;
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
    private readonly ITransactionService _transactionService;
    private readonly string _oId;


    public CryptoController(ICryptoService cryptoService, ITransactionService transactionService,
        IHttpContextAccessor contextAccessor)
    {
        _cryptoService = cryptoService;
        _transactionService = transactionService;
        _identity = contextAccessor.HttpContext!.User.Identity as ClaimsIdentity;
        _oId = _identity?.FindFirst(ClaimConstants.ObjectId)?.Value!;
    }
    
    [HttpPost]
    public async Task<ActionResult<RpcTransactionResult>> SelfTransferTokens(double amount)
    {
        var rpcTransactionResult = await _cryptoService.SelfTransferTokens(amount, _oId);
        if (rpcTransactionResult.error != null)
            return BadRequest(rpcTransactionResult.error);
        await _cryptoService.UpdateTokenBalance(-amount, _oId, "toSpend");
        await _cryptoService.UpdateTokenBalance(amount, _oId, "toAward");
        await _transactionService.AddTransactionAsync(new TransactionModel(_oId, "toAward", "self",
            "toSpend", amount, "SelfTransfer", DateTimeOffset.UtcNow));
        await _transactionService.AddTransactionAsync(new TransactionModel("self", "toAward", _oId,
            "toSpend", amount, "SelfTransfer", DateTimeOffset.UtcNow));
       _cryptoService.QueueTokenUpdate(new List<List<string>>
            { new() { "tokenUpdateQueue" }, new() { _oId, _oId } });
        return Ok(rpcTransactionResult);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")] // Only admin can transfer tokens (this can be deleted later on)
    public async Task<ActionResult<RpcTransactionResult>> PostTokens(double amount, string walletType)
    {
        var rpcTransactionResult = await _cryptoService.AddTokensAsync(amount, _oId, walletType);
        if (rpcTransactionResult.error != null)
            return BadRequest(rpcTransactionResult.error);
        await _cryptoService.UpdateTokenBalance(amount, _oId, walletType);
        await _transactionService.AddTransactionAsync(new TransactionModel(_oId, walletType, "master",
            "master", amount, "SwaggerPostTokensAPI", DateTimeOffset.UtcNow));


        _cryptoService.QueueTokenUpdate(new List<List<string>>
            { new() { "tokenUpdateQueue" }, new() { _oId } });
        return Ok(rpcTransactionResult);
    }

    [HttpGet]
    public async Task<ActionResult<UserWalletsModel>> GetTokenBalance()
    {
        return Ok(await _cryptoService.GetWalletsBalanceAsync(_oId, _identity));
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public ActionResult<double> GetSolBalance()
    {
        return Ok(_cryptoService.GetSolanaAdminBalance());
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public ActionResult InitiateSolBalanceCheck()
    {
        _cryptoService.QueueSolUpdate(new List<List<string>>
            { new() { "checkAdminBalanceQueue" }, new() { "null" } });

        return Ok();
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> InitiateMonthlyTokensGift(string oid)
    {
        await _cryptoService.SendMonthlyTokenBasedOnRole(oid);
        _cryptoService.QueueMonthlyTokensGift(new List<List<string>>
            { new() { "monthlyTokenQueue" }, new() { oid } });
        return Ok();
    }
    
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public ActionResult InitiateAnniversaryBonusGifting()
    {
        _cryptoService.QueueAnniversaryBonus(new List<List<string>>
            { new() { "anniversaryBonusQueue" }, new() { "null" } });
        return Ok();
    }
}