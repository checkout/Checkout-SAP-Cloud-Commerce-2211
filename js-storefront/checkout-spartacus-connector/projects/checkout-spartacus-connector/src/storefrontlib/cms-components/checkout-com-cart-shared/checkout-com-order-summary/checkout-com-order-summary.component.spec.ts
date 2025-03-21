import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Cart, CartVoucherFacade, Voucher } from '@spartacus/cart/base/root';
import { I18nTestingModule } from '@spartacus/core';
import { OutletContextData, PromotionsModule } from '@spartacus/storefront';
import { of } from 'rxjs';
import { CheckoutComOrderSummaryComponent } from './checkout-com-order-summary.component';

@Component({
  selector: 'cx-applied-coupons',
  template: '',
})
class MockAppliedCouponsComponent {
  @Input()
  vouchers: Voucher[];
  @Input()
  cartIsLoading = false;
  @Input()
  isReadOnly = false;
}

const mockCart: Cart = {
  code: 'test cart',
};

const context$ = of(mockCart);

describe('CheckoutComOrderSummaryComponent', () => {
  let component: CheckoutComOrderSummaryComponent;
  let fixture: ComponentFixture<CheckoutComOrderSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, PromotionsModule, I18nTestingModule],
      declarations: [CheckoutComOrderSummaryComponent, MockAppliedCouponsComponent],
      providers: [
        { provide: CartVoucherFacade, useValue: {} },
        {
          provide: OutletContextData,
          useValue: { context$ },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutComOrderSummaryComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should get cart from outlet context data', () => {
    component.ngOnInit();
    expect(component.cart).toEqual(mockCart);
  });
});
