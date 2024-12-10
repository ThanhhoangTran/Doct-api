import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ strict: false })
export class UserConnection {
  @Prop()
  userId: string;

  @Prop()
  connectionId: string;

  @Prop()
  sourceIp: string;

  @Prop()
  lastActive: Date;
}

export const UserConnectionSchema = SchemaFactory.createForClass(UserConnection);
