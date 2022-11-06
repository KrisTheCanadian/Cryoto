using System.Text.Json;
using API.Services.Interfaces;
using Azure.Storage.Queues;

namespace API.Services;

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
                        if (oid.index == 0)
                        {
                            var senderTokenBalance = cryptoService.GetSolanaTokenBalanceAsync(oid.value, "toAward");
                            await cryptoService.UpdateSolanaTokenBalance(senderTokenBalance.Result, oid.value,
                                "toAward");
                        }
                        else
                        {
                            var tokenBalance = cryptoService.GetSolanaTokenBalanceAsync(oid.value, "toSpend");
                            await cryptoService.UpdateSolanaTokenBalance(tokenBalance.Result, oid.value, "toSpend");
                        }
                    }

                    await _queueClient.DeleteMessageAsync(queueMessage.Value.MessageId, queueMessage.Value.PopReceipt);
                }

                await Task.Delay(TimeSpan.FromSeconds(10));
            }
        }
    }
}