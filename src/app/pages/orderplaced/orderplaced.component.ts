import { Component, ElementRef, ViewChild } from '@angular/core';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/service/testapi.service';
@Component({
  selector: 'app-orderplaced',
  templateUrl: './orderplaced.component.html',
  styleUrls: ['./orderplaced.component.scss'],
})
export class OrderplacedComponent {
  @ViewChild('receipt', { static: false }) receipt!: ElementRef;
  orderID: any;
  allReceiptData:any

  constructor(private route: ActivatedRoute, private apiService:ApiService) {}

  ngOnInit() {
    window.scroll(0, 0);
    this.route.paramMap.subscribe((params) => {
      this.orderID = params.get('order');
    });
    this.getSingleOrder();
  }

  getSingleOrder() {
    this.apiService.getSingleOrder(this.orderID).subscribe(
      (data) => {
        this.allReceiptData = data;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  downloadPDF() {
    const pdf = new jspdf('p','mm','a4');

    const element = this.receipt.nativeElement;

    html2canvas(element,{useCORS:true}).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth)/canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight); // Adjust the dimensions as needed

      pdf.save(`${this.allReceiptData?.id}_receipt.pdf`);
    });
  }
}
