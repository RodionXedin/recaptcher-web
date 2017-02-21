package com.recaptcher.controller;

import com.google.common.base.Joiner;
import com.google.gson.Gson;
import com.recaptcher.Service.ApiService;
import com.recaptcher.entity.Customer;
import com.recaptcher.utils.SessionUtils;
import org.simplejavamail.email.Email;
import org.simplejavamail.mailer.Mailer;
import org.simplejavamail.mailer.config.TransportStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.mail.Message;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.regex.Pattern;

import static com.recaptcher.utils.JsonUtils.failure;
import static java.util.Base64.getDecoder;

@RestController
public class PayeerController {

    private static final Gson gson = new Gson();

    private static final List<String> WHITELISTED_PAYEER_IPS = Arrays.asList(
            "185.71.65.92", "185.71.65.189", "149.202.17.210"
    );

    private static final String SECRET_KEY = "YJZPSDSMuoclLJJl";

    @Autowired
    private ApiService apiService;

    @PostMapping
    @RequestMapping("/payeer/status")
    public ResponseEntity<String> handlePayment(HttpServletRequest request)
            throws IOException, NoSuchAlgorithmException {

        if (!WHITELISTED_PAYEER_IPS.contains(request.getRemoteAddr())) {
            System.out.println("rejected: " + request.getRemoteAddr());
            // TODO: doesn't work on production
            //throw new RuntimeException("IP Rejected");
        }

        String[] arr = new String[]{
                request.getParameter("m_operation_id"),
                request.getParameter("m_operation_ps"),
                request.getParameter("m_operation_date"),
                request.getParameter("m_operation_pay_date"),
                request.getParameter("m_shop"),
                request.getParameter("m_orderid"),
                request.getParameter("m_amount"),
                request.getParameter("m_curr"),
                request.getParameter("m_desc"),
                request.getParameter("m_status"),
                SECRET_KEY
        };

        String sign = signHash(Joiner.on(":").join(arr));

        if (request.getParameter("m_sign").equals(sign)
                && request.getParameter("m_status").equals("success")) {

            String[] description = decodeDescription(request.getParameter("m_desc")).split("\\|");
            String customerId = description[description.length - 1];

            if (!customerId.isEmpty()) {

                apiService.addUserBalance(customerId, new BigDecimal(request.getParameter("m_amount")));

                final Email email = new Email();
                email.setFromAddress("Recaptcher", "rodion.shkrobot@gmail.com");
                email.addRecipient("Rodion", "rodion.shkrobot@gmail.com", Message.RecipientType.TO);
                email.addRecipient("Sergey", "sergey.parahin@gmail.com", Message.RecipientType.TO);
                email.setTextHTML(String.format("<b>User requested funds add. See info below : " +
                        "<br/> Id : %s " +
                        "<br/>Amount: %s </b>", customerId, request.getParameter("m_amount")));
                email.setSubject("User requested funds add");

                new Mailer("email-smtp.us-east-1.amazonaws.com", 587, "AKIAJDMJYRL3KBBRQM2Q", "AuEmPTpJpEx9zo0mApU+LPvgMkGhLab7jgJ7U9xRmZUT", TransportStrategy.SMTP_TLS).sendMail(email);

                return new ResponseEntity<>(String.format("%s|success", request.getParameter("m_orderid")), HttpStatus.OK);
            } else {
                System.out.println("empty customer: " + customerId);
            }
        } else {
            System.out.println("bad sign");
        }

        // TODO: store transactions

        return new ResponseEntity<>(String.format("%s|error", request.getParameter("m_orderid")), HttpStatus.OK);
    }

    @GetMapping
    @RequestMapping("/payeer/payment-data")
    public ResponseEntity<String> getPaymentData(@RequestParam("amount") Integer amount, @RequestParam("curr") String currency)
            throws UnsupportedEncodingException, NoSuchAlgorithmException {

        HttpSession session = SessionUtils.getSession();
        Customer customer = (Customer) session.getAttribute(SessionUtils.SessionAttributes.USER_ATTIBUTE.getAttribute());

        if (customer == null) {
            return new ResponseEntity<>(failure().toString(), HttpStatus.UNAUTHORIZED);
        }

        if (amount < 5) {
            throw new IllegalArgumentException("Amount should be at least 5.");
        }

        // Docs: https://www.payeer.com/upload/pdf/PayeerMerchanten.pdf

        // IMPORTANT: amount should have 0.00 format!
        String amountStr = String.valueOf(amount) + ".00";

        // TODO: move to ENV
        String merchantId = "301933519";

        // TODO: some unique number, and we can also store orders in our db (for history)
        String orderId = UUID.randomUUID().toString().toUpperCase();

        // should be encoded using base64
        String description = encodeDescription(
                String.format("Add funds to Recaptcher.com account (%s) |%s", customer.getEmail(), customer.getId())
        );

        String[] arr = new String[]{ merchantId, orderId, amountStr, currency, description, SECRET_KEY };

        String sign = signHash(Joiner.on(":").join(arr));

        Map<String, String> response = new HashMap<>();
        response.put("m_shop", merchantId);
        response.put("m_orderid", orderId);
        response.put("m_curr", currency);
        response.put("m_amount", amountStr);
        response.put("m_desc", description);
        response.put("m_sign", sign);

        return new ResponseEntity<>(gson.toJson(response), HttpStatus.OK);
    }


    private static boolean userSignedIn() {
        HttpSession session = SessionUtils.getSession();
        Customer customer = (Customer) session.getAttribute(SessionUtils.SessionAttributes.USER_ATTIBUTE.getAttribute());
        return customer != null;
    }

    private static String encodeDescription(String description) throws UnsupportedEncodingException {
        return Base64.getEncoder().encodeToString(
                description.getBytes("UTF-8")
        );
    }

    private static String decodeDescription(String description) throws UnsupportedEncodingException {
        byte[] decode = Base64.getDecoder().decode(description.getBytes("UTF-8"));
        return new String(decode);
    }

    private static String signHash(String text) throws UnsupportedEncodingException, NoSuchAlgorithmException {
        byte[] data = text.getBytes("UTF-8");

        MessageDigest md = MessageDigest.getInstance("SHA-256");

        md.update(data);

        byte[] digest = md.digest();

        return String.format("%064x", new java.math.BigInteger(1, digest)).toUpperCase();
    }

}
