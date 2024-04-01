import { ChatModels } from '@/db';
import { ChatModelApiConfig } from '@/db/models';
import {
  ChatModelConfig,
  ChatModelFileConfig,
  ChatModelPrice,
  ModelType,
  ModelVersions,
} from '@/types/model';

export class ChatModelManager {
  static async findModels(findAll: boolean = false) {
    const where = { enabled: true };
    return await ChatModels.findAll({
      where: findAll ? {} : where,
      order: [
        ['rank', 'asc'],
        ['createdAt', 'asc'],
      ],
    });
  }

  static async findModelById(id: string) {
    return await ChatModels.findOne({
      where: {
        id,
      },
    });
  }

  static async deleteModelById(id: string) {
    return await ChatModels.destroy({
      where: {
        id,
      },
    });
  }

  static async findModelByName(name: string) {
    return await ChatModels.findOne({
      where: {
        name,
      },
    });
  }

  static async createModel(
    type: ModelType,
    modelVersion: ModelVersions,
    name: string,
    enabled: boolean,
    price: ChatModelPrice,
    modelConfig: ChatModelConfig,
    apiConfig: ChatModelApiConfig,
    fileServerId: string,
    fileConfig: ChatModelFileConfig
  ) {
    return await ChatModels.create({
      type,
      modelVersion,
      name,
      enabled,
      modelConfig,
      apiConfig,
      fileServerId,
      fileConfig,
      price,
    });
  }

  static async updateModel(
    id: string,
    name: string,
    enabled: boolean,
    modelConfig: ChatModelConfig,
    apiConfig: ChatModelApiConfig,
    fileServerId: string,
    fileConfig: ChatModelFileConfig,
    price: ChatModelPrice
  ) {
    return await ChatModels.update(
      {
        name,
        enabled,
        modelConfig,
        apiConfig,
        fileServerId,
        fileConfig,
        price,
      },
      {
        where: { id },
      }
    );
  }
}
