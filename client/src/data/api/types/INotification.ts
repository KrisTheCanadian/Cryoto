interface INotification {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  type: string;
  created: string;
  seen: boolean;
  senderName: string;
  receiverName: string;
  amount: number;
}

export default INotification;
