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
    public ClaimsIdentity? Identity;
    public string OId;
    private readonly ITransactionService _transactionService;


    public CryptoController(ICryptoService cryptoService, ITransactionService transactionService,
        IHttpContextAccessor contextAccessor)
    {
        _cryptoService = cryptoService;
        _transactionService = transactionService;
        Identity = contextAccessor.HttpContext!.User.Identity as ClaimsIdentity;
        OId = Identity?.FindFirst(ClaimConstants.ObjectId)?.Value!;
    }

    [HttpPost]
    public async Task<ActionResult<RpcTransactionResult>> SelfTransferTokens(double amount)
    {
        var rpcTransactionResult = await _cryptoService.SelfTransferTokens(amount, OId);
        if (rpcTransactionResult.error != null)
            return BadRequest(rpcTransactionResult.error);
        await _cryptoService.UpdateTokenBalance(-amount, OId, "toSpend");
        await _cryptoService.UpdateTokenBalance(amount, OId, "toAward");
        await _transactionService.AddTransactionAsync(new TransactionModel(OId, "toAward", "self",
            "toSpend", amount, "SelfTransfer", DateTimeOffset.UtcNow));
        await _transactionService.AddTransactionAsync(new TransactionModel("self", "toAward", OId,
            "toSpend", amount, "SelfTransfer", DateTimeOffset.UtcNow));
        await _cryptoService.QueueTokenUpdateAsync(new List<List<string>>
            { new() { "tokenUpdateQueue" }, new() { OId, OId } });
        return Ok(rpcTransactionResult);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")] // Only admin can transfer tokens (this can be deleted later on)
    public async Task<ActionResult<RpcTransactionResult>> PostTokens(double amount, string walletType)
    {
        var rpcTransactionResult = await _cryptoService.AddTokensAsync(amount, OId, walletType);
        if (rpcTransactionResult.error != null)
            return BadRequest(rpcTransactionResult.error);
        await _cryptoService.UpdateTokenBalance(amount, OId, walletType);
        await _transactionService.AddTransactionAsync(new TransactionModel(OId, walletType, "master",
            "master", amount, "SwaggerPostTokensAPI", DateTimeOffset.UtcNow));


        await _cryptoService.QueueTokenUpdateAsync(new List<List<string>>
            { new() { "tokenUpdateQueue" }, new() { OId } });
        return Ok(rpcTransactionResult);
    }

    [HttpGet]
    public async Task<ActionResult<UserWalletsModel>> GetTokenBalance()
    {
        return Ok(await _cryptoService.GetWalletsBalanceAsync(OId, Identity));
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
        _cryptoService.QueueSolUpdateAsync(new List<List<string>>
            { new() { "checkAdminBalanceQueue" }, new() { "null" } });

        return Ok();
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> InitiateMonthlyTokensGift(string oid)
    {
        await _cryptoService.SendMonthlyTokenBasedOnRole(oid);
        await _cryptoService.QueueMonthlyTokensGiftAsync(new List<List<string>>
            { new() { "monthlyTokenQueue" }, new() { oid } });
        return Ok();
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public ActionResult InitiateAnniversaryBonusGifting()
    {
        _cryptoService.QueueAnniversaryBonusAsync(new List<List<string>>
            { new() { "anniversaryBonusQueue" }, new() { "null" } });
        return Ok();
    }
}