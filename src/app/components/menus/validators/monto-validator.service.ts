// validators/amount.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Monedas } from 'src/app/interfaces/atributes.enum';

export function amountMatchValidator(expectedAmount: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const inputAmount = control.value;
    
    if (!inputAmount) {
      return null; // No validamos si está vacío (eso lo hace Validators.required)
    }
    
    return inputAmount === expectedAmount 
      ? null 
      : { amountMismatch: { expected: expectedAmount, actual: inputAmount } };
  };
}
export function MonedaMatchValidator(expected: Monedas): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const inputAmount = control.value;
    
    if (!inputAmount) {
      return null; // No validamos si está vacío (eso lo hace Validators.required)
    }
    
    return inputAmount === expected 
      ? null 
      : { amountMismatch: { expected: expected, actual: inputAmount } };
  };
}
