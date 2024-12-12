import { Injectable } from '@nestjs/common';
import { MakeConversationType } from './types/makeConversationType';
import { UserInputError } from '@nestjs/apollo';
import { GetPagingConversationType } from './types/getPagingConversationType';
import { BuilderPaginationResponse } from '../../../../utils/utilFunction';
import { GetPagingConversationResponse } from './dtos/responses/getPagingConversationResponse';
import { ErrorMessage } from '../../../../errorMessages';
import { Model } from 'mongoose';
import { Conversation } from '../../../../schemas/conversation.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ConversationService {
  public constructor(@InjectModel(Conversation.name) private readonly conversationModel: Model<Conversation>) {}

  public async createConversationRoom(input: MakeConversationType): Promise<Conversation> {
    const { attendeeIDs, createdBy, roomName } = input;

    if (!attendeeIDs?.filter(attendeeID => attendeeID !== createdBy.id).length) {
      throw new UserInputError(ErrorMessage.CONVERSATION.ATTENDEES_NOT_EMPTY);
    }

    const uniqueAttendeeIDs = new Set([...attendeeIDs, createdBy.id]);

    return await this.conversationModel.create({
      attendees: [...uniqueAttendeeIDs].map(attendeeId => ({
        userId: attendeeId,
      })),
      createdById: createdBy.id,
      name: roomName,
    });
  }

  public async getPagingConversations(input: GetPagingConversationType): Promise<GetPagingConversationResponse> {
    const { pagination, user } = input;
    // const builder = this.conversationRepo.createQueryBuilder('Conversation').where(
    //   `EXISTS (
    //      SELECT 1 FROM jsonb_array_elements(Conversation.attendees) AS attendee
    //      WHERE attendee->>'userId' = :userId
    //    )`,
    //   { userId: user.id },
    // );

    const conversation = this.conversationModel.find({ attendees: { $elemMatch: { userId: user.id } } });

    return await new BuilderPaginationResponse<GetPagingConversationResponse>(conversation, pagination).execute();
  }
}
