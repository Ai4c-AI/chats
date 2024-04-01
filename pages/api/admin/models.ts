import { ChatModelManager } from '@/managers';
import type { NextApiRequest, NextApiResponse } from 'next';
import { UserRole } from '@/types/admin';
import { getSession } from '@/utils/session';
import { ModelDefaultTemplates } from '@/types/template';
import { ModelVersions } from '@/types/model';
import { badRequest, internalServerError } from '@/utils/error';
import { addAsterisk, checkKey } from '@/utils/common';
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
  maxDuration: 5,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession(req.cookies);
  if (!session) {
    return res.status(401).end();
  }
  const role = session.role;
  if (role !== UserRole.admin) {
    res.status(401).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const { all } = req.query;
      const models = await ChatModelManager.findModels(!!all);
      const data = models.map((x) => {
        return {
          rank: x.rank,
          modelId: x.id,
          modelVersion: x.modelVersion,
          name: x.name,
          type: x.type,
          enabled: x.enabled,
          fileServerId: x.fileServerId,
          fileConfig: JSON.stringify(x.fileConfig || {}, null, 2),
          modelConfig: JSON.stringify(x.modelConfig || {}, null, 2),
          apiConfig: JSON.stringify(
            {
              appId: addAsterisk(x.apiConfig?.appId),
              apiKey: addAsterisk(x.apiConfig?.apiKey),
              secret: addAsterisk(x.apiConfig?.secret),
              version: x.apiConfig?.version,
              host: x.apiConfig.host,
              organization: x.apiConfig?.organization,
              type: x.apiConfig?.type,
            },
            null,
            2
          ),
          price: JSON.stringify(x.price || {}, null, 2),
        };
      });
      return res.json(data);
    } else if (req.method === 'PUT') {
      const {
        modelId,
        name,
        enabled,
        fileServerId,
        modelConfig: modelConfigJson,
        apiConfig: apiConfigJson,
        fileConfig: fileConfigJson,
        price: priceJSON,
      } = req.body;
      const model = await ChatModelManager.findModelById(modelId);
      if (!model) {
        res.status(400).end('Model is not Found!');
        return;
      }

      let modelConfig = JSON.parse(modelConfigJson);
      let apiConfig = JSON.parse(apiConfigJson);
      let fileConfig = JSON.parse(fileConfigJson);
      let price = JSON.parse(priceJSON);

      apiConfig.appId = checkKey(model?.apiConfig.apiKey, apiConfig.appId);
      apiConfig.apiKey = checkKey(model?.apiConfig.apiKey, apiConfig.apiKey);
      apiConfig.secret = checkKey(model?.apiConfig.secret, apiConfig.secret);

      const data = await ChatModelManager.updateModel(
        modelId,
        name,
        enabled,
        modelConfig,
        apiConfig,
        fileServerId,
        fileConfig,
        price
      );
      return res.json(data);
    } else if (req.method === 'POST') {
      const {
        modelVersion,
        name,
        enabled,
        fileServerId,
        price: priceJSON,
        modelConfig: modelConfigJson,
        apiConfig: apiConfigJson,
        fileConfig: fileConfigJson,
      } = req.body;

      const model = await ChatModelManager.findModelByName(name);
      if (model) {
        res.status(400).end('Model name is exist!');
        return;
      }

      const template = ModelDefaultTemplates[modelVersion as ModelVersions];

      if (!template) {
        res.status(400).end('Model is not Found!');
        return;
      }

      let modelConfig = JSON.parse(modelConfigJson);
      let apiConfig = JSON.parse(apiConfigJson);
      let fileConfig = JSON.parse(fileConfigJson);
      let price = JSON.parse(priceJSON);

      const data = await ChatModelManager.createModel(
        template.type,
        modelVersion,
        name,
        enabled,
        price,
        modelConfig,
        apiConfig,
        fileServerId,
        fileConfig
      );
      return res.json(data);
    } else if (req.method === 'DELETE') {
      const { id } = req.query as { id: string };
      const model = await ChatModelManager.findModelById(id);
      if (model) {
        await ChatModelManager.deleteModelById(id);
        res.end();
      }
      return badRequest(res, 'Model is not Found!');
    }
  } catch (error) {
    console.error(error);
    return internalServerError(res);
  }
};

export default handler;
