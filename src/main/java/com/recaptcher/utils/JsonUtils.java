package com.recaptcher.utils;

import com.recaptcher.entity.Customer;
import org.json.JSONObject;

/**
 * Created by rodio on 09.12.2015.
 */
public class JsonUtils {


    private static final String RESULT = "result";
    private static final String SUCCESS = "success";
    private static final String FAILURE = "failure";
    private static final String USER_NAME_JSON_ATTRIBUTE = "userName";
    private static final String NEW_USER_JSON_ATTRIBUTE = "newUser";
    public static final String ERROR_JSON_ATTRIBUTE = "error";


    public static JSONObject success() {
        return new JSONObject().put(RESULT, SUCCESS);
    }

    public static JSONObject failure() {
        return new JSONObject().put(RESULT, FAILURE);
    }

    public static JSONObject addBasicUserInfo(JSONObject jsonObject, Customer customer) {

        return jsonObject.put(USER_NAME_JSON_ATTRIBUTE, customer.getFirstName())
                .put(NEW_USER_JSON_ATTRIBUTE, false);
    }

    public static JSONObject addBasicUserInfo(JSONObject jsonObject, Customer customer, boolean newUser) {
        return jsonObject.put(USER_NAME_JSON_ATTRIBUTE, customer.getFirstName())
                .put(NEW_USER_JSON_ATTRIBUTE, newUser);
    }

    public static JSONObject addError(JSONObject jsonObject, String text) {
        return jsonObject.put(ERROR_JSON_ATTRIBUTE, text);
    }
}
