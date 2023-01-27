using System.Diagnostics.CodeAnalysis;
using API.Services.Interfaces;
using Azure.Storage.Queues;
using static System.Threading.Tasks.Task;
using System.Text.Json;

namespace API.Services;

[ExcludeFromCodeCoverage]
public class CryotoBackgroundService : BackgroundService
{
    private readonly QueueClient _queueClient;
    private readonly IServiceProvider _serviceProvider;
    private readonly IConfiguration _configuration;


    public CryotoBackgroundService(QueueClient queueClient,
        IServiceProvider serviceProvider, IConfiguration configuration)
    {
        _queueClient = queueClient;
        _serviceProvider = serviceProvider;
        _configuration = configuration;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _serviceProvider.CreateScope();
            var cryptoService =
                scope.ServiceProvider.GetRequiredService<ICryptoService>();
            var notificationService =
                scope.ServiceProvider.GetRequiredService<INotificationService>();
            var queueMessage = await _queueClient.ReceiveMessageAsync(cancellationToken: stoppingToken);

            if (queueMessage.Value != null)
            {
                try
                {
                    var messageList =
                        JsonSerializer.Deserialize<List<List<string>>>(queueMessage.Value.MessageText);


                    switch (messageList![0][0])
                    {
                        case "checkAdminBalanceQueue":
                        {
                            var solanaAdminBalance = cryptoService.GetSolanaAdminBalance();
                            if (solanaAdminBalance < double.Parse(_configuration["SolanaBalanceLowLimit"]))
                            {
                                //Notify admins on low balance
                            }

                            var solanaAdminTokenBalance = cryptoService.GetSolanaAdminTokenBalance();
                            if (solanaAdminTokenBalance < double.Parse(_configuration["SolanaTokenBalanceLowLimit"]))
                            {
                                const string messageHtml =
                                    "<h1>Solana token balance is too low</h1> <p>Hi " + "Cryoto Admin" +
                                    ",</p> <p>Solana token balance is less than 10000</p>";
                                await notificationService.SendEmailAsync(_configuration["LowBalanceAdminEmail"],
                                    "Solana token balance alert",
                                    messageHtml, true);
                            }

                            cryptoService.QueueSolUpdate(new List<List<string>>
                                { new() { "checkAdminBalanceQueue" }, new() { "null" } });
                            break;
                        }
                        case "monthlyTokenQueue":
                        {
                            var oid = messageList[1][0];
                            var weekNumber = int.Parse(messageList[1][1]);
                            if (weekNumber == 4)
                            {
                                await cryptoService.SendMonthlyTokenBasedOnRole(oid);
                                cryptoService.QueueMonthlyTokensGift(new List<List<string>>
                                    { new() { "monthlyTokenQueue" }, new() { oid, "1" } });
                            }
                            else
                            {
                                weekNumber += 1;
                                cryptoService.QueueMonthlyTokensGift(new List<List<string>>
                                {
                                    new() { "monthlyTokenQueue" },
                                    new() { oid, weekNumber.ToString() }
                                });
                            }


                            break;
                        }
                        case "tokenUpdateQueue":
                        {
                            foreach (var oid in messageList[1].Select((value, index) => new { index, value }))
                            {
                                if (oid.index == 0)
                                {
                                    var senderTokenBalance =
                                        await cryptoService.GetSolanaTokenBalanceAsync(oid.value, "toAward");
                                    await cryptoService.UpdateSolanaTokenBalance(senderTokenBalance, oid.value,
                                        "toAward");
                                }
                                else
                                {
                                    var tokenBalance =
                                        await cryptoService.GetSolanaTokenBalanceAsync(oid.value, "toSpend");
                                    await cryptoService.UpdateSolanaTokenBalance(tokenBalance, oid.value, "toSpend");
                                }
                            }

                            break;
                        }
                    }
                }
                catch (Exception)
                {
                    // ignored
                }

                await _queueClient.DeleteMessageAsync(queueMessage.Value.MessageId, queueMessage.Value.PopReceipt,
                    stoppingToken);
            }

            await Delay(TimeSpan.FromSeconds(5), stoppingToken);
        }
    }
}