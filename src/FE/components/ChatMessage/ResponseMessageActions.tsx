import { AdminModelDto } from '@/types/adminApis';
import { ChatRole, ChatSpanStatus, Content } from '@/types/chat';
import { ReactionMessageType } from '@/types/chatMessage';

import ChangeModelAction from './ChangeModelAction';
import CopyAction from './CopyAction';
import GenerateInformationAction from './GenerateInformationAction';
import PaginationAction from './PaginationAction';
import ReactionBadResponseAction from './ReactionBadResponseAction';
import ReactionGoodResponseAction from './ReactionGoodResponseAction';
import RegenerateAction from './RegenerateAction';

export interface ResponseMessage {
  id: string;
  siblingIds: string[];
  parentId: string | null;
  role: ChatRole;
  content: Content;
  inputTokens: number;
  outputTokens: number;
  reasoningTokens: number;
  inputPrice: number;
  outputPrice: number;
  duration: number;
  firstTokenLatency: number;
  modelId: number;
  modelName: string;
  modelProviderId: number;
  reaction: boolean | null;
}

interface Props {
  models: AdminModelDto[];
  message: ResponseMessage;
  chatStatus: ChatSpanStatus;
  readonly?: boolean;
  onChangeMessage?: (messageId: string) => void;
  onRegenerate?: (messageId: string, modelId: number) => void;
  onReactionMessage?: (type: ReactionMessageType, messageId: string) => void;
}

const ResponseMessageActions = (props: Props) => {
  const {
    models,
    message,
    chatStatus,
    readonly,
    onChangeMessage,
    onRegenerate,
    onReactionMessage,
  } = props;

  const { id: messageId, siblingIds, modelId, modelName, parentId } = message;
  const currentMessageIndex = siblingIds.findIndex((x) => x === messageId);

  const handleReactionMessage = (type: ReactionMessageType) => {
    onReactionMessage && onReactionMessage(type, messageId);
  };

  return (
    <>
      {chatStatus === ChatSpanStatus.Chatting ? (
        <div className="h-9"></div>
      ) : (
        <div className="flex gap-1 flex-wrap mt-1">
          <PaginationAction
            hidden={siblingIds.length <= 1}
            disabledPrev={currentMessageIndex === 0}
            disabledNext={currentMessageIndex === siblingIds.length - 1}
            messageIds={siblingIds}
            currentSelectIndex={currentMessageIndex}
            onChangeMessage={onChangeMessage}
          />
          <div className="visible flex gap-0 items-center">
            <CopyAction text={message.content.text} />
            <GenerateInformationAction message={message} />

            <ReactionGoodResponseAction
              value={message.reaction}
              onReactionMessage={handleReactionMessage}
            />
            <ReactionBadResponseAction
              value={message.reaction}
              onReactionMessage={handleReactionMessage}
            />

            <RegenerateAction
              hidden={readonly}
              onRegenerate={() => {
                onRegenerate && onRegenerate(parentId!, modelId);
              }}
            />
            <ChangeModelAction
              readonly={readonly}
              models={models}
              onChangeModel={(model) => {
                onRegenerate && onRegenerate(parentId!, model.modelId);
              }}
              showRegenerate={models.length > 0}
              modelName={modelName!}
              modelId={modelId}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ResponseMessageActions;
