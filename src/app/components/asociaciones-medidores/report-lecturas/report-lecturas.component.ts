import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { MedidorAsociado, PlanillaMesLectura } from 'src/app/interfaces';
import { AsociacionesService } from '../asociaciones.service';
import { UIChart } from 'primeng/chart';
import { Dropdown } from 'primeng/dropdown';

@Component({
  selector: 'app-report-lecturas',
  templateUrl: './report-lecturas.component.html',
  styles: [],
})
export class ReportLecturasComponent {
  @Input()
  visible: boolean = false;
  visibleReportsModal: boolean = false;
  // visibleComprobanteModal: boolean = false;
  @Input()
  medidor!: MedidorAsociado;
  planillas: any[] = [];
  lecturas: PlanillaMesLectura[] = [];
  titleHeader= 'INFORME DE CONSUMO DE AGUA DEL MEDIDOR DE AGUA PARA LA GESTIÓN';
  titleLecturas = 'Debe seleccionar una año de gestion';
  @Output()
  closePlanilla: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private readonly asociacionService: AsociacionesService) {}
  mostrarReportesLine() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    // console.log('BARCHART',this.chart);
    this.chart.forEach(e=>{
      this.visibleReportsModal=false;
      // console.log(e);
      e.reinit();
    })
    this.data = {
      labels: this.lecturas.map(lectura=>lectura.PlanillaMesLecturar),
      datasets: [
        {
          label: `${this.lecturas[0].medicion}. consumidos del mes`,
          data: this.lecturas.map(lectura=>lectura.consumoTotal),
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          tension: 0.4,
        },
        // {
        //   label: 'Second Dataset',
        //   data: [28, 48, 40, 19, 86, 27, 90],
        //   fill: false,
          
        //   borderColor: documentStyle.getPropertyValue('--pink-500'),
        //   tension: 0.4,
        // },
      ],
    };
    this.options= {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
          title: {display: true, text: `${this.titleHeader} ${this.gestionSelected}`, }, // <-- title!
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
    this.visibleReportsModal=true;
  }
  @ViewChildren("barChart") chart!:  QueryList<UIChart>;
  saveImage(chart:UIChart ) {
    
    // const canvas=chart.getCanvas();
    var a = document.createElement('a');
    a.href = chart.getBase64Image();
    a.download = `img-reportes-lecturas-type-${this.typeChart}`;
    a.click();
  } 
mostrarGestiones(){
    this.asociacionService.listarPlanillasMedidor(this.medidor.id!).subscribe(res=>{
      // console.log(res);
      this.planillas = res.map(res=>{
        return{
          label: res.gestion.toString(),
          value:res.id
        }
      })
    });
  }
  gestionSelected:any;
  @ViewChildren("dropwdownReportType") dropwdownReportType!: QueryList<Dropdown>;
  mostrarLecturas(event:any){
    console.log(event);
    console.log(this.dropwdownReportType);
    this.gestionSelected=event.label;
    this.asociacionService.listarLecturasPlanilla(event.value).subscribe(res=>{
      // console.log(res);
      this.lecturas=res;
      if(res.length===0){
        this.titleLecturas='NO HAY LECTURAS DE ESA GESTION'
      }else{
        this.dropDownLabel=true;
        // this.mostrarReportesLine()
        
    this.dropwdownReportType.first.clear(new Event('change',{}));
        this.visibleReportsModal=false;
      }
    })
  }
  data: any;

  options:any ;
  typeChart=[
    {label:'LINEAL',value:'line'},
    {label:'BARRAS',value:'bar'},
  ]
  ngOnInit() {
    this.mostrarGestiones();
  }

  get topLine(){
    return{
      id:'topLine',
    afterDatasetsDraw(chart:any,args:any,plugins:any){
      const {ctx,data}=chart;
      ctx.save();
      chart.getDatasetMeta(0).data.forEach((datapoint:any,index:any)=>{
        
        ctx.beginPath();
        ctx.strokeStyle= data.datasets[0].borderColor[index];
        ctx.lineWidth=2.5;
        const halfWidth = datapoint.width /2;
        ctx.moveTo(datapoint.x - halfWidth, datapoint.y-6);
        ctx.lineTo(datapoint.x + halfWidth, datapoint.y-6);
        ctx.stroke();
        
        //text
        ctx.font = 'bold 10px sans-serif';
        ctx.fillStyle = 'black';
        ctx.fillText(data.datasets[0].data[index] || 0,datapoint.x,datapoint.y -15);
      })
    }
  }
}
  changeTypeChart(event:any){
    console.log(event);
    this.chartType=event.value;
    if(this.chartType ==='bar') this.reportBarVertical();
    else if(this.chartType === 'line') this.mostrarReportesLine();
    
  }
  dropDownLabel:boolean=false;
  reportBarVertical(){
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    // console.log('BARCHART',this.chart);
    this.chart.forEach(e=>{
      this.visibleReportsModal=false;
      // console.log(e);
      e.reinit();
    })
    
        this.data = {
            labels:this.lecturas.map(lectura=>lectura.PlanillaMesLecturar),
            datasets: [
                {
                    backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    label: `${this.lecturas[0].medicion}. consumidos del mes`,
                    data: this.lecturas.map(lectura=>lectura.consumoTotal),
                    
                }
            ]
        };

        this.options =  {
          maintainAspectRatio: false,
          aspectRatio: 0.8,
          plugins: 
            {
              legend: {
                  labels: {
                      color: textColor
                  }
              },
              title: {display: true, text: `${this.titleHeader} ${this.gestionSelected}`}, // <-- title!
         }
        ,
          scales: {
              x: {
                  ticks: {
                      color: textColorSecondary,
                      font: {
                          weight: 500
                      }
                  },
                  grid: {
                      color: surfaceBorder,
                      drawBorder: false
                  }
              },
              y: {
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder,
                      drawBorder: false
                  }
              }

          }
      };
    
      this.visibleReportsModal=true;
  }
  chartType='line';
  downloadReport(chart:any){
    // myLineChart.toBase64Image();
    console.log(chart);
  }
}
