<?php

// Tạo mới một CURL

$ch = curl_init();

 

// Cấu hình cho CURL

curl_setopt($ch, CURLOPT_URL, "https://syrf.auth.us-west-2.amazoncognito.com/login?response_type=code&client_id=6j9gtrnitfb7fajj6pbno38idr&redirect_uri=http://localhost:3002/signin&identity_provider=COGNITO&scope=openid email phone profile aws.cognito.signin.user.admin");

 

// Thực thi CURL

curl_exec($ch);

 

// Ngắt CURL, giải phóng

curl_close($ch);
