/**
 * Created by rodion on 29.01.2017.
 */

function login() {

}

function initLoginButton() {
    $.ajax({url: "/login",success : function (data) {
        if (data.result == "success") {
            $("#user-info-div").toggle('slide');
            populate_user_info_div(data);
        } else {
            $("#sign-in-name-input-name-div").toggle('slide');
        }

    }}
    )
};

function populate_user_info_div(data) {
    $("#user-info-href").html(data.email);
    $("#user-info-href").attr("href", "profile");
}

function initUserScripts() {
    initLoginButton();
};

function registerCustomer() {
    $.ajax("/register_customer", {
        method: 'POST',
        data: {
            email: $("#email").val(),
            password: $("#password").val(),
            confirmation: $("#confirmation").val()
        },
        success: function (data) {
            if (data.result == "success") {
                window.location = "dashboard";
            } else {
                var snackbarContainer = document.querySelector('#demo-toast-example');
                var showToastButton = document.querySelector('#demo-show-toast');
                var data = {message: data.message};
                snackbarContainer.MaterialSnackbar.showSnackbar(data);
            }
        }    });

}

function signin() {
    $.ajax("/login", {
        method: 'POST',
        data: {
            email: $("#email").val(),
            password: $("#password").val(),
            confirmation: $("#confirmation").val()
        },
        success: function (data) {
            if (data.result == "success") {
                window.location = "dashboard";
            } else {
                var snackbarContainer = document.querySelector('#demo-toast-example');
                var showToastButton = document.querySelector('#demo-show-toast');
                var data = {message: "Seems like there is something wrong with the information provided. Please check it and try again."};
                snackbarContainer.MaterialSnackbar.showSnackbar(data);
            }
        },
        error: function (data) {

        }
    });

}

$(function () {
    initUserScripts();
});