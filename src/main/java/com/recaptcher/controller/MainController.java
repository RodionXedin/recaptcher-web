package com.recaptcher.controller;

import com.recaptcher.Service.ApiService;
import com.recaptcher.repository.CustomerRepository;
import com.recaptcher.utils.SessionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpSession;

import static com.recaptcher.utils.JsonUtils.addBasicUserInfo;

/**
 * Created by rodio on 08.12.2015.
 */
@Controller
public class MainController {


    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ApiService apiService;

    @RequestMapping(value = "/")
    public String serveMain(Model model) {
        return "landing";
    }


    @RequestMapping(value = "/logout", method = RequestMethod.GET, produces = "application/json")
    public String logout() {
        HttpSession session = SessionUtils.getSession();
        session.removeAttribute(SessionUtils.SessionAttributes.USER_ATTIBUTE.getAttribute());
        return serveMain(null)  ;
    }

    @RequestMapping(value = "/register", method = RequestMethod.GET)
    public String register() {
        return "registration";
    }

    @RequestMapping(value = "/signin", method = RequestMethod.GET)
    public String signin() {
        return "signin";
    }


    @RequestMapping(value = "/dashboard")
    public String dashboard() {
        return "dashboard";
    }

    @RequestMapping(value = "/settings")
    public String settings() {
        return "settings";
    }
}
