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

import static com.recaptcher.utils.JsonUtils.*;

/**
 * Created by rodion.shkrobot on 2/2/2017.
 */
@RestController
public class ApiKeyController {

    @Autowired
    private ApiService apiService;

    @RequestMapping(value = "/getApiKey", method = RequestMethod.GET, produces = "application/json")
    public String getApiKey() throws IOException {
        HttpSession session = SessionUtils.getSession();

        Customer customer = (Customer) session.getAttribute(SessionUtils.SessionAttributes.USER_ATTIBUTE.getAttribute());
        if (customer != null) {
            String apiKey = apiService.getApiKey(String.valueOf(customer.getId()));
            return addBasicUserInfo(success(), customer).put("apiKey", apiKey).toString();
        }

        return failure().toString();
    }

    @RequestMapping(value = "/regenerateApiKey", method = RequestMethod.GET, produces = "application/json")
    public String regenerateApiKey() throws IOException {
        HttpSession session = SessionUtils.getSession();

        Customer customer = (Customer) session.getAttribute(SessionUtils.SessionAttributes.USER_ATTIBUTE.getAttribute());
        if (customer != null) {
            String apiKey = apiService.regenerateApiKey(String.valueOf(customer.getId()));
            return addBasicUserInfo(success(), customer).put("apiKey", apiKey).toString();
        }

        return failure().toString();
    }
}
