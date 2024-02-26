import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { CommonService } from 'src/service/common.service';
import { MessageService } from 'primeng/api';
import { AddressService } from 'src/service/address.service';
import { allState } from 'src/utils/coupons';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent {
  isStateOpen: boolean = false;
  isDistrictOpen: boolean = false;
  isStateTouched: boolean = false;
  isDistrictTouched: boolean = false;
  allStates: any;
  selectState: any;
  stateValue: any;
  selectDistrict: any;
  enableCheckout: boolean = false;
  isEditMode: boolean = false;
  form: FormGroup;
  initialFormData: any;
  allAddress: any;
  allOrder: any;
  selectedAddress: any;
  editId: any;
  isFormChanged: boolean = false;

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private addressService: AddressService,
    // private orderService: OrderService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('^\\d{10}$')]],
      pincode: ['', [Validators.required, Validators.pattern('^\\d{6}$')]],
      locality: ['', Validators.required],
      address: ['', Validators.required],
      state: '',
      district: '',
      landmark: '',
      alternatePhone: ['', Validators.pattern('^\\d{10}$')],
      addressType: 'home',
    });

    this.initialFormData = this.form.value;
  }
  ngOnInit() {
    this.allStates = allState.states;
    this.addressService.address$.subscribe((data) => {
      this.allAddress = data;
      for (let item of this.allAddress) {
        if (item.isSelected) {
          this.selectedAddress = item;
          this.enableCheckout = true;
        }
      }
    });
    this.selectDistrict = '';
    this.stateValue = '';

    this.form.valueChanges.subscribe((formData) => {
      this.isFormChanged = true;
      localStorage.setItem('formData', JSON.stringify(formData));
    });
  }
  submitForm() {
    this.form.value.state = this.stateValue;
    this.form.value.district = this.selectDistrict;
    let completeAddress = {
      ...this.form.value,
      id: this.editId,
    };
    this.isFormChanged && this.addAddressFunc(completeAddress);
  }

  addAddressFunc(item: any) {
    if (this.isEditMode) {
      this.editAddresFunc(this.editId, item);
    } else {
      item.id = Math.random().toString(16).slice(2);
      item.isSelected = false;
      this.addressService.addAdress(item).then((result) => {
        if (result) {
          this.isFormChanged = false;
          this.clearForm();
          this.messageService.clear();
          this.messageService.add({
            key: 'tc',
            severity: 'success',
            summary: 'Added',
            detail: 'Address saved Successfully',
          });
        } else {
          this.messageService.clear();
          this.messageService.add({
            key: 'tc',
            severity: 'error',
            detail: 'Couldnt add to Wishlist',
          });
        }
      });
    }
  }

  deleteAddressFunc(id: any) {
    this.addressService.deleteAddress(id).then((result) => {
      if (result) {
        this.enableCheckout = false;
        this.messageService.clear();
        this.messageService.add({
          key: 'tc',
          severity: 'success',
          summary: 'Added',
          detail: 'Address deleted Successfully',
        });
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 'tc',
          severity: 'error',
          detail: 'Couldnt delete address',
        });
      }
    });
  }

  editAddresFunc(id: string, item: any) {
    this.addressService.updateAddress(id, item).then((result) => {
      if (result) {
        this.enableCheckout = false;
        this.isStateTouched = false;
        this.isDistrictTouched = false;
        this.isEditMode = false;
        this.selectDistrict = '';
        this.stateValue = '';
        this.form.reset(this.initialFormData);
        this.clearForm();
        this.messageService.clear();
        this.messageService.add({
          key: 'tc',
          severity: 'success',
          summary: 'Added',
          detail: 'Address edited Successfully',
        });
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 'tc',
          severity: 'error',
          detail: 'Couldnt edit address',
        });
      }
    });
  }

  clearForm() {
    this.isStateTouched = false;
    this.isDistrictTouched = false;
    this.isEditMode = false;
    this.selectDistrict = '';
    this.stateValue = '';
    this.form.reset(this.initialFormData);
  }
  handleFunc(type: string, item?: any, event?: Event) {
    if (type === 'state') {
      this.isStateTouched = true;
      this.isStateOpen = !this.isStateOpen;
    } else if (type === 'district') {
      this.isDistrictTouched = true;
      item && (this.isDistrictOpen = !this.isDistrictOpen);
    } else if (type === 'stateSelect') {
      this.selectState = item;
      this.selectDistrict = '';
      this.stateValue = this.selectState.state;
    } else if (type === 'districtSelect') {
      this.selectDistrict = item;
    } else if (type === 'cancel') {
      this.clearForm();
    } else if (type === 'selectAddress') {
      for (const address of this.allAddress) {
        address.isSelected = address === item;
        this.addressService
          .updateAddress(address.id, address)
          .then((result) => {
            if (result) {
              console.log('updated address');
            } else {
              console.log('Couldnt update address');
            }
          });
      }
      this.selectedAddress = item;
      this.enableCheckout = true;
    } else if (type === 'editAddress') {
      event?.stopPropagation();
      this.isEditMode = true;
      let { state, district, id, ...rest } = item;
      this.stateValue = state;
      this.selectDistrict = district;
      this.editId = id;
      this.form.setValue({
        state: state,
        district: district,
        ...rest,
      });
    } else if (type === 'deleteAddress') {
      event?.stopPropagation();
      this.deleteAddressFunc(item.id);
    }
  }
}
