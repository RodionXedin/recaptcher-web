package com.recaptcher.controller;

import com.recaptcher.Service.ApiService;
import com.recaptcher.entity.Customer;
import com.recaptcher.utils.SessionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;

import java.io.IOException;
import java.math.BigDecimal;

import static com.recaptcher.utils.JsonUtils.addBasicUserInfo;
import static com.recaptcher.utils.JsonUtils.failure;
import static com.recaptcher.utils.JsonUtils.success;

/**
 * Created by rodion.shkrobot on 2/2/2017.
 */
@RestController
public class BalanceController {

    @Autowired
    private ApiService apiService;

    @RequestMapping(value = "/getBalance", method = RequestMethod.GET, produces = "application/json")
    public String checkLogin() throws IOException {
        HttpSession session = SessionUtils.getSession();

        Customer customer = (Customer) session.getAttribute(SessionUtils.SessionAttributes.USER_ATTIBUTE.getAttribute());
        if (customer != null) {
            BigDecimal userBalance = apiService.getUserBalance(String.valueOf(customer.getId()));
            return addBasicUserInfo(success(), customer).put("balance",userBalance.doubleValue()).toString();
        }

        return failure().toString();
    }

}
