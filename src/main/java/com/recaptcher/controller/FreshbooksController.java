package com.recaptcher.controller;

import com.recaptcher.api.FreshbookAddFundsRequest;
import com.recaptcher.entity.Customer;
import com.recaptcher.utils.SessionUtils;
import org.simplejavamail.email.Email;
import org.simplejavamail.mailer.Mailer;
import org.simplejavamail.mailer.config.TransportStrategy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.mail.Message;
import javax.servlet.http.HttpSession;

import static com.recaptcher.utils.JsonUtils.failure;

@RestController
public class FreshbooksController {

    @PostMapping
    @RequestMapping("/freshbooks/addFunds")
    public ResponseEntity<String> addFunds(@RequestBody FreshbookAddFundsRequest addFundsRequest) {

        HttpSession session = SessionUtils.getSession();
        Customer customer = (Customer) session.getAttribute(SessionUtils.SessionAttributes.USER_ATTIBUTE.getAttribute());

        if (customer == null) {
            return new ResponseEntity<>(failure().toString(), HttpStatus.UNAUTHORIZED);
        }

        final Email email = new Email();
        email.setFromAddress("Recaptcher", "rodion.shkrobot@gmail.com");
        email.addRecipient("Rodion", "rodion.shkrobot@gmail.com", Message.RecipientType.TO);
        email.addRecipient("Sergey", "sergey.parahin@gmail.com", Message.RecipientType.TO);
        // not verified: email.addRecipient("Eugene", "escenas@gmail.com", Message.RecipientType.TO);
        email.setTextHTML(String.format("<b>User requested funds add. See info below : " +
                "<br/> Account Id : %s " +
                "<br/>Amount: %s </b>" +
                "<br/>Email: %s </b>" +
                "<br/>Country: %s </b>" +
                "<br/>Name / Company Name: %s </b>",
                customer.getId(), addFundsRequest.getAmount(), addFundsRequest.getEmail(),
                addFundsRequest.getCountry(), addFundsRequest.getName()
        ));

        email.setSubject("[Freshbooks] User requested funds add");

        new Mailer("email-smtp.us-east-1.amazonaws.com", 587, "AKIAJDMJYRL3KBBRQM2Q", "AuEmPTpJpEx9zo0mApU+LPvgMkGhLab7jgJ7U9xRmZUT", TransportStrategy.SMTP_TLS).sendMail(email);


        return new ResponseEntity<String>(HttpStatus.OK);
    }

}
