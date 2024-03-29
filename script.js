$(document).ready(function () {
//Define BLE Device Specs
var bleServiceUUID = 0x00FF;
var brigCharUUID = 0xFF01;
var cfgCharUUID = 0xFF02;

var bleServer;
var bleService;
var brigChar;
var cfgChar;

$('#ble-checkbox').on("change", (function(e){
    if($(this).is(':checked')){
        if (isWebBluetoothEnabled()){
            connectToDevice();
        } 
    }
    else{
        disconnectDevice();
    }
}));

$('.ble-btn').on("click", (function(e){
    $(this).attr("disabled", true);
    if($(this).hasClass('on'))
    {
        
        writeChar(cfgChar, "0");
        setBTN("0");

    }
    else
    {
        writeChar(cfgChar, "1");
        setBTN("1");
    }
    $(this).attr("disabled", false);
}));

$('#slider').on("change", (function(e){
    $(this).attr("disabled", true);
    writeChar(brigChar,$(this).val().toString());
    $(this).attr("disabled", false);
}));

function writeChar(char, val){
    if (bleServer && bleServer.connected) {
        const encoder = new TextEncoder();
        const array = encoder.encode(val);
        char.writeValue(array);
        sleep(300);
    } else {
        console.error ("Bluetooth is not connected. Cannot write to characteristic.")
        window.alert("Bluetooth is not connected. Cannot write to characteristic. \n Connect to BLE first!")
    }
}

function isWebBluetoothEnabled() {
    if (!navigator.bluetooth) {
        console.log("Web Bluetooth API is not available in this browser!");
        $("#ble-status").text("Web Bluetooth API is not available in this browser!");
        $("#ble-status").css("color", "red");
        $("#ble-checkbox").attr("checked", false);
        return false
    }
    console.log('Web Bluetooth API supported in this browser.');
    return true
}

function connectToDevice(){
    console.log('Initializing Bluetooth...');
    navigator.bluetooth.requestDevice({
        filters: [
            {services: [bleServiceUUID]}      
        ],
    })
    .then(device => {
        console.log('Device Selected:', device.name);
        $("#ble-status").text("Connected to device " + device.name);
        $("#ble-status").css("color", "green");
        device.addEventListener('gattserverdisconnected', onDisconnected);
        return device.gatt.connect();
    })
    .then(gattServer =>{
        bleServer = gattServer;
        console.log("Connected to GATT Server");
        return bleServer.getPrimaryService(bleServiceUUID);
    })
    .then(service => {
        console.log("Service discovered:", service.uuid);
        bleService = service;
        //set intial value
        service.getCharacteristic(brigCharUUID)
        .then(characteristic => {
            brigChar= characteristic;
            console.log("get char");
            return characteristic.readValue();
        })
        .then(value => {
            const decodedValue = new TextDecoder().decode(value);
            console.log("intial brigness value: ", decodedValue);
            $("#slider").attr("value", decodedValue);
            $("#rangeValue").text(decodedValue);
        })
        .catch(error => {
            console.log('Error: ', error);
        })

        service.getCharacteristic(cfgCharUUID)
        .then(characteristic => {
            cfgChar= characteristic;
            return characteristic.readValue();
        })
        .then(value => {
            const decodedValue = new TextDecoder().decode(value);
            console.log("intial config value: ", decodedValue);
           setBTN(decodedValue);
           
           $("#light-controller").slideDown(1000);
        })
        .catch(error => {
            console.log('Error: ', error);
        })
    })
    .catch(error => {
        $("#ble-checkbox").attr("checked", false);
        console.log('Error: ', error);
    })

}

function onDisconnected(event){
    console.log('Device Disconnected');
    $("#ble-checkbox").attr("checked", false);
    $("#ble-status").text("Device disconnected");
    $("#ble-status").css("color", "black");
    $("#light-controller").slideUp(1000);
}

function setBTN(val)
{
    if(val === "0" && $('.ble-btn').hasClass("on"))
    {
        $('.ble-btn').removeClass('on');
        $('.ble-btn').children('span').text('OFF');
        $('body').css('background','#D56062');
    }
    else if(val === "1" && !$('.ble-btn').hasClass("on"))
    {
        $('.ble-btn').addClass('on');
        $('.ble-btn').children('span').text('ON');
        $('body').css('background','#7AC74F');
    }
}

function disconnectDevice() {
    console.log("Disconnect Device.");
    if (bleServer && bleServer.connected) {
        bleServer.disconnect();
        console.log("Device Disconnected");
        $("#ble-status").text("Device disconnected");
        $("#ble-status").css("color", "black");
        $("#light-controller").slideUp(1000);
    }
} 

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

});
