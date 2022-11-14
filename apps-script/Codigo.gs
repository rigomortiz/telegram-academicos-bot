function onFormSubmite(e) {
  try {
    var data = e.response.getItemResponses()[0].getResponse().split(',');
    var user_id = data[0]
    var chat_id = data[1]
    var username = data[2];
    var name = e.response.getItemResponses()[1].getResponse();
    var email = e.response.getRespondentEmail();
    const scriptProperties = PropertiesService.getScriptProperties();

    var LINK = scriptProperties.getProperty('GROUP_TELEGRAM_LINK');
    var NOTIFICATION_CHAT_ID = scriptProperties.getProperty('NOTIFICATION_CHAT_ID');
    var API_KEY = scriptProperties.getProperty('API_KEY');

    var html = "Hola " + name + ", se validó tu correo.\n"
      + "Código de validación:\n" + user_id + "\n"
      + "Link del grupo:\n" + LINK + "\n"
      + "\nPor favor no compartas el link.";


    GmailApp.sendEmail(email, 'Validación de usuario de Telegram', html, {noReply: true});
    UrlFetchApp.fetch('https://api.telegram.org/bot' + API_KEY + '/sendMessage?chat_id=-' + NOTIFICATION_CHAT_ID + '&text='
      + encodeURIComponent(email + '\n' + name + '\n' + username + '\n' + user_id));

    UrlFetchApp.fetch('https://api.telegram.org/bot' + API_KEY + '/sendMessage?chat_id=' + chat_id + '&text='
      + encodeURIComponent(html));
  } catch (err) {
    // TODO (developer) - Handle exception
    Logger.log('Failed with error %s', err.message);
  }
}
