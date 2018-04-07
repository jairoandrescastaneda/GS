function onOpen(e) {

  var ui=SpreadsheetApp.getUi();
   menuPrincipal = ui.createMenu('Prefety');
  //recibe dos parametros el nombre del menu y la funcion a la que llama

  //submenu
  submenu = submenu_listarcorreos(ui)

  menuPrincipal.addSubMenu(submenu)
  menuPrincipal.addToUi();

  showSidebar();

}



function submenu_listarcorreos(ui){
   submenu = ui.createMenu("Acciones");

  submenu.addItem('Escoger Formato y enviar correo','abrir_documentos')
  return submenu
}

//abre un hmtl obviando el .html y lo agrega a un menu a la derecha con el contenido de el
function showSidebar(){
  var ui = HtmlService.createHtmlOutputFromFile('Prefety').setTitle('Prefety');
  SpreadsheetApp.getUi().showSidebar(ui);
}


function imprimir_contenido(){
   sheet = SpreadsheetApp.getActiveSheet();
  //obtiene el rango de filas en cual hay contenido
  ranges = sheet.getDataRange();
  //obtiene la matriz de informacion de contenido
  values = ranges.getValues();

  for(i=1; i<values.length; i++){

    //imprimir un objeto el atributo 2 , el correo
      Logger.log(values[i][2])

  }

}



function enviar_correos(textoenviar){
  sheet = SpreadsheetApp.getActiveSheet();
  //obtiene el rango de filas en cual hay contenido
  ranges = sheet.getDataRange();
  //obtiene la matriz de informacion de contenido
  values = ranges.getValues();

  for(i=2; i<values.length; i++){
    //se valida el texto que se agrrega al final
    if(values[i][6]!="ENVIADO"){
    textofinal = textoenviar.replace("{{nombre}}",values[i][1]).replace(/{{establecimiento}}/g,values[i][3]).replace("{{cantidadbusquedas}}",values[i][5]);
    pdf = convertir_pdf(textofinal,values[i][2])

    MailApp.sendEmail(values[i][2], "Carta Presentacion Prefety", "Link del pdf "+pdf.getUrl())
    sheet.getRange("G"+(i+1)).setValue("ENVIADO")
    }
  }

}


function convertir_pdf(texto,persona){

pdf = DriveApp.createFile("archivo_"+persona, texto, MimeType.PDF);
return pdf;
}



//se ejecuta de manera asincrona con google.run en el html
function abrir_documento(id){
  documento = DocumentApp.openById(id);
  cuerpo = documento.getBody();
  texto = cuerpo.getText();
  enviar_correos(texto)







}

function abrir_documentos(){
 var html = HtmlService.createHtmlOutputFromFile('Picker.html')
      .setWidth(600)
      .setHeight(425)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
    SpreadsheetApp.getUi().showModalDialog(html, 'Seleccione el Formato');

}

function getOAuthToken() {
  DriveApp.getRootFolder();
  return ScriptApp.getOAuthToken();
}
