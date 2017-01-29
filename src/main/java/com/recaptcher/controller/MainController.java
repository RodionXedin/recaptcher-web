package com.recaptcher.controller;

import com.recaptcher.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by rodio on 08.12.2015.
 */
@Controller
public class MainController {


    @Autowired
    private CustomerRepository customerRepository;

    @RequestMapping(value = "/")
    public String serveMain(Model model) {
        return "main";
    }

}
