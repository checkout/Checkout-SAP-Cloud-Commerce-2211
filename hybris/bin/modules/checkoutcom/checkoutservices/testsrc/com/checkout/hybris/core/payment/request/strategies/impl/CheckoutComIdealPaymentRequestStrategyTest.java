package com.checkout.hybris.core.payment.request.strategies.impl;

import com.checkout.hybris.core.model.CheckoutComIdealPaymentInfoModel;
import com.checkout.sdk.payments.AlternativePaymentSource;
import com.checkout.sdk.payments.PaymentRequest;
import com.checkout.sdk.payments.RequestSource;
import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.core.model.order.CartModel;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import static com.checkout.hybris.core.payment.enums.CheckoutComPaymentType.IDEAL;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

@UnitTest
@RunWith(MockitoJUnitRunner.class)
public class CheckoutComIdealPaymentRequestStrategyTest {

    private static final String PAYMENT_REFERENCE = "payment-refer-.,;[enc[]e";
    private static final String DESCRIPTION_KEY = "description";
    private static final String CURRENCY_ISO_CODE = "BRL";
    private static final Long CHECKOUT_COM_TOTAL_PRICE = 10000L;

    @InjectMocks
    private CheckoutComIdealPaymentRequestStrategy testObj;

    @Mock
    private CartModel cartMock;
    @Mock
    private CheckoutComIdealPaymentInfoModel idealPaymentInfoMock;

    @Before
    public void setUp() {
        when(cartMock.getPaymentInfo()).thenReturn(idealPaymentInfoMock);
        when(idealPaymentInfoMock.getType()).thenReturn(IDEAL.name());
        when(cartMock.getCheckoutComPaymentReference()).thenReturn(PAYMENT_REFERENCE);
    }

    @Test
    public void getRequestSourcePaymentRequest_WhenIdealPayment_ShouldCreateAlternativePaymentRequestWithTypeAndAdditionalInfo() {
        final PaymentRequest<RequestSource> result = testObj.getRequestSourcePaymentRequest(cartMock, CURRENCY_ISO_CODE, CHECKOUT_COM_TOTAL_PRICE);

        assertEquals(IDEAL.name().toLowerCase(), result.getSource().getType());
        assertEquals(PAYMENT_REFERENCE, ((AlternativePaymentSource) result.getSource()).get(DESCRIPTION_KEY));
    }

    @Test(expected = IllegalArgumentException.class)
    public void getRequestSourcePaymentRequest_WhenPaymentReferenceMoreThan35CharWhenFormatted_shouldThrowException() {
        when(cartMock.getCheckoutComPaymentReference()).thenReturn("");

        testObj.getRequestSourcePaymentRequest(cartMock, CURRENCY_ISO_CODE, CHECKOUT_COM_TOTAL_PRICE);
    }

    @Test
    public void getStrategyKey_WhenIdeal_ShouldReturnIdealType() {
        assertEquals(IDEAL, testObj.getStrategyKey());
    }
}
