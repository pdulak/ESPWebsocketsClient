var socket;
var wsStatus = document.getElementById('wsStatus');
var wsMeta = document.getElementById('wsMeta');
var wsDescription = document.getElementById('wsDescription');
var dataLimit = 1000; // about 100 records per second, for the moment this is not in use
var data = setEmptyData();
var lastMillis = 0;
var previousMillis = 0;

function setEmptyData() {
    return {
        "millis": [],
        "left" : {
            "acc" : {
                "x" : [],
                "y" : [],
                "z" : []
            }, 
            "mag" : {
                "x" : [],
                "y" : [],
                "z" : []
            }, 
            "gyr" : {
                "x" : [],
                "y" : [],
                "z" : []
            },
            "temp" : []
        },
        "right" : {
            "acc" : {
                "x" : [],
                "y" : [],
                "z" : []
            }, 
            "mag" : {
                "x" : [],
                "y" : [],
                "z" : []
            }, 
            "gyr" : {
                "x" : [],
                "y" : [],
                "z" : []
            },
            "temp" : []
        },
    }
}

function parseData(event) {
    // console.log(event.data);

/*
    String dataToReturn = "" + String(millis()) + ","
    + String(temp_L.temperature) + "," + String(temp_R.temperature) + ","
    + String(accel_L.acceleration.x) + "," + String(accel_R.acceleration.x) + ","
    + String(accel_L.acceleration.y) + "," + String(accel_R.acceleration.y) + ","
    + String(accel_L.acceleration.z) + "," + String(accel_R.acceleration.z) + ","
    + String(mag_L.magnetic.x) + "," + String(mag_R.magnetic.x) + ","
    + String(mag_L.magnetic.y) + "," + String(mag_R.magnetic.y) + ","
    + String(mag_L.magnetic.z) + "," + String(mag_R.magnetic.z) + ","
    + String(gyro_L.gyro.x) + "," + String(gyro_R.gyro.x) + ","
    + String(gyro_L.gyro.y) + "," + String(gyro_R.gyro.y) + ","
    + String(gyro_L.gyro.z) + "," + String(gyro_R.gyro.z) 
*/

    var dataArray = event.data.split(',');
    if (dataArray.length == 21) {
        data.millis.push( { x: dataArray[0], y: dataArray[0]} ); // if (data.millis.length > dataLimit) data.millis.shift();

        data.left.temp.push( { x: dataArray[0], y: dataArray[1]} ); // if (data.left.acc.x.length > dataLimit) data.left.acc.x.shift();
        data.right.temp.push( { x: dataArray[0], y: dataArray[2]} ); // if (data.right.acc.x.length > dataLimit) data.right.acc.x.shift();

        data.left.acc.x.push( { x: dataArray[0], y: dataArray[3]} ); // if (data.left.acc.x.length > dataLimit) data.left.acc.x.shift();
        data.right.acc.x.push( { x: dataArray[0], y: dataArray[4]} ); // if (data.right.acc.x.length > dataLimit) data.right.acc.x.shift();
        data.left.acc.y.push( { x: dataArray[0], y: dataArray[5]} ); // if (data.left.acc.y.length > dataLimit) data.left.acc.y.shift();
        data.right.acc.y.push( { x: dataArray[0], y: dataArray[6]} ); // if (data.right.acc.y.length > dataLimit) data.right.acc.y.shift();
        data.left.acc.z.push( { x: dataArray[0], y: dataArray[7]} ); // if (data.left.acc.z.length > dataLimit) data.left.acc.z.shift();
        data.right.acc.z.push( { x: dataArray[0], y: dataArray[8]} ); // if (data.right.acc.z.length > dataLimit) data.right.acc.z.shift();

        data.left.mag.x.push( { x: dataArray[0], y: dataArray[9]} ); // if (data.left.mag.x.length > dataLimit) data.left.mag.x.shift();
        data.right.mag.x.push( { x: dataArray[0], y: dataArray[10]} ); // if (data.right.mag.x.length > dataLimit) data.right.mag.x.shift();
        data.left.mag.y.push( { x: dataArray[0], y: dataArray[11]} ); // if (data.left.mag.y.length > dataLimit) data.left.mag.y.shift();
        data.right.mag.y.push( { x: dataArray[0], y: dataArray[12]} ); // if (data.right.mag.y.length > dataLimit) data.right.mag.y.shift();
        data.left.mag.z.push( { x: dataArray[0], y: dataArray[13]} ); // if (data.left.mag.z.length > dataLimit) data.left.mag.z.shift();
        data.right.mag.z.push( { x: dataArray[0], y: dataArray[14]} ); // if (data.right.mag.z.length > dataLimit) data.right.mag.z.shift();

        data.left.gyr.x.push( { x: dataArray[0], y: dataArray[15]} ); // if (data.left.gyr.x.length > dataLimit) data.left.gyr.x.shift();
        data.right.gyr.x.push( { x: dataArray[0], y: dataArray[16]} ); // if (data.right.gyr.x.length > dataLimit) data.right.gyr.x.shift();
        data.left.gyr.y.push( { x: dataArray[0], y: dataArray[17]} ); // if (data.left.gyr.y.length > dataLimit) data.left.gyr.y.shift();
        data.right.gyr.y.push( { x: dataArray[0], y: dataArray[18]} ); // if (data.right.gyr.y.length > dataLimit) data.right.gyr.y.shift();
        data.left.gyr.z.push( { x: dataArray[0], y: dataArray[19]} ); // if (data.left.gyr.z.length > dataLimit) data.left.gyr.z.shift();
        data.right.gyr.z.push( { x: dataArray[0], y: dataArray[20]} ); // if (data.right.gyr.z.length > dataLimit) data.right.gyr.z.shift();

        lastMillis = dataArray[0];
        wsDescription.innerHTML = 'Received data, last millis: ' + lastMillis;
    }

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
        data = setEmptyData();
    } else {
        wsDescription.innerHTML += '<br />Unable to send<br />';
    }
}

function provideSeriesAccelerometer() {
    return [
        { data: data.left.acc.x.slice(), name: "Acc Lx" } ,
        { data: data.left.acc.y.slice(), name: "Acc Ly" } ,
        { data: data.left.acc.z.slice(), name: "Acc Lz" } ,
        { data: data.right.acc.x.slice(), name: "Acc Rx" } ,
        { data: data.right.acc.y.slice(), name: "Acc Ry" } ,
        { data: data.right.acc.z.slice(), name: "Acc Rz" } ,
    ]
}

function provideSeriesMag() {
    return [
        { data: data.left.mag.x.slice(), name: "Mag Lx" } ,
        { data: data.left.mag.y.slice(), name: "Mag Ly" } ,
        { data: data.left.mag.z.slice(), name: "Mag Lz" } ,
        { data: data.right.mag.x.slice(), name: "Mag Rx" } ,
        { data: data.right.mag.y.slice(), name: "Mag Ry" } ,
        { data: data.right.mag.z.slice(), name: "Mag Rz" } ,
    ]
}

function provideSeriesGyro() {
    return [
        { data: data.left.gyr.x.slice(), name: "Gyro Lx" } ,
        { data: data.left.gyr.y.slice(), name: "Gyro Ly" } ,
        { data: data.left.gyr.z.slice(), name: "Gyro Lz" } ,
        { data: data.right.gyr.x.slice(), name: "Gyro Rx" } ,
        { data: data.right.gyr.y.slice(), name: "Gyro Ry" } ,
        { data: data.right.gyr.z.slice(), name: "Gyro Rz" } ,
    ]
}

document.getElementById('connectButton').addEventListener("click", socketConnect);
document.getElementById('sendButton').addEventListener("click", socketSend);

/* CHART */

var optionsA = {
    series: provideSeriesAccelerometer(),
    chart: {
        id: 'accelerometer',
        height: 250,
        type: 'line',
        animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
                speed: 100
            }
        },
        toolbar: {
            show: false
        },
        zoom: {
            enabled: false
        }
    },
    yaxis: {
        min: -40,
        max: 40
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    title: {
        text: 'Accelerometer',
        align: 'left'
    },
    markers: {
        size: 0
    },
    legend: {
        show: false
    },
};

var optionsM = {
    series: provideSeriesMag(),
    chart: {
        id: 'magnetometer',
        height: 250,
        type: 'line',
        animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
                speed: 100
            }
        },
        toolbar: {
            show: false
        },
        zoom: {
            enabled: false
        }
    },
    yaxis: {
        min: -90,
        max: 90
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    title: {
        text: 'Magnetometer',
        align: 'left'
    },
    markers: {
        size: 0
    },
    legend: {
        show: false
    },
};

var optionsG = {
    series: provideSeriesGyro(),
    chart: {
        id: 'gyro',
        height: 250,
        type: 'line',
        animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
                speed: 100
            }
        },
        toolbar: {
            show: false
        },
        zoom: {
            enabled: false
        }
    },
    yaxis: {
        min: -10,
        max: 10
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    title: {
        text: 'Gyroscope',
        align: 'left'
    },
    markers: {
        size: 0
    },
    legend: {
        show: false
    },
};

var chartA = new ApexCharts(document.querySelector("#chartA"), optionsA);
var chartM = new ApexCharts(document.querySelector("#chartM"), optionsM);
var chartG = new ApexCharts(document.querySelector("#chartG"), optionsG);
chartA.render();
chartM.render();
chartG.render();

window.setInterval(function() {
    if (previousMillis != lastMillis) {
        chartA.updateSeries(provideSeriesAccelerometer());
        chartM.updateSeries(provideSeriesMag());
        chartG.updateSeries(provideSeriesGyro());
        previousMillis = lastMillis;
    }
}, 1000)