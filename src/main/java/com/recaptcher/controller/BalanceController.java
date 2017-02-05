package com.recaptcher.controller;

import com.recaptcher.Service.ApiService;
import com.recaptcher.entity.Customer;
import com.recaptcher.utils.SessionUtils;
import org.simplejavamail.email.Email;
import org.simplejavamail.mailer.Mailer;
import org.simplejavamail.mailer.config.TransportStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.mail.Message;
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

    @RequestMapping(value = "/add_funds", method = RequestMethod.POST, produces = "application/json")
    public String addFunds(String firstName, String lastName, String fundsAmount) throws IOException {
        HttpSession session = SessionUtils.getSession();

        Customer customer = (Customer) session.getAttribute(SessionUtils.SessionAttributes.USER_ATTIBUTE.getAttribute());
        if (customer != null) {

        final Email email = new Email();
            email.setFromAddress("Recaptcher", "rodion.shkrobot@gmail.com");
            email.addRecipient("Rodion", "rodion.shkrobot@gmail.com", Message.RecipientType.TO);
        email.addRecipient("Sergey", "sergey.parahin@gmail.com", Message.RecipientType.TO);
//        email.setText("User requested funds add. See info below");
        email.setTextHTML(String.format("<b>User requested funds add. See info below : " +
                "<br/> First Name : %s" +
                "<br/> Last Name : %s " +
                "<br/> Email : %s " +
                "<br/> Id : %s " +
                "<br/>Amount: %s </b>", firstName,lastName,customer.getEmail(),customer.getId(),fundsAmount));
        email.setSubject("User requested funds add");

//        new Mailer("smtp.gmail.com", 25, "rodion.shkrobot", "Ghblevfnm1!", TransportStrategy.SMTP_TLS).sendMail(email);
//        new Mailer("smtp.gmail.com", 587, "rodion.shkrobot", "Ghblevfnm1!", TransportStrategy.SMTP_TLS).sendMail(email);
            new Mailer("email-smtp.us-east-1.amazonaws.com", 587, "AKIAJDMJYRL3KBBRQM2Q", "AuEmPTpJpEx9zo0mApU+LPvgMkGhLab7jgJ7U9xRmZUT", TransportStrategy.SMTP_TLS).sendMail(email);

            BigDecimal userBalance = apiService.getUserBalance(String.valueOf(customer.getId()));
            return addBasicUserInfo(success(), customer).put("balance",userBalance.doubleValue()).toString();
        }
        return failure().toString();
    }

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
