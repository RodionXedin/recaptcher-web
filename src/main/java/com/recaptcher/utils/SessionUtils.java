package com.recaptcher.utils;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpSession;

/**
 * Created by rodion on 29.01.2017.
 */
public class SessionUtils {

    public enum SessionAttributes {
        USER_ATTIBUTE("user");

        private String user;

        SessionAttributes(String user) {
            this.user = user;
        }

        public String getAttribute() {
            return user;
        }
    }



    public static HttpSession getSession() {
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        return servletRequestAttributes.getRequest().getSession(true);
    }

}
