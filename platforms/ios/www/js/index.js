/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    fireBaseInit();

    screen.orientation.lock('portrait');

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}

function fireBaseInit() {
    var FirebasePlugin;
    FirebasePlugin = window.FirebasePlugin;

    // IOS 만 퍼미션 허용 메시지 발생 (AOS는 항상 그랜트)
    FirebasePlugin.hasPermission(function(hasPermission){
        // Permission to receive notification is NOT granted
        if (!hasPermission) {
            window.FirebasePlugin.grantPermission(function(){
                alert("Permission is granted for iOS");
            }, function(error){
                alert(error);
                alert("grantPermission to get error=" + error);
            });
        }
    });
    
    // IOS - ( 안드로이드 는 없어도  배지가 클리어됨)
    FirebasePlugin.setBadgeNumber(0);

    // 푸시 메시지 받음
    FirebasePlugin.onMessageReceived(function(message) {
        try{
            console.log("===onMessageReceived Start=" + JSON.stringify(message));
            console.log("message.messageType=" + message.messageType);
            // if(window.cordova.platformId === "android") {
            if(message.messageType == "notification"){
                console.log("message.notification_body=" + message.notification_body);
                // andorid 에서 푸시 선택 후 실행시 alert 메시지가 안뜨고 에러
                //                alert("message.notification_body=" + message.notification_body);
            }
        }catch(e){
            console.log("===Exception in onMessageReceived callback: "+e.message);
        }
    }, function(error) {
        console.log("===Failed receiving FirebasePlugin message"+ error);
    });

    // 토큰 리프레시 ( 토큰이 변경될때마다 호출됨 - getToken 같으면 처리 안함)
    FirebasePlugin.onTokenRefresh(function(token){
        console.log("FCM token(refresh)=" + token);
    }, function(error) {
        console.log("Failed to refresh token=" + error);
    });
    // 토큰 받음
    FirebasePlugin.getToken(function(token){
        console.log("===FCM token =" + token);
    }, function(error) {
        console.log("===Failed to get FCM token=" + error);
    });

}

