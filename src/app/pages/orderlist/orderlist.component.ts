import { Component, ViewChild } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { Table } from 'primeng/table';
import { OrderService } from 'src/service/order.service';

@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.component.html',
  styleUrls: ['./orderlist.component.scss'],
})
export class OrderlistComponent {
  allOrder: any;
  loading: boolean = true;
  searchText: string = '';
  visible: boolean = false;
  singleOrder: any;

  @ViewChild('dt1') dt1: any;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.order$.subscribe((data) => {
      this.allOrder = data;
    });
  }

  options: AnimationOptions = {
    path: 'https://lottie.host/b5ff1ec8-14d4-48b5-9deb-7534a121f115/u80JeyeIyQ.json',
  };

  clear(table: Table) {
    table.clear();
  }

  showDialog(item:any) {
    this.visible = true;
    this.singleOrder = item;
    console.log(this.singleOrder);
  }

  getSeverity(status: string) {
    switch (status) {
      case 'Success':
        return 'success';
      case 'Failed':
        return 'danger';
    }
    return '';
  }
}
