let db_client = require('../db_cliente');
let db_tarjet = require('../db_tarjeta');
let db_histrans = require('../db_historial_transaccion');

//---------------------------Metodo LOGIN
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




//---------------------------Metodo TRANSACCION
const transaccion = (datotransaccion) => {

  //registramos en la tabla historial de transacciones el retiro de la cuenta propia 
  db_histrans.push(
    {
    //"id_transaccion":0,//db_histrans[0].seqValue + 1,
    "operacion": "retiro",
    "monto": Number(datotransaccion.monto),
    "fecha": new Date().toISOString(),
    "nro_tarjeta_propia": Number(datotransaccion.nro_tarjetaorigen),
    "nro_tarjeta_ajena": Number(datotransaccion.nro_tarjetadestino)
    }
  )

  //registramos en la tabla historial de transacciones el ingreso a la otra cuenta
  db_histrans.push(
    {
    //"id_transaccion":0,//db_histrans[0].seqValue + 1,
    "operacion": "ingreso",
    "monto": Number(datotransaccion.monto),
    "fecha": new Date().toISOString(),
    "nro_tarjeta_propia": Number(datotransaccion.nro_tarjetadestino),
    "nro_tarjeta_ajena": Number(datotransaccion.nro_tarjetaorigen)
    }
  )
   
   //actualizamos el monto de la tarjeta Origen
    let tarjetas = db_tarjet.filter(tarjeta=>tarjeta.nro_tarjeta != Number(datotransaccion.nro_tarjetaorigen));
    let ObjSel = db_tarjet.filter(tarjeta=>tarjeta.nro_tarjeta == Number(datotransaccion.nro_tarjetaorigen))[0];
    let clave = Number(ObjSel.clave);
    let saldo = ObjSel.saldo-Number(datotransaccion.monto); //saldo actualizado
    let idcliente = Number(ObjSel.id_cliente);

    tarjetas.push(
      {
        "nro_tarjeta": Number(datotransaccion.nro_tarjetaorigen),
        "clave": clave,
        "saldo": saldo,
        "id_cliente": idcliente
      }
    );
  db_tarjet = tarjetas; 

  //actualizamos el monto de la tarjeta Destino
  tarjetas = db_tarjet.filter(tarjeta=>tarjeta.nro_tarjeta != Number(datotransaccion.nro_tarjetadestino));
  ObjSel = db_tarjet.filter(tarjeta=>tarjeta.nro_tarjeta == Number(datotransaccion.nro_tarjetadestino))[0];
  clave = Number(ObjSel.clave);
  saldo = ObjSel.saldo+Number(datotransaccion.monto);//saldo actualizado
  idcliente = Number(ObjSel.id_cliente);

  tarjetas.push(
    {
      "nro_tarjeta": Number(datotransaccion.nro_tarjetadestino),
      "clave": clave,
      "saldo": saldo,
      "id_cliente": idcliente
    }
  );
    db_tarjet = tarjetas;

    return db_tarjet;
}


//--------------------Metodo VISUALIZAR HISTORIAL TRANSACCIONES
  const historialtransaccion = async (datoconsulta) => {

  let result_histtrans = db_histrans.filter(
      tarjeta=>(tarjeta.nro_tarjeta_propia==Number(datoconsulta.nro_tarjeta)));
  
  return result_histtrans;
  }  


//?Exportar metodos.
module.exports = {
    transaccion , historialtransaccion , logueo
  }
