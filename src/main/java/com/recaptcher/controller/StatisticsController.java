package com.recaptcher.controller;

import com.recaptcher.Service.ApiService;
import com.recaptcher.entity.Customer;
import com.recaptcher.model.TableData;
import com.recaptcher.utils.SessionUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.math.BigDecimal;

import static com.recaptcher.utils.JsonUtils.*;

/**
 * Created by rodion.shkrobot on 2/2/2017.
 */
@RestController
public class StatisticsController {

    @Autowired
    private ApiService apiService;

    @RequestMapping(value = "/getTableData", method = RequestMethod.GET, produces = "application/json")
    public String checkLogin() throws IOException {
        HttpSession session = SessionUtils.getSession();

        Customer customer = (Customer) session.getAttribute(SessionUtils.SessionAttributes.USER_ATTIBUTE.getAttribute());
        if (customer != null) {
            JSONObject balanceTable = apiService.getBalanceTable(String.valueOf(customer.getId()));
            return addBasicUserInfo(success(), customer).put("tableData",balanceTable).toString();
        }

        return failure().toString();
    }

}
