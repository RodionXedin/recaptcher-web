package com.recaptcher.controller;

import com.recaptcher.Service.LogonService;
import com.recaptcher.entity.Customer;
import com.recaptcher.repository.CustomerRepository;
import com.recaptcher.utils.SessionUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.Map;

import static com.recaptcher.utils.JsonUtils.*;

/**
 * Created by rodion on 29.01.2017.
 */
@RestController
public class LoginController {

    @Autowired
    private LogonService logonService;

    @Autowired
    private CustomerRepository customerRepository;

    @RequestMapping(value = "/login", method = RequestMethod.GET, produces = "application/json")
    public String checkLogin() {
        HttpSession session = SessionUtils.getSession();

        Customer customer = (Customer) session.getAttribute(SessionUtils.SessionAttributes.USER_ATTIBUTE.getAttribute());
        if (customer != null) {
            return addBasicUserInfo(success(), customer).toString();
        }


        return failure().toString();
    }


    @RequestMapping(value = "/login", method = RequestMethod.POST, produces = "application/json")
    public String login(@RequestParam(value = "name", required = false) String name,
                        @RequestParam(value = "password", required = false) String password, @RequestParam Map<String, String> params) {

        Customer customer = customerRepository.findByLastName(name).get(0);

        HttpSession session = SessionUtils.getSession();

        boolean newUser = false;
        if (customer != null) {
            if (customer.getPassword().equals(password)) {
                session.setAttribute(SessionUtils.SessionAttributes.USER_ATTIBUTE.getAttribute(), customer);
            } else {
                return addError(failure(), "wrong password").toString();
            }
        }

        return addBasicUserInfo(success(), customer, newUser).toString();
    }


}
