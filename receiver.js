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