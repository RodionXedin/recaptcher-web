package com.recaptcher.controller;

import com.recaptcher.Service.ApiService;
import com.recaptcher.Service.LogonService;
import com.recaptcher.entity.Customer;
import com.recaptcher.repository.CustomerRepository;
import com.recaptcher.utils.SessionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.io.IOException;
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

    @Autowired
    private ApiService apiService;


    @RequestMapping(value = "/login", method = RequestMethod.GET, produces = "application/json")
    public String checkLogin() {
        HttpSession session = SessionUtils.getSession();

        Customer customer = (Customer) session.getAttribute(SessionUtils.SessionAttributes.USER_ATTIBUTE.getAttribute());
        if (customer != null) {
            return addBasicUserInfo(success(), customer).toString();
        }


        return failure().toString();
    }


    @RequestMapping(value = "/register_customer", method = RequestMethod.POST, produces = "application/json")
    public String registerCustomer(String email, String password, String confirmation) throws IOException {
        HttpSession session = SessionUtils.getSession();

        if (StringUtils.isEmpty(email) || StringUtils.isEmpty(password) || StringUtils.isEmpty(confirmation)) {
            return failure().put("message", "Please fill in all fields").toString();
        }

        if (!password.equals(confirmation)) {
            return failure().put("message", "Passwords should match").toString();
        }

        if(customerRepository.findByEmail(email) != null){
            return failure().put("message", "Sorry, but this email is already taken :(").toString();
        }

        Customer customer = new Customer(email, password);
        customerRepository.save(customer);

        apiService.createUser(customerRepository.findByEmail(customer.getEmail()).getId().toString());
        SessionUtils.getSession().setAttribute(SessionUtils.SessionAttributes.USER_ATTIBUTE.getAttribute(), customer);
        return addBasicUserInfo(success(), customer).toString();
    }


    @RequestMapping(value = "/login", method = RequestMethod.POST, produces = "application/json")
    public String login(@RequestParam(value = "email", required = false) String email,
                        @RequestParam(value = "password", required = false) String password, @RequestParam Map<String, String> params) {

        Customer customer = customerRepository.findByEmail(email);

        HttpSession session = SessionUtils.getSession();

        if (customer != null) {
            if (customer.getPassword().equals(password)) {
                session.setAttribute(SessionUtils.SessionAttributes.USER_ATTIBUTE.getAttribute(), customer);
            } else {
                return addError(failure(), "wrong password").toString();
            }
        }

        return addBasicUserInfo(success(), customer).toString();
    }


}
