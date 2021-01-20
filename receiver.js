var socket;
var wsStatus = document.getElementById('wsStatus');
var wsMeta = document.getElementById('wsMeta');
var wsDescription = document.getElementById('wsDescription');

function parseData(event) {
    console.log(event.data);
    wsDescription.innerHTML += event.data + '<br />';
}

function wsOnOpen(event) {
    wsStatus.innerHTML = 'Connected';
    wsMeta.innerHTML = event.target.url;
    wsDescription.innerHTML = '.<br />';
}

function wsOnClose(event) {
    wsStatus.innerHTML = 'Connection Closed';
    wsMeta.innerHTML = 'Nothing to display';
    wsDescription.innerHTML = 'Nothing to show';
}

function wsOnError(event) {
    wsStatus.innerHTML = 'Error when trying to connect to the server';
    wsMeta.innerHTML = 'Nothing to display';
    wsDescription.innerHTML = 'Nothing to show';
}

function socketConnect() {
    var serverIP = document.getElementById('serverIP').value;
    var serverPort = document.getElementById('serverPort').value;
    wsStatus.innerHTML = 'Connecting...';
    socket = new WebSocket("ws://" + serverIP + ":" + serverPort + "/");

    // register events
    socket.onerror = wsOnError;
    socket.onmessage = parseData;
    socket.onopen = wsOnOpen;
    socket.onclose = wsOnClose;
}

function socketSend() {
    if ((socket) && (socket.readyState == 1)) {
        wsDescription.innerHTML = '.<br />';
        socket.send(document.getElementById('requestCount').value);
    } else {
        wsDescription.innerHTML += '<br />Unable to send<br />';
    }
}

document.getElementById('connectButton').addEventListener("click", socketConnect);
document.getElementById('sendButton').addEventListener("click", socketSend);

/* CHART */

var lastDate = 0;
var data = []
var TICKINTERVAL = 86400000
let XAXISRANGE = 777600000

function getDayWiseTimeSeries(baseval, count, yrange) {
    var i = 0;
    while (i < count) {
        var x = baseval;
        var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

        data.push({
            x,
            y
        });
        lastDate = baseval
        baseval += TICKINTERVAL;
        i++;
    }
}

getDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 10, {
    min: 10,
    max: 90
})

function getNewSeries(baseval, yrange) {
    var newDate = baseval + TICKINTERVAL;
    lastDate = newDate

    for (var i = 0; i < data.length - 10; i++) {
        // IMPORTANT
        // we reset the x and y of the data which is out of drawing area
        // to prevent memory leaks
        data[i].x = newDate - XAXISRANGE - TICKINTERVAL
        data[i].y = 0
    }

    data.push({
        x: newDate,
        y: Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
    })
}

function resetData() {
    // Alternatively, you can also reset the data at certain intervals to prevent creating a huge series 
    data = data.slice(data.length - 10, data.length);
}



var options = {
    series: [{
        data: data.slice()
    }],
    chart: {
        id: 'realtime',
        height: 350,
        type: 'line',
        animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
                speed: 1000
            }
        },
        toolbar: {
            show: false
        },
        zoom: {
            enabled: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    title: {
        text: 'Dynamic Updating Chart',
        align: 'left'
    },
    markers: {
        size: 0
    },
    xaxis: {
        type: 'datetime',
        range: XAXISRANGE,
    },
    yaxis: {
        max: 100
    },
    legend: {
        show: false
    },
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();


window.setInterval(function () {
    getNewSeries(lastDate, {
        min: 10,
        max: 90
    })

    chart.updateSeries([{
        data: data
    }])
}, 1000)