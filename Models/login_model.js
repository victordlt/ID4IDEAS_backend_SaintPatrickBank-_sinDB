let db_client = require('../db_cliente');
let db_tarjet = require('../db_tarjeta');

//Metodo para validar tarjeta y clave
const logueo = (UserPin) => {
    let result_tar = db_tarjet.filter(
        tarjeta=>(tarjeta.nro_tarjeta==UserPin.tarjeta)&
        (tarjeta.clave==UserPin.clave));
    
    let result_cli = db_client.filter(cliente=>cliente.id_cliente==result_tar[0].id_cliente);
    
    result = {
      "nro_tarjeta": UserPin.tarjeta,
      "saldo": result_tar[0].saldo,
      "nombre": result_cli[0].nombre,
      "apellido_paterno": result_cli[0].apellido_paterno
    };
    return result;
    }


module.exports = {
    logueo
}