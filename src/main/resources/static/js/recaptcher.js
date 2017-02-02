/**
 * Created by rodion on 29.01.2017.
 */

function login() {

}

function initLoginButton() {
    $.ajax({
            url: "/login", success: function (data) {
                if (data.result == "success") {
                    $("#user-info-div").toggle('slide');
                    populate_user_info_div(data);
                } else {
                    $("#sign-in-name-input-name-div").toggle('slide');
                }

            }
        }
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
        }
    });

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


function initSettingsPage() {
    initBalance();
    initApiKey()
}

function initBalance() {
    $.ajax("/getBalance", {
        method: 'GET',
        success: function (data) {
            $("#balanceValue").html(data.balance);
        }
    });

}

function initApiKey() {
    $.ajax("/getApiKey", {
        method: 'GET',
        success: function (data) {
            $("#apiKeyValue").html(data.apiKey);
        }
    });
}

function regenerateApiKey() {
    $.ajax("/regenerateApiKey", {
        method: 'GET',
        success: function (data) {
            $("#apiKeyValue").html(data.apiKey);
        }
    });
}

function getHeader(title) {
    if (title == "datestamp") {
        return "Date";
    } else if (title == "spending") {
        return "Money Spent";
    } else if (title == "successful") {
        return "Successful requests";
    } else if (title == "failed") {
        return "Failed requests";
    } else if (title == "cachedPrepared") {
        return "Requests prepared";
    } else if (title == "cachedUsed") {
        return "Requests used";
    }
}

function getTableData() {
    $.ajax("/getTableData", {
        method: 'GET',
        success: function (data) {
            $.makeTable = function (mydata) {
                var table = $('<table style="width: 100%" class="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp">');
                var tblHeader = "<tr>";
                tblHeader += '<th class="mdl-data-table__cell--non-numeric">' + getHeader("datestamp") + "</th>";
                tblHeader += '<th class="mdl-data-table__cell--non-numeric">' + getHeader("spending") + "</th>";
                tblHeader += '<th class="mdl-data-table__cell--non-numeric">' + getHeader("successful") + "</th>";
                tblHeader += '<th class="mdl-data-table__cell--non-numeric">' + getHeader("failed") + "</th>";
                tblHeader += '<th class="mdl-data-table__cell--non-numeric">' + getHeader("cachedPrepared") + "</th>";
                tblHeader += '<th class="mdl-data-table__cell--non-numeric">' + getHeader("cachedUsed") + "</th>";
                tblHeader += "</tr>";
                $(tblHeader).appendTo(table);
                $.each(mydata, function (index, value) {
                    var TableRow = "<tr>";
                    TableRow += '<td class="mdl-data-table__cell--non-numeric">' + value["datestamp"] + "</td>";
                    TableRow += '<td class="mdl-data-table__cell--non-numeric">' + value["spending"] + "</td>";
                    TableRow += '<td class="mdl-data-table__cell--non-numeric">' + value["successful"] + "</td>";
                    TableRow += '<td class="mdl-data-table__cell--non-numeric">' + value["failed"] + "</td>";
                    TableRow += '<td class="mdl-data-table__cell--non-numeric">' + value["cachedPrepared"] + "</td>";
                    TableRow += '<td class="mdl-data-table__cell--non-numeric">' + value["cachedUsed"] + "</td>";
                    TableRow += "</tr>";
                    $(table).append(TableRow);
                });
                return ($(table));
            };
            var jdata = data.tableData.statistics;
            var mydata = eval(jdata);
            var table = $.makeTable(mydata);
            $(table).appendTo("#tableContent");

        }
    });
}


$(function () {
    initUserScripts();
    initSettingsPage();
});