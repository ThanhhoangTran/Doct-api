import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ strict: false })
@ObjectType({ isAbstract: true })
export class ChatMessage {
  @Field(_type => ID)
  _id: string;

  @Field(_type => String)
  @Prop()
  message: string;

  @Field(_type => ID, { nullable: true })
  @Prop()
  conversationId: string;

  @Field(_type => ID)
  @Prop()
  senderId: string;

  @Field(_type => ID, { nullable: true })
  @Prop()
  replyMessageId: string;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
