
<?php
if( empty($_POST['input__phone']) || empty($_POST['input__name'])  )

	{//если не введено что то
		echo "Заполните контактные данные";
		die;
	} else{ //
		
		$sendto   = "username@gmail.com"; // email to mail

		//data from form
		$username = ( !empty($_POST['input__name']) ) ? trim( htmlspecialchars($_POST['input__name']) ) : "Не указано" ;
		$usertel = ( !empty($_POST['input__phone']) ) ? trim( htmlspecialchars($_POST['input__phone']) ) : "Не указано";
        $source = ( !empty($_POST['input__source']) ) ? trim( htmlspecialchars($_POST['input__source']) ) : "Не указано";



		// Headers
		$subject  = "Заявка с формы c sitenema.com"; //subject in email 
		//$headers  = "From: " . strip_tags($usermail) . "\r\n"; //Restricted on free hostings
		//$headers .= "Reply-To: ". strip_tags($usermail) . "\r\n";
		$headers .= "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html;charset=utf-8 \r\n";

		// Body of the mail
		$msg  = "<html><body style='font-family:Arial,sans-serif;'>";
		$msg .= "<h2 style='font-weight:bold;border-bottom:1px dotted #ccc;'>Заявка с сайта standnroll.by</h2>\r\n";
		$msg .= "<p><strong>От кого: </strong> ".$username."</p>\r\n";
		$msg .= "<p><strong>Телефон: </strong> ".$usertel."</p>\r\n";
        $msg .= "<p><strong>Кнопка на которую нажали: </strong> ".$source."</p>\r\n";

		$msg .= "</body></html>";

		$result = mail($sendto, $subject, $msg, $headers);//send an email, result 1 or 0

		if ($result){ 
        	echo "Отправлено!";
        	die;
	    }
	    else{
	        echo "Ошибка";
	        die;
	    }

	}
?>
