var //TrabajoView = require('../views/ejemploVista'),
    TrabajoModel = require('../models/dataAccess2'),
    moment = require('moment'),
    PDFDocument = require('pdfkit'),
    fecha = require("fecha");

    fecha.i18n = {
    	monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviember', 'Diciembre']
    }

var Reporte = function(conf) {
    this.conf = conf || {};

    //this.view = new TrabajoView();
    this.model = new TrabajoModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    }
}

Reporte.prototype.get_conformidadpdf = function(req, res, next) {
    var self = this;
    var params = [];
    var data = {};
    // if (req.query.noReporte, ...) { Validacion de campos
		    data = {
		        noReporte: req.query.noReporte,
						solpe: req.query.solpe,
		        ordenSurtimiento: req.query.ordenSurtimiento,
		        montoOS: req.query.montoOS,
		        pedidoAsociado: req.query.pedidoAsociado,

            nombreEmisor: req.query.nombreEmisor,
		        nombreProveedor: req.query.nombreProveedor,
		        puestoProveedor: req.query.puestoProveedor,
		        fecha: new Date()
		    }

		    //this.model.query('NOMBRE DEL_SP', params, function(error, result) { Se obtinen los datos asociados
						//Result de prueba sustituir por datos reales
						result = []
						result.push({partida:1,descripcion:"Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto",cantidad:1,unidad:"Vehiculo",noRemFac:"R216115",fecha:"06/06/2016",importe:"166,520.38 USD"})
            result.push({partida:2,descripcion:"Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto",cantidad:1,unidad:"Vehiculo",noRemFac:"R216115",fecha:"06/06/2016",importe:"166,520.38 USD"})
            result.push({partida:3,descripcion:"Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto",cantidad:1,unidad:"Vehiculo",noRemFac:"R216115",fecha:"06/06/2016",importe:"166,520.38 USD"})
            data.data = result;
            data.total = "$520,2020.20 UDS";
						generateConfomidadReporte(data,res)

		    //});
    //}
}
module.exports = Reporte;

function generateConfomidadReporte(data,res) {
    var paginas = 0;
    var initTabla = 0;
    var doc = new PDFDocument({size: [612.00, 792.00],margin:30} )
		doc.pipe(res)
		doc.fontSize(7)
		doc.lineWidth(1)

    doc.rect(30, 40, 555, 700).stroke()
		doc.rect(40, 50, 535, 680).stroke()

    doc.image('app/static/image/pemex_logo.png', 50, 55,{width: 90,height:45} )

		doc.text("FI-001",290,70)
		doc.text("\"REPORTE DE CONFORMIDAD \"",255,80)

		doc.text("ORGANISMO: PEMEX REFINACIÓN",50,110)
		doc.text("GERENCIA: PEMEX LOGISTICA",50,124)
		doc.text("SUBGERENCIA:",50,146)
		doc.text("SUPTCIA/DEPTO: Terminales de Almacenamieto y Reparto ",50,167)
		doc.text("de la SAR de Pemex Refinación ",50,176)

		doc.rect(48, 107, 210, 12).stroke()
		doc.rect(48, 119, 210, 22).stroke()
		doc.rect(48, 141, 210, 22).stroke()
		doc.rect(48, 163, 210, 22).stroke()

		doc.text("CONTRATO: 5100305278 ",50,198)
		doc.text("SOLPE: " + data.solpe ,50,210)
		doc.text("ORDEN DE SURTIMEINTO: " + data.ordenSurtimiento ,50,222)
		doc.text("MONTO DEL CONTRATO: $6,523,479,00 USD " ,50,234)
		doc.text("MONTO OS: " +  data.montoOS ,50,246)
		doc.text("PEDIDO ASOCIADO: " +  data.pedidoAsociado ,50,258)

		doc.rect(48, 195, 180, 12).stroke()
		doc.rect(48, 207, 180, 12).stroke()
		doc.rect(48, 219, 180, 12).stroke()
		doc.rect(48, 231, 180, 12).stroke()
		doc.rect(48, 243, 180, 12).stroke()
		doc.rect(48, 255, 180, 12).stroke()

    doc.text("REPORTE No.  ___________________________",400,88)
    doc.text(data.noReporte,490,88)
		doc.text("LUGAR:  ________________________________________________________",310,110)
		doc.fontSize(4);
		doc.text("DIA                      MES                  AÑO",485,123)
		doc.fontSize(7);
		doc.text("Mexico D.F.",400,110)
    doc.text(fecha.format(data.fecha, 'DD           MMMM      YYYY'),410,110,{width: 220,align: 'center'})
		doc.text("FECHA RECIBO DE SOLICITUD DE INSPECCIÓN:  _____________________",310,132)
		doc.fontSize(4);
		doc.text("DIA                      MES                  AÑO",485,145)
		doc.fontSize(7);

    doc.text(fecha.format(data.fecha, 'DD           MMMM      YYYY'),410,132,{width: 220,align: 'center'})
		doc.text("FECHA DE FORMALIZACIÓN DEL CONTRATO:      _____________________",310,155)
		doc.fontSize(4);
		doc.text("DIA                      MES                  AÑO",485,168)
    doc.fontSize(7);
    doc.text("09    Noviembre   2015",485,155)

		doc.text("FECHA DE RECEPCIÓN DE CONTRATO/S:             _____________________",310,177)
    doc.text("09    Noviembre   2015",485,177)


		doc.rect(320, 195, 234, 12).stroke()
		doc.rect(320, 207, 234, 12).stroke()
		doc.rect(320, 219, 90, 12).stroke()
		doc.rect(410, 219, 144, 12).stroke()
		doc.rect(320, 231, 90, 12).stroke()
		doc.rect(410, 231, 144, 12).stroke()

    doc.text("RAZON SOCIAL",415,198)
    doc.text("SYM SERVICIOS INTEGRALES SA DE CV",375,210)
    doc.text("RFC" , 485,222)
    doc.text("CLAVE PROVEEDOR" ,332,222)

    doc.text("1020236" ,345,234)
    doc.text("SSI070607P46" , 470,234)

    doc.rect(48, 275, 30, 14).stroke()
    doc.rect(78, 275, 150, 14).stroke()
    doc.rect(228, 275, 30, 14).stroke()
    doc.rect(258, 275, 62, 14).stroke()
    doc.rect(320, 275, 62, 14).stroke()
    doc.rect(382, 275, 62, 14).stroke()
    doc.rect(444, 275, 110, 14).stroke()

    doc.fontSize(5);
    doc.text("PARTIDA O POSICIÓN",50,278,{width: 30})
    doc.text("DESCRIPCION DEL BIEN O SERVICIO",80,280,{width: 150,align: 'center'})
    doc.text("CANTIDAD",228,280,{width: 30,align: 'center'})
    doc.text("UNIDAD",258,280,{width: 62,align: 'center'})
    doc.text("NO. DE REMISIÓN Y/O FACTURA",320,278,{width: 62,align: 'center'})
    doc.text("FECHA DE INSPECCIÓN O SUPERVISIÓN",382,278,{width: 63,align: 'center'})
    doc.text("IMPORTE DE LOS INSPECCIONADO O SUPERVISADO",444,278,{width: 110,align: 'center'})

    doc.fontSize(7);
    var tableHeight = 0, extra =0;
    for(var i in data.data){
        var top = 0;
        var salto = 0;
        var skip = 9;
        for (j=0;j<i;j++){
          top += Math.ceil(data.data[j].descripcion.length/48)+1
        }
        tableHeight = ((skip*(top+Math.ceil(data.data[i].descripcion.length/48)+1))+salto)+(extra*paginas)
        if(tableHeight > 400){
          extra = tableHeight-265;
          var secondTable = 0 ;
          if(paginas > 0 ) secondTable = 230;
          doc.rect(48, 289-secondTable, 30, 250+extra+secondTable).stroke()
          doc.rect(78, 289-secondTable, 150, 250+extra+secondTable).stroke()
          doc.rect(228, 289-secondTable, 30, 250+extra+secondTable).stroke()
          doc.rect(258, 289-secondTable, 62, 250+extra+secondTable).stroke()
          doc.rect(320, 289-secondTable, 62, 250+extra+secondTable).stroke()
          doc.rect(382, 289-secondTable, 62, 250+extra+secondTable).stroke()
          doc.rect(444, 289-secondTable, 110, 250+extra+secondTable).stroke()
          doc.text("SI LOS SELLOS EN ESTE DOCUMENTO NO ESTAN EN ORIGINAL, NO ES UN DOCUMENTO CONTROLADO",30,745)
          doc.addPage();
          paginas++;
          extra = -600;
          tableHeight = ((skip*(top+Math.ceil(data.data[i].descripcion.length/48)+1))+salto)+(extra*paginas)
          doc.rect(30, 40, 555, 700).stroke()
          doc.rect(40, 50, 535, 680).stroke()
        }
        doc.text(data.data[i].partida,50,(295+(skip*top)+salto)+(extra*paginas),{width: 30,align: 'center'})
        doc.text(data.data[i].descripcion,85,(295+(skip*top)+salto)+(extra*paginas),{width: 135,align: 'justify'})
        doc.text(data.data[i].cantidad,228,(295+(skip*top)+salto)+(extra*paginas),{width: 30,align: 'center'})
        doc.text(data.data[i].unidad,258,(295+(skip*top)+salto)+(extra*paginas),{width: 62,align: 'center'})
        doc.text(data.data[i].noRemFac,320,(295+(skip*top)+salto)+(extra*paginas),{width: 62,align: 'center'})
        doc.text(data.data[i].fecha,382,(295+(skip*top)+salto)+(extra*paginas),{width: 63,align: 'center'})
        doc.text(data.data[i].importe,444,(295+(skip*top)+salto)+(extra*paginas),{width: 100,align:'right'})
    }
    if(paginas>0){
      extra = tableHeight -240;

      initTabla = 230;
    }
      if(tableHeight>250)
        extra = tableHeight-250;
    doc.rect(48, 289-initTabla, 30, 250+extra+initTabla).stroke()
    doc.rect(78, 289-initTabla, 150, 250+extra+initTabla).stroke()
    doc.rect(228, 289-initTabla, 30, 250+extra+initTabla).stroke()
    doc.rect(258, 289-initTabla, 62, 250+extra+initTabla).stroke()
    doc.rect(320, 289-initTabla, 62, 250+extra+initTabla).stroke()
    doc.rect(382, 289-initTabla, 62, 250+extra+initTabla).stroke()
    doc.rect(444, 289-initTabla, 110, 250+extra+initTabla).stroke()

    doc.rect(48, 539+extra, 334, 12).stroke()
    doc.rect(382, 539+extra, 62, 12).stroke()
    doc.rect(444, 539+extra, 110, 12).stroke()
    doc.rect(48, 551+extra, 334, 26).stroke()

    doc.fontSize(4);
    doc.text("DESCRIPCION DE CONFORMIDAD:",50,542+extra)
    doc.fontSize(5);
    doc.text("*SE EXIME DE TODA RESPONSABILIDAD AL PERSONAL QUE EMITE ESTE REPORTE DE CONFORMIDAD,"+
    "CUANDO A LA ENTREGA DE LOS BIENES, ARRENDAMIENTOS O SERVICIOS EN DESTINO FINAL O EN LA OPERACION"+
    "SE DETERMINEN FALTANTES, AVERÍAS, DISCREPANCIAS, ENTREGAS INCOMPLETAS, O SE DETECTEN FALLAS O VICIOS"+
    "OCUALTOS DE ACUERDO CON LO ESTABLECIDO EN EL CONTRATO.",50,554+extra,{width: 330})
    doc.fontSize(7);
    doc.text("TOTAL",382,542+extra,{width: 62,align:'center'})
    doc.text(data.total,444,542+extra,{width: 100,align:'right'})
    if(/*paginas == 0 && */tableHeight>270){
      doc.text("SI LOS SELLOS EN ESTE DOCUMENTO NO ESTAN EN ORIGINAL, NO ES UN DOCUMENTO CONTROLADO",30,745)
      doc.addPage();
      doc.rect(30, 40, 555, 700).stroke()
      doc.rect(40, 50, 535, 680).stroke()
      extra = -520
    }
    doc.rect(48, 590+extra, 272, 90).stroke()
    doc.rect(320, 590+extra, 234, 90).stroke()
    doc.text("EMISIÓN POR PARTE DE PEMEX:",50,600+extra,{width: 270,align: 'center'})
    doc.text("NOMBRE Y FIRMA _______________________________________________",55,625+extra)
    doc.text("FECHA                    _______________________________________________",55,642+extra)
    doc.fontSize(5);
    doc.text("SELLO: (cuando aplique)",55,659+extra)
    doc.fontSize(7);
    doc.text(data.nombreEmisor,100,625+extra,{width: 220,align: 'center'})
    doc.text(fecha.format(data.fecha, 'DD  MMMM  YYYY'),100,642+extra,{width: 220,align: 'center'})
    doc.text("ACEPTACIÓN DEL PROVEEDOR:",325,600+extra,{width: 230,align: 'center'})
    doc.text("NOMBRE Y FIRMA ________________________________________",326,625+extra)
    doc.text("FECHA                    ________________________________________",326,642+extra)
    doc.text("PUESTO                 ________________________________________",326,659+extra)

    doc.text(data.nombreProveedor,340,625+extra,{width: 220,align: 'center'})
    doc.text(fecha.format(data.fecha, 'DD  MMMM  YYYY'),340,642+extra,{width: 220,align: 'center'})
    doc.text(data.puestoProveedor,340,659+extra,{width: 220,align: 'center'})
    doc.fontSize(5);
    doc.text("*ESTE REPORTE TIENE UNA VIGENCIA DE 15 DIAS CALENDARIO A PARTIR DE SU EXPEDICIÓN",50,685+extra)
    doc.fontSize(7);
    doc.text("SI LOS SELLOS EN ESTE DOCUMENTO NO ESTAN EN ORIGINAL, NO ES UN DOCUMENTO CONTROLADO",30,745)
		doc.end();
}
