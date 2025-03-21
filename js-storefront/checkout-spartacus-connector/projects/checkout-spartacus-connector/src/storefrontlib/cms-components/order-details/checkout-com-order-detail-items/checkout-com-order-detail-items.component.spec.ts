import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { CheckoutComOrderDetailItemsComponent } from '@checkout-components/order-details/checkout-com-order-detail-items/checkout-com-order-detail-items.component';
import { CmsOrderDetailItemsComponent, I18nTestingModule, } from '@spartacus/core';
import { OrderConsignedEntriesComponent, OrderDetailsService } from '@spartacus/order/components';
import { Consignment, Order, ReplenishmentOrder } from '@spartacus/order/root';
import { CardModule, CmsComponentData, OutletModule, PromotionsModule, } from '@spartacus/storefront';
import { Observable, of } from 'rxjs';

const mockProduct = { product: { code: 'test' } };

const mockOrder: Order = {
  code: '1',
  statusDisplay: 'Shipped',
  deliveryAddress: {
    firstName: 'John',
    lastName: 'Smith',
    line1: 'Buckingham Street 5',
    line2: '1A',
    phone: '(+11) 111 111 111',
    postalCode: 'MA8902',
    town: 'London',
    country: {
      isocode: 'UK',
    },
  },
  deliveryMode: {
    name: 'Standard order-detail-shipping',
    description: '3-5 days',
  },
  paymentInfo: {
    accountHolderName: 'John Smith',
    cardNumber: '************6206',
    expiryMonth: '12',
    expiryYear: '2026',
    cardType: {
      name: 'Visa',
    },
    billingAddress: {
      firstName: 'John',
      lastName: 'Smith',
      line1: 'Buckingham Street 5',
      line2: '1A',
      phone: '(+11) 111 111 111',
      postalCode: 'MA8902',
      town: 'London',
      country: {
        isocode: 'UK',
      },
    },
  },
  created: new Date('2019-02-11T13:02:58+0000'),
  consignments: [
    {
      code: 'a00000341',
      status: 'READY',
      statusDate: new Date('2019-02-11T13:05:12+0000'),
      entries: [{
        orderEntry: {},
        quantity: 1,
        shippedQuantity: 1
      }],
    },
    {
      code: 'a00000343',
      status: 'DELIVERY_COMPLETED',
      statusDate: new Date('2019-02-11T13:05:12+0000'),
      entries: [{
        orderEntry: mockProduct,
        quantity: 4,
        shippedQuantity: 4
      }],
    },
    {
      code: 'a00000348',
      status: 'PICKUP_COMPLETE',
      statusDate: new Date('2019-02-11T13:05:12+0000'),
      entries: [{
        orderEntry: {},
        quantity: 4,
        shippedQuantity: 4
      }],
      deliveryPointOfService: {},
    },
    {
      code: 'a00000342',
      status: 'CANCELLED',
      statusDate: new Date('2019-02-11T13:05:12+0000'),
      entries: [{
        orderEntry: {},
        quantity: 0,
        shippedQuantity: 0
      }],
    },
    {
      code: 'a00000349',
      status: 'OTHERS',
      statusDate: new Date('2019-02-11T13:05:12+0000'),
      entries: [{
        orderEntry: {},
        quantity: 1,
        shippedQuantity: 1
      }],
    },
  ],
  unconsignedEntries: [
    {
      orderCode: 'unconsigned-1',
      deliveryPointOfService: {},
    },
    {
      orderCode: 'unconsigned-2',
    },
  ],
};

const mockReplenishmentOrder: ReplenishmentOrder = {
  active: true,
  purchaseOrderNumber: 'test-po',
  replenishmentOrderCode: 'test-repl-order',
  entries: [{
    entryNumber: 0,
    product: { name: 'test-product' }
  }],
  appliedOrderPromotions: [
    {
      consumedEntries: [],
      description: 'test-promotion',
      promotion: {
        code: 'test_promotion',
        description: 'A test promotion',
        promotionType: 'Rule Based Promotion',
      },
    },
  ],
};

const mockData: CmsOrderDetailItemsComponent = {
  enableAddToCart: true,
  groupCartItems: true,
};

const MockCmsComponentData = <CmsComponentData<any>>{
  data$: of(mockData),
};

@Component({
  selector: 'cx-consignment-tracking',
  template: '',
})
class MockConsignmentTrackingComponent {
  @Input()
  consignment: Consignment;
  @Input()
  orderCode: string;
}

describe('CheckoutComOrderDetailItemsComponent', () => {
  let component: CheckoutComOrderDetailItemsComponent;
  let fixture: ComponentFixture<CheckoutComOrderDetailItemsComponent>;
  let mockOrderDetailsService: OrderDetailsService;
  let el: DebugElement;

  beforeEach(waitForAsync(() => {
    mockOrderDetailsService = <OrderDetailsService>{
      isOrderDetailsLoading(): Observable<boolean> {
        return of(false);
      },
      getOrderDetails() {
        return of(mockOrder);
      },
    };

    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [
        CardModule,
        I18nTestingModule,
        PromotionsModule,
        RouterTestingModule,
        OutletModule,
      ],
      providers: [
        {
          provide: OrderDetailsService,
          useValue: mockOrderDetailsService
        },
        {
          provide: CmsComponentData,
          useValue: MockCmsComponentData
        },
      ],
      declarations: [
        CheckoutComOrderDetailItemsComponent,
        MockConsignmentTrackingComponent,
        OrderConsignedEntriesComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutComOrderDetailItemsComponent);
    el = fixture.debugElement;

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize order ', () => {
    let order: Order;
    component.order$
      .subscribe((value) => {
        order = value;
      })
      .unsubscribe();
    expect(order).toEqual(mockOrder);
  });

  it('should get pickupConsignements', () => {
    component.order$.subscribe().unsubscribe();
    expect(component.pickupConsignments).toContain(mockOrder.consignments[2]);
  });

  it('should get grouped deliveryConsignments', () => {
    component.order$.subscribe().unsubscribe();

    expect(component.deliveryConsignments?.[0]).toEqual(
      mockOrder.consignments[0]
    );
    expect(component.deliveryConsignments?.[1]).toEqual(
      mockOrder.consignments[4]
    );
    expect(component.deliveryConsignments?.[2]).toEqual(
      mockOrder.consignments[1]
    );
    expect(component.deliveryConsignments?.[3]).toEqual(
      mockOrder.consignments[3]
    );
  });

  it('should get pickupUnconsignedEntries', () => {
    component.order$.subscribe().unsubscribe();
    expect(component.pickupUnconsignedEntries).toContain(
      mockOrder.unconsignedEntries[0]
    );
  });

  it('should get deliveryUnConsignedEntries', () => {
    component.order$.subscribe().unsubscribe();
    expect(component.deliveryUnConsignedEntries).toContain(
      mockOrder.unconsignedEntries[1]
    );
  });

  it('should order details item be rendered', () => {
    expect(el.query(By.css('.cx-list'))).toBeTruthy();
  });

  it('should show promotions on replenishment details', () => {
    spyOn(mockOrderDetailsService, 'getOrderDetails').and.returnValue(
      of(mockReplenishmentOrder as any)
    );
    let order: ReplenishmentOrder;
    mockOrderDetailsService
      .getOrderDetails()
      .subscribe((value: any) => (order = value))
      .unsubscribe();
    expect(order).toEqual(mockReplenishmentOrder);
    expect(el.query(By.css('.cx-promotions'))).toBeTruthy();
  });
});
