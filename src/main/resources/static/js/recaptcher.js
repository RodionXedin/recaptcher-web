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
        return "Requests prepared";
    } else if (title == "cachedUsed") {
        return "Prepared requests used";
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
            mydata.sort(function(a,b) { return new Date(a.datestamp) > new Date(b.datestamp)});
            var table = $.makeTable(mydata);
            $(table).appendTo("#tableContent");

            var chartData = {};
            chartData.datasets = [];
            var successful = [];
            var failure = [];
            var datestamp = [];
            var cachedPrepared = [];
            var cachedUsed = [];
            $.each(eval(data.tableData.statistics), function (index, value) {
                successful.push(value["successful"]);
                failure.push(value["failed"]);
                datestamp.push(value["datestamp"]);
                cachedPrepared.push(value["cachedPrepared"]);
                cachedUsed.push(value["cachedUsed"]);
            });

            chartData.datasets.push({
                fill: false, label: "Successful", data: successful, backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)", pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff"
            });
            chartData.datasets.push({
                borderCapStyle: 'butt',
                fill: false,
                label: "Failure",
                data: failure,
                backgroundColor: "rgba(232, 25, 25, 0.64)",
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
                fill: false, label: "Prepared", data: cachedPrepared, backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)", pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff"
            });
            chartData2.datasets.push({
                borderCapStyle: 'butt',
                fill: false,
                label: "Used",
                data: cachedUsed,
                backgroundColor: "rgba(232, 25, 25, 0.64)",
                borderColor: "rgba(232, 25, 25, 0.64)",
                pointBorderColor: "rgba(232, 25, 25, 0.64)",
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

            $("#succRatioChart").data("persent", todaySuccRatio);
            $("#efficRatioChart").data("persent", todayCacheEfficiency);

            new EasyPieChart(document.querySelector('#succRatioChart'), {
                easing: 'easeOutElastic',
                delay: 3000,
                barColor: '#69c',
                trackColor: '#ace',
                scaleColor: false,
                lineWidth: 20,
                trackWidth: 16,
                lineCap: 'butt',
                onStep: function (from, to, percent) {
                    this.el.children[0].innerHTML = Math.round(percent);
                }
            });
            new EasyPieChart(document.querySelector('#efficRatioChart'), {
                easing: 'easeOutElastic',
                delay: 3000,
                barColor: '#69c',
                trackColor: '#ace',
                scaleColor: false,
                lineWidth: 20,
                trackWidth: 16,
                lineCap: 'butt',
                onStep: function (from, to, percent) {
                    this.el.children[0].innerHTML = Math.round(percent);
                }
            });

        }
    });
}


$(function () {
    initUserScripts();
    initSettingsPage();
});