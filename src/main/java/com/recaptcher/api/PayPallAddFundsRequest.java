package com.recaptcher.api;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PayPallAddFundsRequest {

    private String amount;
    private String email;

}
