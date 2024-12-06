import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class DateArrayValidators {
    /**
     * Validates an array of dates within a single FormControl
     * @param minDates Minimum number of dates required (default: 2)
     * @param maxDates Maximum number of dates allowed (default: 10)
     * @returns ValidatorFn
     */
    static dateArrayValidator(
      minDates: number = 2, 
      maxDates: number = 2
    ): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        // Check if value exists and is an array
        if (!control.value || !Array.isArray(control.value)) {
          return { 
            'invalidDateArray': { 
              expected: 'array of dates', 
              actual: typeof control.value 
            } 
          };
        }
  
        const dates = control.value;
  
        // Check minimum number of dates
        if (dates.length < minDates) {
          return { 
            'minDatesRequired': { 
              required: minDates, 
              actual: dates.length 
            } 
          };
        }
  
        // Check maximum number of dates
        if (dates.length > maxDates) {
          return { 
            'maxDatesExceeded': { 
              max: maxDates, 
              actual: dates.length 
            } 
          };
        }
  
        // Validate that all elements are valid dates
        const invalidDates = dates.some(date => {
          // Check if it's a Date object or can be converted to a valid date
          return !(date instanceof Date) && isNaN(new Date(date).getTime());
        });
  
        if (invalidDates) {
          return { 
            'invalidDateFormat': { 
              message: 'Some dates are not valid' 
            } 
          };
        }
  
        return null;
      };
    }
  }