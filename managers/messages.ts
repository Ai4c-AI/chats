import { ChatMessages, ChatModels, Users } from '@/db';
import { Message } from '@/types/chat';
import { UserModelManager } from './userModels';
import { UserModel } from '@/db/userModels';
import { Op } from 'sequelize';
import { UserChatMessage } from '@/types/message';
import { PageResult } from '@/types/page';

export interface CreateMessage {
  id: string;
  messages: Message[];
  modelId: string;
  userId: string;
  prompt: string;
  tokenCount: number;
  chatCount: number;
  totalPrice: number;
}

export class ChatMessageManager {
  static async findMessageById(id: string) {
    return await ChatMessages.findOne({
      where: {
        id,
      },
    });
  }

  static async findUserMessageById(id: string, userId: string) {
    return await ChatMessages.findOne({
      where: {
        id,
        userId,
      },
    });
  }

  static async findMessages(query: string, page: number, pageSize: number) {
    const messages = (await ChatMessages.findAndCountAll({
      include: [
        {
          attributes: ['username', 'role'],
          model: Users,
          where: {
            [Op.or]: [
              {
                username: { [Op.like]: `%${query}` },
              },
            ],
          },
        },
        {
          attributes: ['name'],
          model: ChatModels,
        },
      ],
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['updatedAt', 'DESC']],
    })) as PageResult<UserChatMessage[]>;
    return messages;
  }

  static async findUserMessages(userId: string) {
    const messages = (await ChatMessages.findAll({
      include: [
        {
          attributes: [
            'name',
            'id',
            'modelVersion',
            'modelConfig',
            'type',
            'fileConfig',
            'fileServerId',
          ],
          model: ChatModels,
        },
      ],
      where: {
        userId,
        isDeleted: {
          [Op.not]: true,
        },
      },
      order: [['createdAt', 'ASC']],
    })) as UserChatMessage[];
    return messages;
  }

  static async updateMessageById(
    id: string,
    messages: Message[],
    tokenCount: number,
    chatCount: number,
    totalPrice: number
  ) {
    return await ChatMessages.update(
      {
        messages,
        tokenCount,
        chatCount,
        totalPrice,
      },
      {
        where: {
          id,
        },
      }
    );
  }

  static async updateUserMessage(id: string, name: string, isShared: boolean) {
    return await ChatMessages.update({ name, isShared }, { where: { id } });
  }

  static async deleteMessageById(id: string) {
    return await ChatMessages.update(
      { isDeleted: true, isShared: false },
      { where: { id } }
    );
  }

  static async createMessage(params: CreateMessage) {
    const { id, messages, modelId, userId, prompt, tokenCount, totalPrice } =
      params;
    return await ChatMessages.create({
      id,
      messages,
      modelId,
      name: messages[0].content.text!.substring(0, 30),
      userId,
      prompt,
      tokenCount,
      chatCount: 1,
      totalPrice,
    });
  }

  static async recordChat(
    messageId: string,
    userId: string,
    userModelId: string,
    messages: Message[],
    tokenCount: number,
    totalPrice: number,
    promptToSend: string,
    chatModel: ChatModels,
    userModel: UserModel
  ) {
    const chatMessages = await ChatMessageManager.findUserMessageById(
      messageId,
      userId
    );
    if (chatMessages) {
      await ChatMessageManager.updateMessageById(
        chatMessages.id!,
        messages,
        tokenCount + chatMessages.tokenCount,
        chatMessages.chatCount + 1,
        totalPrice + chatMessages.totalPrice
      );
    } else {
      await ChatMessageManager.createMessage({
        id: messageId,
        messages,
        modelId: chatModel.id!,
        userId: userId,
        prompt: promptToSend,
        tokenCount,
        chatCount: 1,
        totalPrice,
      });
    }
    await UserModelManager.updateUserModelTokenCount(
      userModelId,
      userModel.modelId,
      tokenCount
    );
  }
}
