import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorArrayService {

  static hashTagsWithMaxSize(minSize:number,maxSize: number): ValidatorFn {
  
    // returns a function which takes an Anstract control as an input
    return (control: AbstractControl): { [key: string]: any } | null => {
      if(control.value.length>0){
        if(control.value.length<3){
          control.setErrors({minSize})
          return {minSize}
        } 
        else if(control.value.length>5) 
          {
            control.setErrors({maxSize})
            return {maxSize}
          }
      }
      return null;
    };
  }
}
