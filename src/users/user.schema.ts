import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, minlength: 3, maxlength: 50 })
  name: string;

  @Prop({ required: true, unique: true, minlength: 5, maxlength: 100, match: /^\S+@\S+\.\S+$/ })
  email: string;

  @Prop({ required: true, minlength: 8, maxlength: 100, match: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/ })
  password: string;

  @Prop({ required: true, type: Object })
  verification: {
    question: string;
    answer: string;
  };

  @Prop({ required: true, enum: ['active', 'verified', 'pending-reset', 'blocked'], default: 'active' })
  status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete (ret as any)?.password;
    delete (ret as any)?.verification;
    delete (ret as any)?.createdAt;
    delete (ret as any)?.updatedAt;
    delete (ret as any)?.__v;
    return ret;
  },
});

UserSchema.pre('save', async function (this: UserDocument) {
  if (this.isModified('password') && this.password && !this.password.startsWith('$2a$')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (this.isModified('verification') && this.verification && this.verification.answer && !this.verification.answer.startsWith('$2a$')) {
    this.verification.answer = await bcrypt.hash(this.verification.answer, 10);
  }
});
