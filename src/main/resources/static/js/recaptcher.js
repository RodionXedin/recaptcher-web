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
    $("#user-info-href").attr("href", "dashboard");
    $("#registerButton").hide();
}

function initUserScripts() {
    initLoginButton();
};


function addFunds() {
    var curr = 'USD'; // $("#currencyDropDown").val();
    var amountStr = $("#fundsAmount").val();
    var paymentMethod = $('input[name=paymentMethod]:checked', '#addfundsform').val();

    console.log(paymentMethod);

    if (!isPositiveInteger(amountStr)) {
        alert("Amount should be a number! For example, 25.");
        return;
    }

    var amount = parseInt(amountStr);

    if (curr == 'USD' && amount < 5) {
        alert("Min amount is 5 for USD.");
        return;
    }
    /*else if (curr == 'RUB' && amount < 60) {
     alert("Min amount is 60 for RUB.");
     return;
     }*/

    if (paymentMethod == 'freshbooks') {
        if (!$("#customerEmail").val()) {
            alert("Please, enter a valid email.");
            return;
        }

        if (!$("#customerName").val()) {
            alert("Please, enter your name or Company name.");
            return;
        }

        if (!$("#customerCountry").val()) {
            alert("Please, enter a country");
            return;
        }
    }

    spinnerStart();

    if (paymentMethod == 'payeer') {
        payWithPayoneer(amount, curr);
    } else {
        payWithPaypal(amount, $("#customerEmail").val(), $("#customerName").val(), $("#customerCountry").val());
    }
}

function payWithPayoneer(amount, curr) {
    spinnerStart();

    $.getJSON("/payeer/payment-data?amount=" + amount + "&curr=" + curr, function (data) {
        spinnerStop();

        $.each(data, function (key, val) {
            $("input[name=" + key + "]").val(val);
        });

        $("#payeer-form").submit();
    }).fail(function () {
        spinnerStop();
        var snackbarContainer = document.querySelector('#demo-toast-example');
        var showToastButton = document.querySelector('#demo-show-toast');
        var data = {message: "Unexpected error."};
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    });
}

function payWithFreshbooks(amount, email, name, country) {
    $.ajax({
        method: "POST",
        url: "/freshbooks/addFunds",
        contentType: "application/json",
        data: JSON.stringify({
            "amount": amount,
            "email": email,
            "name": name,
            "country": country
        })
    }).done(function (data) {
        spinnerStop();
        var snackbarContainer = document.querySelector('#demo-toast-example');
        var showToastButton = document.querySelector('#demo-show-toast');
        var data = {message: "We will send an invoice in 1-2 hours to the email:" + email};
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    }).fail(function () {
        spinnerStop();
        var snackbarContainer = document.querySelector('#demo-toast-example');
        var showToastButton = document.querySelector('#demo-show-toast');
        var data = {message: "Unexpected error."};
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    });
}


function payWithPaypal(amount, email, name, country) {
    window.open("https://www.paypal.me/Recaptcher/" + amount);
    $.ajax({
        method: "POST",
        url: "/paypall/addFunds",
        contentType: "application/json",
        data: JSON.stringify({
            "amount": amount,
            "email": email
        })
    }).done(function (data) {
        spinnerStop();
        $("dialog")[0].close();
        var snackbarContainer = document.querySelector('#demo-toast-example');
        var showToastButton = document.querySelector('#demo-show-toast');
        var data = {
            message: "Thank you! We will process your payment as fast as possible ! ",
            timeout: 15000
        };
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    }).fail(function () {
        spinnerStop();
        var snackbarContainer = document.querySelector('#demo-toast-example');
        var showToastButton = document.querySelector('#demo-show-toast');
        var data = {message: "Unexpected error."};
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    });
}

function isPositiveInteger(s) {
    return !!s.match(/^[0-9]+$/);
    // or Rob W suggests
    return /^\d+$/.test(s);
}


/*
 function addFunds() {
 spinnerStart();
 $.ajax("/add_funds", {
 method: 'POST',
 data: {
 firstName: $("#firstName").val(),
 lastName: $("#lastName").val(),
 fundsAmount: $("#fundsAmount").val()
 },
 success: function (data) {
 spinnerStop();
 if (data.result == "success") {
 $("dialog").children(".mdl-dialog__actions").children(".mdl-button.close").click()
 var snackbarContainer = document.querySelector('#demo-toast-example');
 var showToastButton = document.querySelector('#demo-show-toast');
 var data = {
 message: "Thank you! We will send the funds request to your email shortly.",
 timeout: 10000
 };
 snackbarContainer.MaterialSnackbar.showSnackbar(data);
 } else {
 var snackbarContainer = document.querySelector('#demo-toast-example');
 var showToastButton = document.querySelector('#demo-show-toast');
 var data = {message: data.message};
 snackbarContainer.MaterialSnackbar.showSnackbar(data);
 }
 }
 });
 }
 */

function spinnerStart() {
    $(".mdl-layout__content").css('opacity', 0.5);
    $(".mdl-spinner").toggleClass("is-active");
}

function spinnerStop() {
    $(".mdl-layout__content").css('opacity', 1);
    $(".mdl-spinner").toggleClass("is-active");
}

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

    var dialog = document.querySelector('dialog');
    var showDialogButton = document.querySelector('#show-dialog');
    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    showDialogButton.addEventListener('click', function () {
        dialog.showModal();
    });
    dialog.querySelector('.close').addEventListener('click', function () {
        dialog.close();
    });
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
    spinnerStart();

    $.ajax("/regenerateApiKey", {
        method: 'GET',
        success: function (data) {
            $("#apiKeyValue").html(data.apiKey);
            var snackbarContainer = document.querySelector('#demo-toast-example');
            var showToastButton = document.querySelector('#demo-show-toast');
            var data = {message: "Key was regenerated."};
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
            spinnerStop();
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
        return "Requests predicted";
    } else if (title == "cachedUsed") {
        return "Predicted requests used";
    } else if (title == "succRatio") {
        return "Success Ratio";
    } else if (title == "cacheEffic") {
        return "Prediction efficiency";
    }


}

var todaySuccRatio;
var todayCacheEfficiency;
var dateRecorded;
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
                tblHeader += '<th class="mdl-data-table__cell--non-numeric">' + getHeader("succRatio") + "</th>";
                tblHeader += '<th class="mdl-data-table__cell--non-numeric">' + getHeader("cacheEffic") + "</th>";
                tblHeader += "</tr>";
                $(tblHeader).appendTo(table);
                $.each(mydata, function (index, value) {
                    var TableRow = "<tr>";
                    TableRow += '<td class="mdl-data-table__cell--non-numeric">' + value["datestamp"] + "</td>";
                    TableRow += '<td class="mdl-data-table__cell--non-numeric">' + value["spending"] + "$</td>";
                    TableRow += '<td class="mdl-data-table__cell--non-numeric">' + value["successful"] + "</td>";
                    TableRow += '<td class="mdl-data-table__cell--non-numeric">' + value["failed"] + "</td>";
                    TableRow += '<td class="mdl-data-table__cell--non-numeric">' + value["cachedPrepared"] + "</td>";
                    TableRow += '<td class="mdl-data-table__cell--non-numeric">' + value["cachedUsed"] + "</td>";
                    var succRatio = value["successful"] == 0 ? value["failed"] == 0 ? 1 : 0 : value["successful"] / (value["successful"] + value["failed"])
                    TableRow += '<td class="mdl-data-table__cell--non-numeric">' + Number(succRatio * 100).toFixed(1) + "%</td>";
                    var cacheEfficiency = value["successful"] == 0 ? 1 : value["cachedUsed"] / value["successful"];
                    TableRow += '<td class="mdl-data-table__cell--non-numeric">' + Number(cacheEfficiency * 100).toFixed(1) + "%</td>";
                    TableRow += "</tr>";
                    todaySuccRatio = succRatio;
                    todayCacheEfficiency = cacheEfficiency;
                    dateRecorded = value["datestamp"];
                    $(table).append(TableRow);
                });
                return ($(table));
            };
            var jdata = data.tableData.statistics;
            var mydata = eval(jdata);

            String.prototype.replaceAll = function (search, replacement) {
                var target = this;
                return target.replace(new RegExp(search, 'g'), replacement);
            };
            mydata.sort(function (a, b) {
                return new Date(a.datestamp.replaceAll("-", "/")) < new Date(b.datestamp.replaceAll("-", "/"))
            });
            var table = $.makeTable(mydata);
            $(table).appendTo("#tableContent");

            var chartData = {};
            chartData.datasets = [];
            var successful = [];
            var failure = [];
            var datestamp = [];
            var cachedPrepared = [];
            var cachedUsed = [];


            data.tableData.statistics.sort(function (a, b) {
                return new Date(a.datestamp.replaceAll("-", "/")) > new Date(b.datestamp.replaceAll("-", "/"))
            });
            $.each(eval(data.tableData.statistics), function (index, value) {
                successful.push(value["successful"]);
                failure.push(value["failed"]);
                datestamp.push(value["datestamp"]);
                cachedPrepared.push(value["cachedPrepared"]);
                cachedUsed.push(value["cachedUsed"]);
            });

            chartData.datasets.push({
                fill: true, label: "Successful", data: successful, backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)", pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff"
            });
            chartData.datasets.push({
                borderCapStyle: 'butt',
                fill: true,
                label: "Failure",
                data: failure,
                backgroundColor: "rgba(232, 25, 25, 0.2)",
                borderColor: "rgba(232, 25, 25, 0.64)",
                pointBorderColor: "rgba(232, 25, 25, 0.64)",
                pointBackgroundColor: "#fff"
            });
            chartData.labels = datestamp;
            // chartData.options.scales.xAxes = [];

            var ctx = $("#firstChartCanvas");
            var myLineChart = new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: {
                    scales: {
                        yAxes: [{
                            type: 'linear'
                        }]
                    }
                }
            });


            var chartData2 = {};
            chartData2.datasets = [];
            chartData2.labels = datestamp;
            chartData2.datasets.push({
                fill: true,
                label: "Successful",
                data: successful,
                fillColor: "rgba(75,192,192,0.2)",
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)",
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff"
            });
            chartData2.datasets.push({
                borderCapStyle: 'butt',
                fill: true,
                label: "Predicted",
                data: cachedUsed,
                fillColor: "rgba(54, 162, 235,0.2)",
                backgroundColor: "rgba(54, 162, 235,0.2)",
                borderColor: "rgba(54, 162, 235,0.64)",
                pointBorderColor: "rgba(54, 162, 235,0.64)",
                pointBackgroundColor: "#fff"
            });

            var ctx2 = $("#secondChartCanvas");
            var myLineChart = new Chart(ctx2, {
                type: 'line',
                data: chartData2,
                options: {
                    scales: {
                        yAxes: [{
                            type: 'linear'
                        }]
                    }
                }
            });
            //
            // $("#succRatioChart").data("persent", todaySuccRatio);
            // $("#efficRatioChart").data("persent", todayCacheEfficiency);
            //
            // new EasyPieChart(document.querySelector('#succRatioChart'), {
            //     easing: 'easeOutElastic',
            //     delay: 3000,
            //     barColor: '#69c',
            //     trackColor: '#ace',
            //     scaleColor: false,
            //     lineWidth: 20,
            //     trackWidth: 16,
            //     lineCap: 'butt',
            //     onStep: function (from, to, percent) {
            //         this.el.children[0].innerHTML = Math.round(percent);
            //     }
            // });
            // new EasyPieChart(document.querySelector('#efficRatioChart'), {
            //     easing: 'easeOutElastic',
            //     delay: 3000,
            //     barColor: '#69c',
            //     trackColor: '#ace',
            //     scaleColor: false,
            //     lineWidth: 20,
            //     trackWidth: 16,
            //     lineCap: 'butt',
            //     onStep: function (from, to, percent) {
            //         this.el.children[0].innerHTML = Math.round(percent);
            //     }
            // });

        }
    });
}


$(function () {
    initUserScripts();
    initSettingsPage();
});