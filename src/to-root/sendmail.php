<?php
	$sendto   = "username@gmail.com"; // email to mail

	//data from a form, input__name is a name in the form
	$username = ( !empty($_POST['input__name']) ) ? trim( htmlspecialchars($_POST['input__name']) ) : "Не указано" ;
	$usertel = ( !empty($_POST['input__phone']) ) ? trim( htmlspecialchars($_POST['input__phone']) ) : "Не указано";

	//$sendFromName = 'Название от кого';
	//$sendFromName = "=?UTF-8?B?".base64_encode($sendFromName)."?="; //fix for cyrillic
	//$sendFromMail = 'admin@' . $_SERVER['HTTP_HOST'];
	//$sendFromMail = "=?UTF-8?B?".base64_encode($sendFromMail)."?="; //fix for cyrillic


	// Headers
	$subject  = "Заявка с формы c " . $_SERVER['HTTP_HOST']; //subject in email
	//$headers  = "From: ". $sendFromName . " <" . $sendFromMail . ">\r\n"; //Restricted on free hostings
	//$headers .= "Reply-To: ". strip_tags($usermail) . "\r\n";
	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "Content-Type: text/html;charset=utf-8 \r\n";

	// Body of the mail
	$msg  = "<html><body style='font-family:Arial,sans-serif;'>";
	$msg .= "<h2 style='font-weight:bold;border-bottom:1px dotted #ccc;'>Заявка с сайта ". $_SERVER['HTTP_HOST'] ."</h2>\r\n";
	$msg .= "<p><strong>От кого: </strong> ".$username."</p>\r\n";
	$msg .= "<p><strong>Телефон: </strong> ".$usertel."</p>\r\n";
	$msg .= "</body></html>";

	$result = mail($sendto, $subject, $msg, $headers);//send an email, result 1 or 0

	if ($result){ //то что отправляется в эхо, приходит в коллбек асинхронной функции, можно что-нибудь полезное передать
		echo "Отправлено!";
		die;
	}
	else{
		echo "Ошибка";
		die;
	}

?>