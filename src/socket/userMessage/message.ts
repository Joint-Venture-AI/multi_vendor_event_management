// import { Types } from 'mongoose';
// import { io } from '../socket';
// import { ChatServices } from '../../modules/chat/chat.service';

// export const handleSendMessage = (data: {
//   senderId: Types.ObjectId;
//   receiverId: Types.ObjectId;
//   senderModel: 'User' | 'Doctor';
//   receiverModel: 'User' | 'Doctor';
//   message?: string;
//   seenBy: string[];
//   file?: string;
// }) => {
//   io.emit(`receiver-${data.receiverId}`, {
//     senderId: data.senderId,
//     receiverId: data.receiverId,
//     senderModel: data.senderModel,
//     receiverModel: data.receiverModel,
//     message: data.message,
//     file: data.file,
//     seenBy: data.seenBy,
//   });

//   if (data.message && data.receiverId && data.senderId) {
//     console.log('inner', data);
//     ChatServices.createChat({
//       senderId: new Types.ObjectId(data.senderId),
//       receiverId: new Types.ObjectId(data.receiverId),
//       senderModel: data.senderModel,
//       receiverModel: data.receiverModel,
//       message: data.message,
//       seenBy: [data.senderId as any],
//     });
//   }
// };
