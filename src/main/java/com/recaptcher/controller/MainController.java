package com.recaptcher.controller;

import com.recaptcher.entity.Customer;
import com.recaptcher.repository.CustomerRepository;
import com.recaptcher.utils.SessionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpSession;
import javax.websocket.Session;

import static com.recaptcher.utils.JsonUtils.addBasicUserInfo;
import static com.recaptcher.utils.JsonUtils.failure;
import static com.recaptcher.utils.JsonUtils.success;

/**
 * Created by rodio on 08.12.2015.
 */
@Controller
public class MainController {


    @Autowired
    private CustomerRepository customerRepository;

    @RequestMapping(value = "/")
    public String serveMain(Model model) {
        return "landing";
    }

    @RequestMapping(value = "/register", method = RequestMethod.GET)
    public String register() {
        return "registration";
    }



    @RequestMapping(value = "/dashboard")
    public String dashboard() {
        return "main";
    }
}
