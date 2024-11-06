import { Injectable } from '@nestjs/common';
import { MakeConversationType } from './types/makeConversationType';
import { UserInputError } from '@nestjs/apollo';
import { ErrorMessage } from '../../../../message';
import { ConversationRepository } from '../../../../repositories/conversation.repository';
import { CustomDataSourceManager } from '../../../../utils/customEntityManager';
import { Conversation } from '../../../../entities/conversation.entity';
import { GetPagingConversationType } from './types/getPagingConversationType';
import { BuilderPaginationResponse } from '../../../../utils/utilFunction';
import { GetPagingConversationResponse } from './dtos/responses/getPagingConversationResponse';

@Injectable()
export class ConversationService {
  public constructor(private readonly conversationRepo: ConversationRepository) {}

  public async createConversationRoom(input: MakeConversationType): Promise<string> {
    const { attendeeIDs, createdBy, roomName } = input;

    if (!attendeeIDs?.filter(attendeeID => attendeeID !== createdBy.id).length) {
      throw new UserInputError(ErrorMessage.CONVERSATION.ATTENDEES_NOT_EMPTY);
    }

    const uniqueAttendeeIDs = new Set([...attendeeIDs, createdBy.id]);

    return await new CustomDataSourceManager().initialTransaction(async trx => {
      await trx.getRepository(Conversation).insert(
        this.conversationRepo.create({
          attendees: [...uniqueAttendeeIDs].map(attendeeId => ({
            userId: attendeeId,
            stun: undefined,
          })),
          createdByID: createdBy.id,
          name: roomName,
        }),
      );

      return `Conversation ${roomName} is created successfully!`;
    });
  }

  public async getPagingConversations(input: GetPagingConversationType): Promise<GetPagingConversationResponse> {
    const { pagination, user } = input;
    const builder = this.conversationRepo.createQueryBuilder('Conversation').where(
      `EXISTS (
         SELECT 1 FROM jsonb_array_elements(Conversation.attendees) AS attendee
         WHERE attendee->>'userId' = :userId
       )`,
      { userId: user.id },
    );

    return await new BuilderPaginationResponse<GetPagingConversationResponse>(builder, pagination).execute();
  }
}
