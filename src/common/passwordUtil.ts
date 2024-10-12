import * as bcryptjs from 'bcryptjs';
import { configuration } from '../config';

export class PasswordUtil {
  static async generateHash(password: string): Promise<string> {
    return bcryptjs.hash(password, Number(configuration.bcrypt.salt));
  }

  static async validateHashPassword(password: string, hash: string, errorMessageIfNotMatched?: string): Promise<boolean> {
    const validated = await bcryptjs.compare(password, hash);
    if (!validated && errorMessageIfNotMatched) {
      throw new Error(errorMessageIfNotMatched);
    }

    return validated;
  }
}
