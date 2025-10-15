import { IInputValidator, IUseCase } from '../interface';

export abstract class UseCaseAbstraction<Input, Output = void, IValidatedResult = void> implements IUseCase<Input, Output> {
  protected _inputValidator: IInputValidator<Input, IValidatedResult>;

  async execute(input: Input): Promise<Output> {
    let validatedResult: IValidatedResult | undefined;

    if (this._inputValidator) {
      validatedResult = (await this._inputValidator.validate(input)) as IValidatedResult;
    }
    return await this.executeLogic(input, validatedResult);
  }

  protected abstract executeLogic(input: Input, _validatedResult: IValidatedResult | undefined): Promise<Output>;
}
