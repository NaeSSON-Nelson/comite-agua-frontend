import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private primeConfig:PrimeNGConfig){}
  ngOnInit(): void {
    this.primeConfig.ripple=true;
  }
}
