using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace API.Models.Notifications;

[ExcludeFromCodeCoverage]
public class Notification
{
    public Notification(string senderId, string receiverId, string message, string type, double? amount)
    {
        Id = Guid.NewGuid();
        SenderId = senderId;
        ReceiverId = receiverId;
        Message = message;
        Type = type;
        Created = DateTimeOffset.UtcNow;
        Seen = false;
        Amount = amount;
    }

    [Key] public Guid Id { get; set; }

    public string SenderId { get; set; }
    public string ReceiverId { get; set; }
    public string Message { get; set; }
    public string Type { get; set; }
    public DateTimeOffset Created { get; set; }
    public bool Seen { get; set; }
    public double? Amount { get; set; }

    [NotMapped] public string? SenderName { get; set; }

    [NotMapped] public string? ReceiverName { get; set; }
}