package com.checkout.hybris.facades.payment.ach.magicvalues.impl;

import com.checkout.hybris.facades.beans.AchBankInfoDetailsData;
import de.hybris.bootstrap.annotations.UnitTest;
import org.assertj.core.api.Assertions;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.junit.MockitoJUnitRunner;

import static org.fest.assertions.Assertions.assertThat;

@UnitTest
@RunWith(MockitoJUnitRunner.class)
public class SuccessfulPaymentCaptureMagicPostalValueAchCheckoutStrategyTest {

    private static final String MAGIC_VALUE = "PCS00001";

    @InjectMocks
    private SuccessfulPaymentCaptureMagicPostalValueAchCheckoutStrategy testObj;


    @Test
    public void createAchBankInfoDetailsData_shouldReturnAnObjectWithTheAttributesFieldWithTheMagicValues() {
        final AchBankInfoDetailsData achBankInfoDetailsData = testObj.createAchBankInfoDetailsData();

        Assertions.assertThat(achBankInfoDetailsData).hasFieldOrPropertyWithValue("accountHolderName", "Mike Hammer")
            .hasFieldOrPropertyWithValue("accountType", "CHECKING")
            .hasFieldOrPropertyWithValue("accountNumber", "4099999992")
            .hasFieldOrPropertyWithValue("bankRouting", "011075150")
            .hasFieldOrPropertyWithValue("mask", "*****9992")
            .hasFieldOrPropertyWithValue("institutionName", "Bank of america");
    }

    @Test
    public void isApplicable_shouldReturnTrueForPostalCodePCS00001() {
        final boolean result = testObj.isApplicable(MAGIC_VALUE);

        assertThat(result).isTrue();
    }
}
