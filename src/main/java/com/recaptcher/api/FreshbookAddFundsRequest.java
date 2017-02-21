package com.recaptcher.api;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class FreshbookAddFundsRequest {

    private String amount;
    private String email;
    private String name;
    private String country;

}
