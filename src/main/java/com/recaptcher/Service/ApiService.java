package com.recaptcher.Service;

import com.recaptcher.entity.Customer;
import com.recaptcher.model.TableData;
import com.recaptcher.repository.CustomerRepository;
import com.squareup.okhttp.*;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;


/**
 * Created by rodion.shkrobot on 2/1/2017.
 */
@Service
public class ApiService {

    @Value("${private.api.key}")
    private String privateApiKey;

    @Value("${api_url}")
    private String apiUrl;

    private static final MediaType JSON
            = MediaType.parse("application/json; charset=utf-8");

    private enum Endpoint {
        CREATE_ACCOUNT("/api/management/account/createAccount"),
        GET_API_KEY("/api/management/account/%s/apiKey"),
        GET_BALANCE("/api/management/account/%s/balance"),
        ADD_BALANCE("/api/management/account/%s/balance/add"),
        GET_BALANCE_TABLE("/api/management/account/%s/statistics/table");

        private String endpoint;

        Endpoint(String endpoint) {
            this.endpoint = endpoint;
        }

        public String getEndpoint() {
            return endpoint;
        }
    }


    private OkHttpClient client = new OkHttpClient();

    @Autowired
    private CustomerRepository customerRepository;

    public void createUser(String customerId) throws IOException {
        RequestBody body = RequestBody.create(JSON, new JSONObject().put("accountId", customerId).toString());
        Request request = new Request.Builder()
                .url(buildApiUrl(Endpoint.CREATE_ACCOUNT))
                .post(body)
                .build();

        Response response = client.newCall(request).execute();
    }


    public String getApiKey(String userID) throws IOException {
        Request request = new Request.Builder()
                .url(buildApiUrl(Endpoint.GET_API_KEY, userID))
                .build();
        Response response = client.newCall(request).execute();
        return new JSONObject(response.body().string()).getString("apiKey");
    }


    public String regenerateApiKey(String userID) throws IOException {
        createUser(userID);
        return getApiKey(userID);
    }

    public BigDecimal getUserBalance(String userID) throws IOException {
        Request request = new Request.Builder()
                .url(buildApiUrl(Endpoint.GET_BALANCE, userID))
                .build();
        Response response = client.newCall(request).execute();
        return BigDecimal.valueOf(Double.valueOf(new JSONObject(response.body().string()).getString("balance")));
    }

    public BigDecimal addUserBalance(String userID, BigDecimal balanceAdd) throws IOException {
        RequestBody body = RequestBody.create(JSON, new JSONObject().put("amount", balanceAdd.doubleValue()).toString());
        Request request = new Request.Builder()
                .url(buildApiUrl(Endpoint.ADD_BALANCE, userID))
                .post(body)
                .build();

        Response response = client.newCall(request).execute();
        return getUserBalance(userID);
    }

    public JSONObject getBalanceTable(String userID) throws IOException {
        Request request = new Request.Builder()
                .url(buildApiUrl(Endpoint.GET_BALANCE_TABLE, userID))
                .build();
        Response response = client.newCall(request).execute();
        return new JSONObject(response.body().string());
    }

    private String buildApiUrl(Endpoint endpoint) {
        return apiUrl + endpoint.getEndpoint() + "?apiKey=" + privateApiKey;
    }

    private String buildApiUrl(Endpoint endpoint, String addition) {
        return apiUrl + String.format(endpoint.getEndpoint(), addition) + "?apiKey=" + privateApiKey;
    }

}
