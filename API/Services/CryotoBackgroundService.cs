using System.Diagnostics.CodeAnalysis;
using System.Text.Json;
using API.Services.Interfaces;
using Azure.Storage.Queues;

namespace API.Services;

[ExcludeFromCodeCoverage]
public class CryotoBackgroundService : BackgroundService
{
    private readonly QueueClient _queueClient;
    private readonly IServiceProvider _serviceProvider;


    public CryotoBackgroundService(QueueClient queueClient,
        IServiceProvider serviceProvider)
    {
        _queueClient = queueClient;
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (IServiceScope scope = _serviceProvider.CreateScope())
            {
                ICryptoService cryptoService =
                    scope.ServiceProvider.GetRequiredService<ICryptoService>();
                var queueMessage = await _queueClient.ReceiveMessageAsync();

                if (queueMessage.Value != null)
                {
                    var oIdsList = JsonSerializer.Deserialize<List<string>>(queueMessage.Value.MessageText);
                    foreach (var oid in oIdsList!.Select((value, index) => new { index, value }))
                    {
                        try
                        {
                            if (oid.index == 0)
                            {
                                if (oid.value == "CheckBalanceMessage")
                                {
                                    var SolBalance = cryptoService.GetSolBalance();
                                    if (SolBalance < 0.09)
                                    {
                                        //Notify admins on low balance
                                    }
                                    cryptoService.QueueSolUpdate(new List<string> { "CheckBalanceMessage" });
                                }
                                else
                                {
                                    var senderTokenBalance =
                                        await cryptoService.GetSolanaTokenBalanceAsync(oid.value, "toAward");
                                    await cryptoService.UpdateSolanaTokenBalance(senderTokenBalance, oid.value,
                                        "toAward");
                                }
                            }
                            else
                            {
                                var tokenBalance = await cryptoService.GetSolanaTokenBalanceAsync(oid.value, "toSpend");
                                await cryptoService.UpdateSolanaTokenBalance(tokenBalance, oid.value, "toSpend");
                            }
                        }
                        catch (Exception)
                        {
                            // ignored
                        }
                    }

                    await _queueClient.DeleteMessageAsync(queueMessage.Value.MessageId, queueMessage.Value.PopReceipt);
                }

                await Task.Delay(TimeSpan.FromSeconds(10));
            }
        }
    }
}