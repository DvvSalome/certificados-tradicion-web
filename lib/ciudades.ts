// Datos de las páginas por ciudad (SEO programático). Contenido generado con el workflow ciudades-ctl.
// La ruta /certificado-tradicion-libertad/[ciudad] renderiza esto.
export interface CiudadOficina { nombre: string; codigo: string }
export interface Ciudad {
  slug: string;
  ciudad: string;
  departamento: string;
  oficinas: CiudadOficina[];
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  comoObtener: string;
  faqs: { q: string; a: string }[];
}

export const CIUDADES: Ciudad[] = [
  {
    "slug": "armenia",
    "ciudad": "Armenia",
    "departamento": "Quindío",
    "oficinas": [
      {
        "nombre": "ARMENIA",
        "codigo": "280"
      }
    ],
    "metaTitle": "Certificado de Tradición Armenia (Quindío) en línea",
    "metaDescription": "Saca tu Certificado de Tradición y Libertad de un inmueble en Armenia, Quindío, en línea. Pago seguro por Wompi y entrega en minutos a tu correo. Sin filas.",
    "h1": "Certificado de Tradición y Libertad en Armenia (Quindío)",
    "intro": "Si vas a comprar, vender, hipotecar o avalar un inmueble en Armenia o en municipios del Quindío como Calarcá, La Tebaida o Montenegro, el Certificado de Tradición y Libertad es el documento que muestra la historia jurídica del predio: dueños, hipotecas, embargos y medidas vigentes. Toda esa información se centraliza en la Oficina de Registro de Instrumentos Públicos de Armenia. Con Certitradición lo gestionamos por ti en línea, pagas seguro por Wompi y lo recibes en tu correo en minutos, sin desplazarte.",
    "comoObtener": "Cada inmueble del área urbana y rural de Armenia y su zona registral está matriculado en la Oficina de Registro de Instrumentos Públicos de Armenia (código 280), donde reposan los folios de matrícula del Quindío. Para pedirlo solo necesitas el número de matrícula inmobiliaria que aparece en escrituras, predial o el certificado anterior. Con Certitradición ingresas esa matrícula, pagas seguro por Wompi ($39.900) y recibes el PDF oficial en tu correo en minutos, sin filas ni traslados a la oficina. Como gestor privado tramitamos el certificado en tu nombre ante el sistema de registro; no somos el canal oficial de la SNR.",
    "faqs": [
      {
        "q": "¿Cuál es la Oficina de Registro de Instrumentos Públicos de Armenia y su código?",
        "a": "Los inmuebles ubicados en Armenia se registran en la Oficina de Registro de Instrumentos Públicos de Armenia, identificada con el código 280. Allí reposan los folios de matrícula del Quindío sobre los que se expide el Certificado de Tradición y Libertad."
      },
      {
        "q": "¿Cuánto cuesta el Certificado de Tradición de un inmueble en Armenia?",
        "a": "El servicio de gestión de Certitradición cuesta $39.900 COP, pago único por Wompi. Incluye la generación en línea del certificado oficial y la entrega del PDF a tu correo en minutos. La tarifa oficial del Estado la define por separado la SNR."
      },
      {
        "q": "¿Tengo que ir presencialmente a la oficina de registro en Armenia?",
        "a": "No. Con Certitradición todo se hace en línea desde cualquier lugar del Quindío o del país: ingresas la matrícula inmobiliaria, pagas seguro y recibes el certificado en tu correo. No necesitas desplazarte ni hacer filas en la oficina de Armenia."
      }
    ]
  },
  {
    "slug": "barranquilla",
    "ciudad": "Barranquilla",
    "departamento": "Atlántico",
    "oficinas": [
      {
        "nombre": "BARRANQUILLA",
        "codigo": "040"
      }
    ],
    "metaTitle": "Certificado de Tradición Barranquilla en línea | $39.900",
    "metaDescription": "Genera tu Certificado de Tradición y Libertad de Barranquilla 100% en línea por $39.900. PDF oficial en minutos a tu correo, sin filas. Paga seguro con Wompi.",
    "h1": "Certificado de Tradición y Libertad en Barranquilla",
    "intro": "Si tu inmueble está en Barranquilla, su historial jurídico reposa en la Oficina de Registro de Instrumentos Públicos de Barranquilla (código 040), que cubre el Distrito y buena parte del Atlántico. Con Certitradición obtienes el Certificado de Tradición y Libertad en línea, sin desplazarte ni hacer fila. Pagas $39.900 por Wompi y en minutos recibes en tu correo el PDF oficial, con validez de 30 días, listo para una compraventa, un crédito o un trámite notarial en la ciudad.",
    "comoObtener": "El certificado de un predio barranquillero se expide a partir del folio de matrícula inmobiliaria asignado por la Oficina de Registro de Instrumentos Públicos de Barranquilla (código 040), que concentra los inmuebles del Distrito y municipios del Atlántico vinculados a ese círculo registral. Solo necesitas el número de matrícula. En Certitradición lo ingresas, pagas $39.900 con Wompi y recibes el documento PDF en tu correo en minutos. Somos un gestor privado que tramita el certificado en línea por ti: nada de filas ni desplazamientos a la oficina.",
    "faqs": [
      {
        "q": "¿Cuál es la oficina de registro de Barranquilla y su código?",
        "a": "Es la Oficina de Registro de Instrumentos Públicos de Barranquilla, identificada con el código 040. Allí reposan los folios de matrícula de los inmuebles del Distrito de Barranquilla y de varios municipios del Atlántico que pertenecen a ese círculo registral."
      },
      {
        "q": "¿Cuánto cuesta el certificado de tradición en Barranquilla?",
        "a": "Con Certitradición el servicio cuesta $39.900 COP y lo pagas de forma segura con Wompi. Recibes en minutos el PDF oficial del Certificado de Tradición y Libertad en tu correo, con validez de 30 días para usarlo en tus trámites."
      },
      {
        "q": "¿Tengo que ir presencialmente a la oficina en Barranquilla?",
        "a": "No. Con Certitradición todo el proceso es en línea: ingresas la matrícula del inmueble, pagas con Wompi y recibes el certificado en tu correo en minutos. Somos un gestor privado, así que te ahorras filas y desplazamientos a la oficina de registro."
      }
    ]
  },
  {
    "slug": "bogota",
    "ciudad": "Bogotá",
    "departamento": "Cundinamarca",
    "oficinas": [
      {
        "nombre": "BOGOTA ZONA CENTRO",
        "codigo": "50C"
      },
      {
        "nombre": "BOGOTA ZONA NORTE",
        "codigo": "50N"
      },
      {
        "nombre": "BOGOTA ZONA SUR",
        "codigo": "50S"
      }
    ],
    "metaTitle": "Certificado de Tradición Bogotá En Línea | Certitradición",
    "metaDescription": "Solicita el Certificado de Tradición y Libertad de tu inmueble en Bogotá 100% en línea. Lo recibes en tu correo en minutos por $39.900. Sin filas ni desplazamientos.",
    "h1": "Certificado de Tradición y Libertad en Bogotá",
    "intro": "Si tu inmueble está en Bogotá, su historia jurídica reposa en una de las tres Oficinas de Registro de Instrumentos Públicos de la capital. El Certificado de Tradición y Libertad reúne titulares, hipotecas, embargos y gravámenes asociados a ese predio. En Certitradición, gestor privado independiente de la Superintendencia de Notariado y Registro, lo tramitamos en línea por ti: pagas con Wompi y recibes el documento PDF oficial en tu correo en minutos, sin filas ni traslados por la ciudad.",
    "comoObtener": "Todo inmueble en Bogotá está adscrito a una de las tres oficinas de registro de la ciudad: Bogotá Zona Centro (código 50C), Bogotá Zona Norte (código 50N) o Bogotá Zona Sur (código 50S), según la ubicación del predio. Para obtener el certificado solo necesitas el número de matrícula inmobiliaria. Con Certitradición no tienes que averiguar cuál oficina te corresponde ni desplazarte: ingresas la matrícula, pagas $39.900 con Wompi y nosotros gestionamos la solicitud en línea. Recibes el PDF oficial en tu correo en minutos, sin filas y sin trámites presenciales.",
    "faqs": [
      {
        "q": "¿Cuál es la oficina de registro de Bogotá y su código?",
        "a": "Bogotá tiene tres oficinas de registro: Bogotá Zona Centro (código 50C), Bogotá Zona Norte (código 50N) y Bogotá Zona Sur (código 50S). El inmueble se asigna a una según su ubicación, pero con Certitradición no necesitas saber a cuál corresponde."
      },
      {
        "q": "¿Cuánto cuesta el certificado de tradición de un inmueble en Bogotá?",
        "a": "El servicio de gestión en línea de Certitradición cuesta $39.900 COP, que pagas de forma segura con Wompi. Recibes el documento PDF oficial en tu correo en minutos, con validez de 30 días desde su expedición."
      },
      {
        "q": "¿Tengo que ir presencialmente a una oficina en Bogotá?",
        "a": "No. Con Certitradición todo el trámite es en línea: ingresas la matrícula del inmueble, pagas con Wompi y recibes el certificado en tu correo en minutos. Evitas filas, desplazamientos y horarios de atención presencial en la capital."
      }
    ]
  },
  {
    "slug": "bucaramanga",
    "ciudad": "Bucaramanga",
    "departamento": "Santander",
    "oficinas": [
      {
        "nombre": "BUCARAMANGA",
        "codigo": "300"
      }
    ],
    "metaTitle": "Certificado de Tradición Bucaramanga | En línea",
    "metaDescription": "Saca el Certificado de Tradición y Libertad de tu inmueble en Bucaramanga (ORIP 300) en línea con Certitradición. PDF oficial en minutos por $39.900. Sin filas.",
    "h1": "Certificado de Tradición y Libertad en Bucaramanga",
    "intro": "Si tu predio, apartamento o lote está ubicado en Bucaramanga, su historial jurídico se lleva en la Oficina de Registro de Instrumentos Públicos de Bucaramanga (código 300), de la Superintendencia de Notariado y Registro. Con Certitradición obtienes el Certificado de Tradición y Libertad de la capital santandereana en línea: solicitas, pagas con Wompi y recibes el PDF oficial en tu correo en minutos. Somos un gestor privado que agiliza el trámite por ti, no el canal estatal, pero entregamos el mismo documento con validez de 30 días.",
    "comoObtener": "El inmueble ubicado en Bucaramanga está matriculado en la Oficina de Registro de Instrumentos Públicos de Bucaramanga, ORIP código 300, que cubre la capital de Santander y su área metropolitana. Para pedir el certificado solo necesitas el número de matrícula inmobiliaria (que empieza por 300) o la dirección del predio. Con Certitradición lo haces 100% en línea, sin desplazarte hasta la oficina del centro ni hacer filas: diligencias el formulario, pagas $39.900 por Wompi y, en pocos minutos, recibes el PDF oficial en tu correo, listo para escriturar, solicitar crédito o verificar gravámenes.",
    "faqs": [
      {
        "q": "¿Cuál es la oficina de registro de Bucaramanga y su código?",
        "a": "Los inmuebles de Bucaramanga se registran en la Oficina de Registro de Instrumentos Públicos de Bucaramanga, con código ORIP 300. Por eso la matrícula inmobiliaria de los predios de la ciudad y su área metropolitana inicia con 300."
      },
      {
        "q": "¿Cuánto cuesta el certificado de tradición en Bucaramanga?",
        "a": "Con Certitradición el servicio cuesta $39.900 COP, pago único por Wompi. Incluye la gestión en línea y el envío del PDF oficial a tu correo en minutos, sin que tengas que ir a la oficina ORIP 300 de Bucaramanga."
      },
      {
        "q": "¿Tengo que ir personalmente a la oficina en Bucaramanga?",
        "a": "No. Aunque tu inmueble pertenezca a la ORIP 300 de Bucaramanga, con Certitradición todo el trámite es en línea. Diligencias tus datos, pagas y recibes el certificado por correo, sin filas ni desplazamientos hasta el centro de la ciudad."
      }
    ]
  },
  {
    "slug": "cali",
    "ciudad": "Cali",
    "departamento": "Valle del Cauca",
    "oficinas": [
      {
        "nombre": "CALI",
        "codigo": "370"
      }
    ],
    "metaTitle": "Certificado de Tradición Cali en línea | Certitradición",
    "metaDescription": "Obtén el Certificado de Tradición y Libertad de tu inmueble en Cali sin filas. Documento PDF oficial en minutos, por $39.900 y pago seguro con Wompi.",
    "h1": "Certificado de Tradición y Libertad en Cali",
    "intro": "Si tu inmueble está en Cali —barrios como Granada, El Peñón, Ciudad Jardín o el sur de la ciudad— su historial jurídico se registra en la Oficina de Registro de Instrumentos Públicos de Cali. Con Certitradición solicitas el Certificado de Tradición y Libertad en línea, pagas por Wompi y recibes el PDF oficial en tu correo en minutos. Somos un gestor privado que agiliza el trámite por ti, sin filas ni desplazamientos hasta la ORIP del Valle del Cauca, y con la misma validez legal del documento.",
    "comoObtener": "Todo inmueble en Cali está inscrito en la Oficina de Registro de Instrumentos Públicos de Cali (código 370), donde reposa su folio de matrícula inmobiliaria. Para obtener el certificado solo necesitas ese número de matrícula (los predios urbanos de Cali suelen iniciar con el prefijo 370). En lugar de acudir presencialmente a la ORIP del Valle del Cauca y hacer fila, con Certitradición lo solicitas en línea: ingresas la matrícula, pagas $39.900 con Wompi y recibes el PDF oficial en tu correo en pocos minutos, listo para escriturar, vender o tramitar un crédito.",
    "faqs": [
      {
        "q": "¿Cuál es la oficina de registro de Cali y su código?",
        "a": "Los inmuebles de Cali se registran en la Oficina de Registro de Instrumentos Públicos de Cali, identificada con el código 370. Allí reposa el folio de matrícula de cada predio del Distrito de Cali, en el Valle del Cauca."
      },
      {
        "q": "¿Cuánto cuesta el certificado de tradición en Cali?",
        "a": "Con Certitradición el servicio de gestión en línea cuesta $39.900 COP, con pago seguro mediante Wompi. Recibes el Certificado de Tradición y Libertad en formato PDF oficial directamente en tu correo, normalmente en cuestión de minutos."
      },
      {
        "q": "¿Tengo que ir presencialmente a la oficina en Cali?",
        "a": "No es necesario. Con Certitradición realizas todo el trámite del Certificado de Tradición y Libertad en línea, sin filas ni desplazamientos hasta la oficina de Cali. Solo necesitas el número de matrícula inmobiliaria del predio."
      }
    ]
  },
  {
    "slug": "cartagena",
    "ciudad": "Cartagena",
    "departamento": "Bolívar",
    "oficinas": [
      {
        "nombre": "CARTAGENA",
        "codigo": "060"
      }
    ],
    "metaTitle": "Certificado de Tradición Cartagena en línea | Certitradición",
    "metaDescription": "Obtén el Certificado de Tradición y Libertad de tu inmueble en Cartagena en línea, sin filas. PDF oficial en minutos por $39.900. Oficina código 060.",
    "h1": "Certificado de Tradición y Libertad en Cartagena (Bolívar)",
    "intro": "¿Necesitas el Certificado de Tradición y Libertad de un predio en Cartagena? Ya sea un apartamento en Bocagrande, una casa en el Centro Histórico o un lote en La Boquilla, su historial jurídico se inscribe en la Oficina de Registro de Instrumentos Públicos de Cartagena (código 060). En Certitradición, gestor privado independiente, generamos ese documento en línea por ti: pagas de forma segura por Wompi y recibes el PDF oficial en tu correo en minutos, sin desplazarte ni hacer filas.",
    "comoObtener": "Todo inmueble ubicado en Cartagena y su área de influencia tiene su folio de matrícula inmobiliaria radicado en la Oficina de Registro de Instrumentos Públicos de Cartagena (código 060). Para obtener el Certificado de Tradición y Libertad solo necesitas el número de matrícula del predio. Con Certitradición lo solicitas en línea: ingresas la matrícula, pagas $39.900 por Wompi y recibimos el documento PDF oficial directo en tu correo en minutos. Así evitas trasladarte hasta la oficina, hacer filas y perder tiempo en trámites presenciales.",
    "faqs": [
      {
        "q": "¿Cuál es la Oficina de Registro de Cartagena y su código?",
        "a": "Los inmuebles de Cartagena se registran en la Oficina de Registro de Instrumentos Públicos de Cartagena, identificada con el código 060. Allí reposa el folio de matrícula inmobiliaria de cada predio del distrito y su zona de influencia en Bolívar."
      },
      {
        "q": "¿Cuánto cuesta el Certificado de Tradición en Cartagena?",
        "a": "Con Certitradición el servicio tiene un costo único de $39.900 COP, que pagas de forma segura por Wompi. Recibes el documento PDF oficial en tu correo en minutos, con validez de 30 días desde su expedición."
      },
      {
        "q": "¿Tengo que ir presencialmente a la oficina en Cartagena?",
        "a": "No. Somos un gestor privado y todo el trámite es en línea: no necesitas desplazarte a la oficina de la Calle 30 ni hacer filas. Solicitas, pagas por Wompi y recibes tu certificado en el correo en minutos."
      }
    ]
  },
  {
    "slug": "cucuta",
    "ciudad": "Cúcuta",
    "departamento": "Norte de Santander",
    "oficinas": [
      {
        "nombre": "CUCUTA",
        "codigo": "260"
      }
    ],
    "metaTitle": "Certificado de Tradición Cúcuta | En línea",
    "metaDescription": "Obtén el Certificado de Tradición y Libertad de tu inmueble en Cúcuta en línea. Pago seguro por Wompi, PDF oficial en minutos. Sin filas. $39.900.",
    "h1": "Certificado de Tradición y Libertad en Cúcuta",
    "intro": "¿Necesitas el Certificado de Tradición y Libertad de un predio ubicado en Cúcuta o en algún municipio de Norte de Santander? Con Certitradición lo generas en línea, sin desplazarte hasta la Oficina de Registro de Instrumentos Públicos de Cúcuta. Solo necesitas el número de matrícula inmobiliaria del inmueble. Pagas de forma segura por Wompi y recibes el documento PDF oficial en tu correo en cuestión de minutos, listo para trámites de compraventa, hipoteca, sucesión o crédito en la frontera.",
    "comoObtener": "Los inmuebles de Cúcuta y su zona de influencia se inscriben en la Oficina de Registro de Instrumentos Públicos de Cúcuta, identificada con el código 260. Tradicionalmente tocaba acercarse a esa oficina y hacer fila para solicitar el certificado del folio. Con Certitradición evitas ese trámite presencial: ingresas el número de matrícula inmobiliaria del predio, pagas $39.900 por Wompi y recibimos tu solicitud de inmediato. En pocos minutos te llega a tu correo el Certificado de Tradición y Libertad en PDF, oficial y con validez de 30 días.",
    "faqs": [
      {
        "q": "¿Cuál es la oficina de registro para inmuebles de Cúcuta y su código?",
        "a": "Los predios de Cúcuta y municipios de su jurisdicción se registran en la Oficina de Registro de Instrumentos Públicos de Cúcuta, código 260. Esa oficina custodia el folio de matrícula que respalda el Certificado de Tradición y Libertad de tu inmueble."
      },
      {
        "q": "¿Cuánto cuesta el certificado en Cúcuta con Certitradición?",
        "a": "El servicio de gestión en línea de Certitradición cuesta $39.900 COP, que pagas de forma segura mediante Wompi. Por ese valor procesamos tu solicitud y te enviamos el Certificado de Tradición y Libertad en PDF oficial a tu correo en minutos."
      },
      {
        "q": "¿Tengo que ir presencialmente a la oficina en Cúcuta?",
        "a": "No es necesario. Con Certitradición todo el proceso es en línea: no haces filas ni te desplazas a la oficina de Cúcuta. Solo necesitas el número de matrícula del inmueble y recibes el documento en tu correo desde cualquier lugar."
      }
    ]
  },
  {
    "slug": "ibague",
    "ciudad": "Ibagué",
    "departamento": "Tolima",
    "oficinas": [
      {
        "nombre": "IBAGUE",
        "codigo": "350"
      }
    ],
    "metaTitle": "Certificado de Tradición Ibagué | En línea $39.900",
    "metaDescription": "Obtén el Certificado de Tradición y Libertad de tu inmueble en Ibagué (Tolima) en línea. Documento PDF oficial en minutos, sin filas. Pago seguro por Wompi: $39.900.",
    "h1": "Certificado de Tradición y Libertad en Ibagué (Tolima)",
    "intro": "Si compras, vendes o hipotecas un inmueble en Ibagué —desde el centro histórico hasta barrios como Piedrapintada, El Salado o la zona de la Calle 60— necesitas el Certificado de Tradición y Libertad. Este documento muestra la historia jurídica del predio: dueños, hipotecas, embargos y limitaciones. En Certitradición lo gestionamos por ti en línea, vinculado a la Oficina de Registro de Instrumentos Públicos de Ibagué, para que lo recibas en tu correo en pocos minutos.",
    "comoObtener": "Todo inmueble en Ibagué está matriculado en la Oficina de Registro de Instrumentos Públicos de Ibagué (código 350), que cubre la capital del Tolima y su área de influencia. Para obtener el certificado necesitas el número de matrícula inmobiliaria del predio (lo encuentras en escrituras o recibos del impuesto predial). Con Certitradición no haces fila ni te desplazas: ingresas la matrícula, pagas de forma segura por Wompi y recibes el documento PDF oficial en tu correo en minutos, listo para trámites notariales, bancarios o de compraventa.",
    "faqs": [
      {
        "q": "¿Cuál es la oficina de registro que cubre los inmuebles de Ibagué?",
        "a": "Los predios de Ibagué se registran en la Oficina de Registro de Instrumentos Públicos de Ibagué, identificada con el código 350. Allí se concentra la información jurídica de los inmuebles de la capital del Tolima y su zona de influencia."
      },
      {
        "q": "¿Cuánto cuesta el certificado de tradición en Ibagué con Certitradición?",
        "a": "El servicio de gestión en línea de Certitradición tiene un costo de $39.900 COP. Pagas de forma segura por Wompi y recibes el Certificado de Tradición y Libertad en PDF oficial, con validez de 30 días, directamente en tu correo electrónico."
      },
      {
        "q": "¿Tengo que ir presencialmente a la oficina en Ibagué?",
        "a": "No es necesario. Con Certitradición todo el proceso es en línea: no haces filas ni te desplazas a la oficina. Ten en cuenta que somos un gestor privado, no el canal oficial de la Superintendencia de Notariado y Registro."
      }
    ]
  },
  {
    "slug": "manizales",
    "ciudad": "Manizales",
    "departamento": "Caldas",
    "oficinas": [
      {
        "nombre": "MANIZALES",
        "codigo": "100"
      }
    ],
    "metaTitle": "Certificado de Tradición Manizales en línea | Certitradición",
    "metaDescription": "Obtén el Certificado de Tradición y Libertad de tu inmueble en Manizales en línea. Pagas por Wompi y lo recibes en tu correo en minutos. PDF oficial por $39.900.",
    "h1": "Certificado de Tradición y Libertad en Manizales",
    "intro": "Si tu inmueble está en Manizales o en algún municipio de Caldas que registra ante esta oficina, el Certificado de Tradición y Libertad es el documento que muestra quién es el dueño, los gravámenes y la historia jurídica del predio. En Certitradición lo gestionamos por ti completamente en línea: solo necesitas el número de matrícula inmobiliaria. Pagas de forma segura por Wompi y recibes el PDF en tu correo en pocos minutos, sin filas ni desplazamientos por la ciudad.",
    "comoObtener": "Para obtener el CTL de un inmueble ubicado en Manizales necesitas el número de matrícula inmobiliaria, que administra la Oficina de Registro de Instrumentos Públicos de Manizales (código 100), encargada de los predios de la capital de Caldas. Puedes tramitarlo presencialmente en esa oficina o solicitarlo en línea. Con Certitradición lo haces desde tu celular o computador: ingresas la matrícula, pagas por Wompi y recibimos por ti el certificado para enviártelo al correo en minutos, sin filas ni trámites en ventanilla.",
    "faqs": [
      {
        "q": "¿Cuál es la oficina de registro del inmueble en Manizales y su código?",
        "a": "Los predios de Manizales se inscriben en la Oficina de Registro de Instrumentos Públicos de Manizales, identificada con el código 100. Allí reposa el folio de matrícula inmobiliaria que da origen al Certificado de Tradición y Libertad de cada inmueble."
      },
      {
        "q": "¿Cuánto cuesta el Certificado de Tradición y Libertad en Manizales?",
        "a": "El servicio de gestión en línea de Certitradición tiene un valor de $39.900 COP, que pagas de forma segura por Wompi. Recibes el documento PDF oficial en tu correo en minutos, con una vigencia de 30 días desde su expedición."
      },
      {
        "q": "¿Tengo que ir presencialmente a la oficina en Manizales?",
        "a": "No es necesario. Aunque puedes acudir a la oficina código 100, con Certitradición el trámite es totalmente en línea: ingresas la matrícula, pagas por Wompi y recibes el certificado en tu correo, evitando filas y desplazamientos por la ciudad."
      }
    ]
  },
  {
    "slug": "medellin",
    "ciudad": "Medellín",
    "departamento": "Antioquia",
    "oficinas": [
      {
        "nombre": "MEDELLIN NORTE",
        "codigo": "01N"
      },
      {
        "nombre": "MEDELLIN SUR",
        "codigo": "001"
      }
    ],
    "metaTitle": "Certificado de Tradición Medellín en línea | Certitradición",
    "metaDescription": "Obtén el Certificado de Tradición y Libertad de tu inmueble en Medellín en minutos. 100% en línea, pago por Wompi, PDF oficial. Sin filas. Desde $39.900.",
    "h1": "Certificado de Tradición y Libertad en Medellín",
    "intro": "Si vas a comprar, vender o estudiar un inmueble en Medellín, el Certificado de Tradición y Libertad es el documento que muestra su historia jurídica: dueños, hipotecas, embargos y limitaciones. En una ciudad con tanto movimiento inmobiliario en El Poblado, Laureles, Belén o Robledo, conviene tenerlo al día. Con Certitradición lo solicitas en línea, pagas seguro por Wompi y lo recibes en tu correo en minutos, sin desplazarte hasta una oficina de registro.",
    "comoObtener": "Los predios de Medellín están adscritos a la Oficina de Registro de Instrumentos Públicos según su ubicación: MEDELLIN NORTE (código 01N) o MEDELLIN SUR (código 001). Para pedir el certificado solo necesitas la matrícula inmobiliaria del predio (el número que identifica su folio). Tradicionalmente había que acudir presencialmente o navegar el portal oficial de la SNR; con Certitradición lo haces en línea desde tu celular, sin filas ni traslados. Diligencias la matrícula, pagas $39.900 por Wompi y recibes el PDF oficial en tu correo en minutos.",
    "faqs": [
      {
        "q": "¿Cuál es la Oficina de Registro de Instrumentos Públicos de Medellín?",
        "a": "Medellín cuenta con dos: MEDELLIN NORTE, con código de oficina 01N, y MEDELLIN SUR, con código 001. La que corresponde depende de la ubicación del inmueble dentro de la ciudad y queda indicada en la matrícula inmobiliaria del predio."
      },
      {
        "q": "¿Cuánto cuesta el Certificado de Tradición y Libertad en Medellín?",
        "a": "Con Certitradición el servicio cuesta $39.900 COP, con pago seguro por Wompi. Recibes el documento PDF oficial en tu correo en minutos, listo para usar, con una validez de 30 días desde su expedición."
      },
      {
        "q": "¿Tengo que ir presencialmente a una oficina de registro en Medellín?",
        "a": "No es necesario. Con Certitradición todo el trámite es en línea: solo indicas la matrícula inmobiliaria, pagas por Wompi y recibes el certificado en tu correo. Evitas filas y desplazamientos a las oficinas MEDELLIN NORTE o MEDELLIN SUR."
      }
    ]
  },
  {
    "slug": "monteria",
    "ciudad": "Montería",
    "departamento": "Córdoba",
    "oficinas": [
      {
        "nombre": "MONTERIA",
        "codigo": "140"
      }
    ],
    "metaTitle": "Certificado de Tradición Montería | En Línea",
    "metaDescription": "Solicita el Certificado de Tradición y Libertad en Montería en línea con Certitradición. PDF oficial en tu correo en minutos, sin filas. Paga seguro por Wompi.",
    "h1": "Certificado de Tradición y Libertad en Montería (Córdoba)",
    "intro": "Si tienes un predio en Montería —en barrios como El Recreo, La Castellana o La Granja, o en zona rural del valle del Sinú— y necesitas conocer su historia jurídica, el Certificado de Tradición y Libertad es el documento clave. Refleja propietarios, hipotecas, embargos y limitaciones del inmueble. Con Certitradición lo generas en línea para predios registrados en la Oficina de Registro de Instrumentos Públicos de Montería y lo recibes en tu correo, sin trasladarte ni hacer filas en la capital cordobesa.",
    "comoObtener": "Los inmuebles ubicados en Montería y municipios de su jurisdicción están inscritos en la Oficina de Registro de Instrumentos Públicos de Montería, código 140. Para obtener el certificado necesitas el número de matrícula inmobiliaria del predio (empieza por 140), que aparece en escrituras o recibos prediales. Con Certitradición no tienes que desplazarte hasta la oficina ni esperar turnos: ingresas la matrícula, pagas de forma segura por Wompi y recibes el PDF oficial en tu correo en minutos, listo para trámites notariales, créditos o compraventas.",
    "faqs": [
      {
        "q": "¿Cuál es la oficina de registro de Montería y su código?",
        "a": "Los predios de Montería se registran en la Oficina de Registro de Instrumentos Públicos de Montería, identificada con el código 140. Las matrículas inmobiliarias de inmuebles en esta jurisdicción inician con ese mismo número 140."
      },
      {
        "q": "¿Cuánto cuesta el certificado en Montería?",
        "a": "El servicio de Certitradición para gestionar tu Certificado de Tradición y Libertad en Montería cuesta $39.900 COP. Pagas en línea de forma segura mediante Wompi y recibes el documento PDF oficial en tu correo en pocos minutos."
      },
      {
        "q": "¿Tengo que ir presencialmente a la oficina en Montería?",
        "a": "No es necesario. Con Certitradición todo el proceso es en línea: no acudes a la oficina de Montería ni haces filas. Solo necesitas la matrícula inmobiliaria del predio y recibes el certificado oficial directamente en tu correo electrónico."
      }
    ]
  },
  {
    "slug": "neiva",
    "ciudad": "Neiva",
    "departamento": "Huila",
    "oficinas": [
      {
        "nombre": "NEIVA",
        "codigo": "200"
      }
    ],
    "metaTitle": "Certificado de Tradición Neiva | En línea $39.900",
    "metaDescription": "Saca el Certificado de Tradición y Libertad de tu inmueble en Neiva (Huila) en línea, sin filas. Pagas por Wompi y lo recibes en tu correo en minutos.",
    "h1": "Certificado de Tradición y Libertad en Neiva (Huila)",
    "intro": "¿Necesitas el Certificado de Tradición y Libertad de un predio en Neiva, capital del Huila? Si vas a comprar una casa en barrios como Altico o Las Palmas, un lote en la zona de expansión o un local en el centro, este documento te muestra quién es el dueño, los embargos, hipotecas y la historia jurídica del inmueble. Con Certitradición lo gestionamos en línea por ti: pagas de forma segura y lo recibes en tu correo en minutos, sin desplazarte hasta la oficina de registro.",
    "comoObtener": "El inmueble ubicado en Neiva está registrado en la Oficina de Registro de Instrumentos Públicos de Neiva (código 200), que atiende los predios del municipio y su área de influencia en el Huila. Para obtener su Certificado de Tradición y Libertad solo necesitas el número de matrícula inmobiliaria, que en esta oficina suele iniciar con el prefijo 200. Con Certitradición no haces filas ni te trasladas: ingresas la matrícula, pagas por Wompi y recibes el PDF oficial en tu correo en minutos, listo para tu trámite de compraventa, crédito o avalúo.",
    "faqs": [
      {
        "q": "¿Cuál es la oficina de registro para inmuebles en Neiva y su código?",
        "a": "Los predios de Neiva pertenecen a la Oficina de Registro de Instrumentos Públicos de Neiva, identificada con el código 200. Sus matrículas inmobiliarias suelen iniciar con el prefijo 200, dato útil al solicitar el certificado de un inmueble del municipio."
      },
      {
        "q": "¿Cuánto cuesta el certificado de tradición en Neiva con Certitradición?",
        "a": "El servicio de gestión en línea tiene un valor de $39.900 COP. Pagas de forma segura por Wompi y recibes el documento PDF oficial en tu correo en minutos, con validez de 30 días para usarlo en tu trámite en Neiva."
      },
      {
        "q": "¿Tengo que ir presencialmente a la oficina de Neiva?",
        "a": "No. Con Certitradición todo el proceso es en línea: no haces filas ni te desplazas hasta la oficina de registro de Neiva. Solicitas con la matrícula inmobiliaria, pagas y recibes el certificado oficial directamente en tu correo electrónico."
      }
    ]
  },
  {
    "slug": "pasto",
    "ciudad": "Pasto",
    "departamento": "Nariño",
    "oficinas": [
      {
        "nombre": "PASTO",
        "codigo": "240"
      }
    ],
    "metaTitle": "Certificado de Tradición y Libertad en Pasto",
    "metaDescription": "Obtén el Certificado de Tradición y Libertad de tu inmueble en Pasto, Nariño 100% en línea. Pago seguro y entrega del PDF oficial por correo en minutos.",
    "h1": "Certificado de Tradición y Libertad en Pasto (Nariño)",
    "intro": "¿Necesitas el Certificado de Tradición y Libertad de un inmueble en Pasto? Si compras un lote en Torobajo, un apartamento en el centro o una casa en Aranda, este documento muestra la historia jurídica del predio: propietarios, hipotecas, embargos y gravámenes. Con Certitradición lo tramitamos en línea a partir de la matrícula inmobiliaria de la capital de Nariño y lo recibes por correo en minutos, sin trasladarte hasta la oficina de registro ni hacer fila.",
    "comoObtener": "Los inmuebles ubicados en Pasto están inscritos en la Oficina de Registro de Instrumentos Públicos de Pasto, identificada con el código 240. Para obtener el certificado necesitas el número de matrícula inmobiliaria del predio (que aparece en la escritura o en el recibo del predial). En Certitradición seleccionas la oficina de Pasto (240), ingresas la matrícula, pagas de forma segura con Wompi y recibes el Certificado de Tradición y Libertad en PDF por correo o WhatsApp en minutos, sin filas ni desplazamientos hasta la sede de registro.",
    "faqs": [
      {
        "q": "¿Cuál es la oficina de registro de Pasto y su código?",
        "a": "Los inmuebles de Pasto están inscritos en la Oficina de Registro de Instrumentos Públicos de Pasto, identificada con el código 240. Ese código y tu número de matrícula inmobiliaria son los datos que necesitas para solicitar el certificado del predio."
      },
      {
        "q": "¿Cuánto cuesta el certificado en Pasto?",
        "a": "El servicio de gestión de Certitradición cuesta $39.900 COP, con pago seguro por Wompi. Ese valor incluye la expedición del certificado, la entrega inmediata por correo o WhatsApp y el soporte. Somos un gestor privado, no el canal oficial de la SNR."
      },
      {
        "q": "¿Tengo que ir presencialmente a la oficina de Pasto?",
        "a": "No. Con Certitradición todo el trámite es en línea: indicas la oficina de Pasto (240) y tu matrícula, pagas y recibes el PDF oficial en minutos. No necesitas desplazarte hasta la sede de registro ni hacer fila en la capital de Nariño."
      }
    ]
  },
  {
    "slug": "pereira",
    "ciudad": "Pereira",
    "departamento": "Risaralda",
    "oficinas": [
      {
        "nombre": "PEREIRA",
        "codigo": "290"
      }
    ],
    "metaTitle": "Certificado de Tradición Pereira en Línea | Certitradición",
    "metaDescription": "Obtén el Certificado de Tradición y Libertad de tu inmueble en Pereira en minutos. PDF oficial, válido 30 días, sin filas. Pago seguro por Wompi: $39.900.",
    "h1": "Certificado de Tradición y Libertad en Pereira (Risaralda)",
    "intro": "¿Necesitas el Certificado de Tradición y Libertad de un predio en Pereira, capital de Risaralda? Ya sea un apartamento en el centro, una finca en el corredor cafetero o un lote en zona de expansión, este documento muestra dueños, hipotecas, embargos y limitaciones del inmueble. Con Certitradición lo gestionamos en línea: pagas, lo recibes en tu correo en minutos y te ahorras los desplazamientos hasta la oficina de registro. Somos un gestor privado, no el canal oficial de la SNR.",
    "comoObtener": "Todo inmueble ubicado en Pereira está inscrito en la Oficina de Registro de Instrumentos Públicos de Pereira (ORIP código 290), que es donde reposa su folio de matrícula inmobiliaria. Para obtener el certificado solo necesitas el número de matrícula (suele iniciar en 290-) o la dirección del predio. Con Certitradición lo solicitas en línea desde casa: ingresas los datos, pagas $39.900 por Wompi y recibes en minutos el PDF oficial en tu correo, válido 30 días. Sin filas, sin trámites presenciales y sin desplazarte hasta la oficina en Pereira.",
    "faqs": [
      {
        "q": "¿Cuál es la oficina de registro que cubre los inmuebles de Pereira?",
        "a": "Los predios de Pereira están registrados en la Oficina de Registro de Instrumentos Públicos de Pereira, identificada con el código 290. Por eso las matrículas inmobiliarias de la ciudad suelen comenzar con el prefijo 290 seguido del número del folio."
      },
      {
        "q": "¿Cuánto cuesta el certificado de tradición de un predio en Pereira?",
        "a": "Con Certitradición el servicio de gestión en línea tiene un valor único de $39.900 COP, que pagas de forma segura por Wompi. Recibes el PDF oficial en tu correo en minutos, con validez de 30 días desde su expedición."
      },
      {
        "q": "¿Tengo que ir presencialmente a la oficina en Pereira?",
        "a": "No es necesario. Con Certitradición todo el proceso es en línea: solicitas, pagas y recibes el certificado por correo sin desplazarte hasta la oficina de registro de Pereira ni hacer filas. Solo necesitas la matrícula o la dirección del inmueble."
      }
    ]
  },
  {
    "slug": "santa-marta",
    "ciudad": "Santa Marta",
    "departamento": "Magdalena",
    "oficinas": [
      {
        "nombre": "SANTA MARTA",
        "codigo": "080"
      }
    ],
    "metaTitle": "Certificado de Tradición Santa Marta en Línea | Certitradición",
    "metaDescription": "Solicita el Certificado de Tradición y Libertad de tu inmueble en Santa Marta en línea. PDF oficial en minutos por $39.900, sin filas. Paga seguro con Wompi.",
    "h1": "Certificado de Tradición y Libertad en Santa Marta",
    "intro": "Si tu inmueble está en Santa Marta o en algún municipio del Magdalena, su historial jurídico reposa en la Oficina de Registro de Instrumentos Públicos de Santa Marta (código 080). El Certificado de Tradición y Libertad muestra propietarios, hipotecas, embargos y limitaciones de ese predio. En Certitradición somos un gestor privado que te ayuda a obtenerlo en línea: pagas por Wompi y recibes el PDF oficial en tu correo en minutos, sin desplazarte hasta la oficina ni hacer filas en la capital del Magdalena.",
    "comoObtener": "Para obtener el Certificado de Tradición y Libertad de un predio ubicado en Santa Marta o el resto del Magdalena necesitas su matrícula inmobiliaria, que administra la Oficina de Registro de Instrumentos Públicos de Santa Marta (código 080). Si no la conoces, suele aparecer en la escritura, el recibo del impuesto predial o el certificado anterior. Con Certitradición ingresas la matrícula, pagas $39.900 de forma segura por Wompi y recibes el documento PDF oficial en tu correo en minutos, completamente en línea y sin filas. El certificado tiene una validez de 30 días.",
    "faqs": [
      {
        "q": "¿Cuál es la oficina de registro de Santa Marta y su código?",
        "a": "Los inmuebles de Santa Marta y demás municipios del Magdalena se registran en la Oficina de Registro de Instrumentos Públicos de Santa Marta, identificada con el código 080. Allí reposa el folio de matrícula inmobiliaria de cada predio."
      },
      {
        "q": "¿Cuánto cuesta el Certificado de Tradición en Santa Marta?",
        "a": "Con Certitradición el servicio cuesta $39.900 COP. Pagas de forma segura mediante Wompi y recibes el PDF oficial en tu correo en minutos. El documento tiene validez de 30 días desde su expedición."
      },
      {
        "q": "¿Tengo que ir presencialmente a la oficina en Santa Marta?",
        "a": "No es necesario. Con Certitradición todo el trámite se hace en línea: ingresas la matrícula del inmueble, pagas y recibes el certificado por correo en minutos, sin desplazarte a la oficina de Santa Marta ni hacer filas."
      }
    ]
  },
  {
    "slug": "soacha",
    "ciudad": "Soacha",
    "departamento": "Cundinamarca",
    "oficinas": [
      {
        "nombre": "SOACHA",
        "codigo": "051"
      }
    ],
    "metaTitle": "Certificado de Tradición Soacha | En línea",
    "metaDescription": "Obtén el Certificado de Tradición y Libertad de tu inmueble en Soacha en línea. Documento oficial PDF en minutos a tu correo, pago seguro Wompi, sin filas.",
    "h1": "Certificado de Tradición y Libertad en Soacha (Cundinamarca)",
    "intro": "Si tu inmueble está en Soacha o en alguno de sus barrios y comunas, su historia jurídica reposa en la Oficina de Registro de Instrumentos Públicos de Soacha (código 051), una de las más demandadas de Cundinamarca por el crecimiento urbano del municipio. Con Certitradición solicitas en línea el Certificado de Tradición y Libertad de ese predio: ingresas la matrícula inmobiliaria, pagas seguro por Wompi y recibes el documento oficial en PDF, en tu correo, en minutos. Somos un gestor privado, no el canal oficial de la SNR.",
    "comoObtener": "El Certificado de Tradición y Libertad de un predio en Soacha lo expide la Oficina de Registro de Instrumentos Públicos de Soacha, identificada con el código 051, que es el prefijo de la matrícula inmobiliaria (por ejemplo, 051-XXXXXX). Ese número aparece en tu escritura, en el recibo predial o en compraventas anteriores. Para evitar desplazamientos hasta la oficina y las filas, con Certitradición lo gestionas en línea: digitas la matrícula del inmueble en Soacha, pagas con Wompi y recibes el certificado oficial en PDF en tu correo en cuestión de minutos.",
    "faqs": [
      {
        "q": "¿Cuál es la oficina de registro del Certificado de Tradición en Soacha?",
        "a": "Es la Oficina de Registro de Instrumentos Públicos de Soacha, con código 051. Ese número de tres dígitos es el prefijo de la matrícula inmobiliaria de cualquier predio registrado en el municipio de Soacha, Cundinamarca."
      },
      {
        "q": "¿Cuánto cuesta el Certificado de Tradición y Libertad de un inmueble en Soacha?",
        "a": "Con Certitradición el servicio de gestión cuesta $39.900 COP, todo incluido. Pagas seguro por Wompi y recibes el documento oficial en PDF en tu correo en minutos, sin desplazarte hasta la oficina de Soacha."
      },
      {
        "q": "¿Tengo que ir presencialmente a la oficina de Soacha para sacarlo?",
        "a": "No es necesario. Aunque el inmueble esté en Soacha, con Certitradición todo el trámite es en línea: ingresas la matrícula, pagas por Wompi y recibes el certificado en tu correo, sin filas ni desplazamientos a la oficina 051."
      }
    ]
  },
  {
    "slug": "soledad",
    "ciudad": "Soledad",
    "departamento": "Atlántico",
    "oficinas": [
      {
        "nombre": "SOLEDAD",
        "codigo": "041"
      }
    ],
    "metaTitle": "Certificado de Tradición en Soledad | Certitradición",
    "metaDescription": "Obtén el Certificado de Tradición y Libertad de tu predio en Soledad (Atlántico) en línea. Pagas por Wompi y lo recibes en minutos en tu correo. $39.900.",
    "h1": "Certificado de Tradición y Libertad en Soledad (Atlántico)",
    "intro": "¿Necesitas el Certificado de Tradición y Libertad de un inmueble en Soledad? Ya sea una casa en El Hipódromo, un lote en Ciudadela Metropolitana o un apartamento cerca de la troncal, este documento muestra el historial jurídico del predio: propietarios, hipotecas y embargos. En Certitradición lo gestionamos por ti en línea para que no pierdas tiempo en filas ni desplazamientos en este municipio del área metropolitana de Barranquilla. Lo pagas con Wompi y te llega al correo en minutos.",
    "comoObtener": "Los inmuebles ubicados en Soledad están matriculados en la Oficina de Registro de Instrumentos Públicos de Soledad, código 041, que administra los folios de matrícula de este municipio del Atlántico. Para obtener el Certificado de Tradición y Libertad solo necesitas el número de matrícula inmobiliaria del predio. Con Certitradición lo solicitas desde tu celular o computador, sin acercarte a la oficina ni hacer filas: ingresas la matrícula, pagas $39.900 por Wompi y recibes el documento PDF oficial en tu correo en cuestión de minutos.",
    "faqs": [
      {
        "q": "¿Cuál es la oficina de registro que corresponde a Soledad?",
        "a": "Los predios de Soledad se registran en la Oficina de Registro de Instrumentos Públicos de Soledad, identificada con el código 041. Allí reposan los folios de matrícula inmobiliaria de todo el municipio del Atlántico."
      },
      {
        "q": "¿Cuánto cuesta el certificado en Soledad con Certitradición?",
        "a": "Nuestro servicio de gestión tiene un costo de $39.900 COP, que pagas de forma segura mediante Wompi. Recibes el Certificado de Tradición y Libertad en PDF oficial en tu correo en minutos, con validez de 30 días."
      },
      {
        "q": "¿Tengo que ir presencialmente a la oficina en Soledad?",
        "a": "No es necesario. Con Certitradición todo el trámite es 100% en línea: evitas filas y desplazamientos hasta la oficina de registro. Solo ingresas la matrícula, pagas por Wompi y recibes tu certificado en el correo."
      }
    ]
  },
  {
    "slug": "tunja",
    "ciudad": "Tunja",
    "departamento": "Boyacá",
    "oficinas": [
      {
        "nombre": "TUNJA",
        "codigo": "070"
      }
    ],
    "metaTitle": "Certificado de Tradición Tunja en línea | Certitradición",
    "metaDescription": "Solicita el Certificado de Tradición y Libertad de tu inmueble en Tunja (Boyacá) en línea. Lo recibes en minutos en tu correo por $39.900, sin filas ni desplazamientos.",
    "h1": "Certificado de Tradición y Libertad en Tunja (Boyacá)",
    "intro": "Si tu predio está en Tunja —el centro histórico, Maldonado, El Topo, La María o cualquier barrio de la capital boyacense—, su historia jurídica reposa en la Oficina de Registro de Instrumentos Públicos de Tunja. Con Certitradición consultas ese folio de matrícula inmobiliaria sin subir hasta la oficina ni hacer fila: solicitas en línea, pagas de forma segura y recibes el Certificado de Tradición y Libertad en tu correo en cuestión de minutos. Somos un gestor privado que agiliza el trámite por ti, no el canal oficial de la SNR.",
    "comoObtener": "Todo inmueble ubicado en Tunja se registra en la Oficina de Registro de Instrumentos Públicos de Tunja (código 070), que también atiende municipios del entorno boyacense. Para obtener su Certificado de Tradición y Libertad basta con el número de matrícula inmobiliaria que inicia con ese prefijo 070. Con Certitradición ingresas la matrícula, pagas $39.900 por Wompi y recibimos por ti la solicitud: en minutos llega a tu correo el PDF oficial con su número de turno y validez de 30 días, sin desplazarte ni hacer fila en la ORIP de Tunja.",
    "faqs": [
      {
        "q": "¿Cuál es la oficina de registro de Tunja y su código?",
        "a": "Los inmuebles de Tunja se registran en la Oficina de Registro de Instrumentos Públicos de Tunja, identificada con el código 070. Ese mismo número es el prefijo de la matrícula inmobiliaria de cualquier predio de la ciudad."
      },
      {
        "q": "¿Cuánto cuesta el certificado en Tunja con Certitradición?",
        "a": "El servicio de gestión tiene un valor único de $39.900 COP, que pagas de forma segura por Wompi. Incluye la generación del PDF oficial del folio de Tunja y su envío inmediato a tu correo, con validez de 30 días."
      },
      {
        "q": "¿Tengo que ir presencialmente a la ORIP de Tunja?",
        "a": "No es necesario. Todo el trámite es en línea: no debes subir hasta la Oficina de Registro de Tunja ni hacer fila. Solo necesitas el número de matrícula y recibes el certificado por correo en minutos."
      }
    ]
  },
  {
    "slug": "valledupar",
    "ciudad": "Valledupar",
    "departamento": "Cesar",
    "oficinas": [
      {
        "nombre": "VALLEDUPAR",
        "codigo": "190"
      }
    ],
    "metaTitle": "Certificado de Tradición Valledupar | En línea",
    "metaDescription": "Obtén el Certificado de Tradición y Libertad de tu inmueble en Valledupar en línea. Sin filas, pago seguro con Wompi y entrega en minutos a tu correo. PDF oficial.",
    "h1": "Certificado de Tradición y Libertad en Valledupar (Cesar)",
    "intro": "Si tu inmueble está en Valledupar o en algún corregimiento del Cesar, su historia jurídica reposa en la Oficina de Registro de Instrumentos Públicos de Valledupar. Con Certitradición solicitas el Certificado de Tradición y Libertad sin desplazarte hasta la oficina ni hacer filas: ingresas tu matrícula inmobiliaria, pagas de forma segura con Wompi y recibes el documento en tu correo en minutos. Somos un gestor privado que agiliza el trámite por ti, ideal para compraventas, hipotecas o sucesiones en la capital del Cesar.",
    "comoObtener": "El folio de cualquier predio ubicado en Valledupar y su zona de influencia se administra en la Oficina de Registro de Instrumentos Públicos de Valledupar, identificada con el código 190. Para obtener el certificado solo necesitas la matrícula inmobiliaria del inmueble (empieza por 190). En Certitradición la ingresas en nuestro formulario, realizas el pago seguro con Wompi y, en pocos minutos, recibes el PDF oficial en tu correo, válido por 30 días. Todo en línea, sin filas ni traslados hasta la oficina vallenata, ideal si vives fuera de la ciudad o tienes poco tiempo.",
    "faqs": [
      {
        "q": "¿Cuál es la Oficina de Registro de Valledupar y su código?",
        "a": "Los inmuebles de Valledupar y su área se registran en la Oficina de Registro de Instrumentos Públicos de Valledupar, con código 190. Las matrículas inmobiliarias de estos predios inician con ese número 190."
      },
      {
        "q": "¿Cuánto cuesta el Certificado de Tradición en Valledupar?",
        "a": "Con Certitradición el servicio cuesta $39.900 COP, todo incluido. Esto cubre la gestión en línea, el pago seguro con Wompi y la entrega del PDF oficial en tu correo en minutos, sin filas ni traslados."
      },
      {
        "q": "¿Debo ir presencialmente a la oficina de Valledupar?",
        "a": "No es necesario. Con Certitradición todo el trámite es en línea: ingresas la matrícula, pagas con Wompi y recibes el certificado en tu correo. Evitas desplazarte hasta la oficina de registro y hacer filas."
      }
    ]
  },
  {
    "slug": "villavicencio",
    "ciudad": "Villavicencio",
    "departamento": "Meta",
    "oficinas": [
      {
        "nombre": "VILLAVICENCIO",
        "codigo": "230"
      }
    ],
    "metaTitle": "Certificado de Tradición Villavicencio en línea",
    "metaDescription": "Obtén el Certificado de Tradición y Libertad de tu inmueble en Villavicencio (Meta) en línea. PDF oficial, válido 30 días, a tu correo en minutos. Desde $39.900.",
    "h1": "Certificado de Tradición y Libertad en Villavicencio (Meta)",
    "intro": "Si vas a comprar, vender o hipotecar un predio en Villavicencio, capital del Meta y puerta de los Llanos, el Certificado de Tradición y Libertad es el documento que revela su historia jurídica: dueños, hipotecas y embargos. Todo inmueble de la ciudad y su área de expansión está inscrito en la Oficina de Registro de Instrumentos Públicos de Villavicencio (código 230). Con Certitradición lo solicitas en línea y lo recibes en tu correo en minutos, sin filas ni desplazamientos por el centro.",
    "comoObtener": "Cada predio de Villavicencio (barrios como El Barzal, La Esperanza o sectores nuevos en la vía a Acacías y Puerto López) está matriculado en la Oficina de Registro de Instrumentos Públicos de Villavicencio, código 230, prefijo del folio de matrícula inmobiliaria (ej. 230-XXXXX). Con ese número ingresas a nuestro formulario, eliges la oficina, pagas seguro con Wompi y recibes el Certificado de Tradición y Libertad en PDF en tu correo en minutos. Con Certitradición lo haces en línea desde casa, sin filas ni desplazamientos por el llano. Documento oficial con validez de 30 días calendario.",
    "faqs": [
      {
        "q": "¿Cuál es la oficina de registro de Villavicencio y su código?",
        "a": "Es la Oficina de Registro de Instrumentos Públicos de Villavicencio, identificada con el código 230. Ese número es el prefijo del folio de matrícula inmobiliaria de los predios de la ciudad y su zona registral, por ejemplo 230-XXXXX."
      },
      {
        "q": "¿Cuánto cuesta el certificado en Villavicencio?",
        "a": "El servicio tiene un valor de $39.900 COP, que cubre la tarifa del certificado más nuestra gestión: entrega en minutos por correo y pago seguro con Wompi. El precio es único y se muestra antes de pagar, sin cobros ocultos."
      },
      {
        "q": "¿Tengo que ir presencialmente a la oficina de Villavicencio?",
        "a": "No. Con Certitradición todo el trámite es en línea: solicitas con tu matrícula inmobiliaria, pagas y recibes el PDF oficial en tu correo en minutos, sin filas ni desplazamientos hasta la oficina de registro de Villavicencio."
      }
    ]
  },
  {
    "slug": "popayan",
    "ciudad": "Popayán",
    "departamento": "Cauca",
    "oficinas": [
      {
        "nombre": "POPAYAN",
        "codigo": "120"
      }
    ],
    "metaTitle": "Certificado de Tradición Popayán | En línea",
    "metaDescription": "Obtén el Certificado de Tradición y Libertad en Popayán (Cauca) en minutos, sin filas. ORIP código 120. Pago único $39.900. PDF oficial al correo.",
    "h1": "Certificado de Tradición y Libertad en Popayán (Cauca)",
    "intro": "Si estás comprando un apartamento en el barrio Bolívar, vendiendo una finca en las veredas del pie de monte caucano o tramitando una sucesión en el norte de la ciudad, lo primero que te van a pedir es el Certificado de Tradición y Libertad. Este documento expedido por la Oficina de Registro de Instrumentos Públicos POPAYAN — con código de matrícula 120 — muestra quién es el propietario actual, si existe alguna hipoteca, embargo, gravamen o limitación sobre el predio. Con Certitradición lo obtienes en minutos, desde cualquier lugar del Cauca.",
    "comoObtener": "Todo predio ubicado en Popayán y en los municipios bajo cobertura de la ORIP código 120 tiene una matrícula inmobiliaria que empieza por ese número. Para tramitar tu certificado solo necesitas ese código: ingrésalo en nuestro formulario, realiza el pago único de $39.900 a través de Wompi (tarjeta, PSE o Nequi) y en pocos minutos recibirás el PDF oficial directamente en tu correo y, si lo prefieres, también por WhatsApp. Certitradición es un gestor privado que facilita el trámite en línea; no somos un canal oficial de la Superintendencia de Notariado y Registro (SNR) ni del Gobierno Nacional.",
    "faqs": [
      {
        "q": "¿Qué es la ORIP de Popayán y qué significa el código 120?",
        "a": "La Oficina de Registro de Instrumentos Públicos POPAYAN es la entidad que registra y certifica la historia jurídica de los predios ubicados en Popayán y en varios municipios del Cauca. El código 120 es el prefijo que identifica a esta ORIP y aparece al inicio de toda matrícula inmobiliaria registrada allí, ya sea un lote en Timbío, una casa en el barrio La Aldea o una finca en Cajibío."
      },
      {
        "q": "¿Cuánto cuesta obtener el certificado a través de Certitradición?",
        "a": "El servicio tiene un valor de $39.900 COP, pago único. Puedes pagar con tarjeta débito o crédito, PSE o Nequi a través de Wompi. Ese pago cubre la gestión completa: consulta, expedición del PDF oficial con validez de 30 días y envío inmediato a tu correo electrónico."
      },
      {
        "q": "¿Tengo que ir hasta la oficina en el centro de Popayán para obtenerlo?",
        "a": "No es necesario. Con Certitradición todo el proceso es 100% en línea, sin importar si estás en el barrio Alfonso López, en Silvia o fuera del país. Solo ingresas el número de matrícula, pagas y recibes el PDF en minutos. Olvídate de filas en la carrera 6.ª o de desplazarte hasta la sede de la ORIP."
      }
    ]
  },
  {
    "slug": "sincelejo",
    "ciudad": "Sincelejo",
    "departamento": "Sucre",
    "oficinas": [
      {
        "nombre": "SINCELEJO",
        "codigo": "340"
      }
    ],
    "metaTitle": "Certificado de Tradición Sincelejo | En línea",
    "metaDescription": "Obtén tu Certificado de Tradición y Libertad en Sincelejo (Sucre) en minutos. Sin filas, 100% en línea. Solo $39.900 con Wompi. PDF oficial al correo.",
    "h1": "Certificado de Tradición y Libertad en Sincelejo (Sucre): rápido, en línea y sin filas",
    "intro": "¿Estás comprando un apartamento en el barrio Las Palmas, vendiendo una finca en los alrededores de la vía a Corozal o tramitando una sucesión en la zona norte de Sincelejo? Antes de firmar cualquier escritura, necesitas el Certificado de Tradición y Libertad. Este documento, expedido por la ORIP SINCELEJO con código de matrícula 340, revela la historia jurídica del predio: quién es el propietario real, si tiene hipotecas activas, embargos, afectaciones a vivienda familiar o cualquier limitación que pueda comprometer tu inversión en la capital de Sucre.",
    "comoObtener": "Todos los predios registrados en Sincelejo y el departamento de Sucre tienen matrícula inmobiliaria con prefijo 340, asignada por la ORIP SINCELEJO. Para obtener tu certificado a través de Certitradición —gestor privado que tramita en línea por ti, sin ser canal oficial de la SNR ni del Gobierno— solo necesitas ese número de matrícula. El proceso es simple: ingresa la matrícula en nuestro formulario, paga $39.900 con Wompi (tarjeta o PSE), y en minutos recibes el PDF oficial en tu correo y, si lo prefieres, por WhatsApp. Validez de 30 días. Sin desplazarte hasta las oficinas del centro de Sincelejo.",
    "faqs": [
      {
        "q": "¿Qué es la ORIP Sincelejo y qué significa el código 340?",
        "a": "La Oficina de Registro de Instrumentos Públicos (ORIP) de Sincelejo es la entidad estatal encargada de registrar todos los actos sobre bienes inmuebles ubicados en la capital de Sucre y municipios de su circuito. El código 340 es el prefijo que identifica a esta oficina dentro del sistema nacional, por lo que toda matrícula inmobiliaria sincelejana comienza con esos tres dígitos. Es el número que necesitas para solicitar tu certificado."
      },
      {
        "q": "¿Cuánto cuesta obtener el Certificado de Tradición y Libertad en Sincelejo por Certitradición?",
        "a": "El valor del servicio a través de Certitradición es de $39.900 COP, pagadero una sola vez mediante Wompi (acepta tarjetas débito, crédito y PSE). Con ese pago único gestionamos la consulta ante el sistema de la SNR y te entregamos el PDF oficial en tu correo en minutos, con vigencia de 30 días contados desde la fecha de expedición."
      },
      {
        "q": "¿Tengo que ir personalmente a alguna oficina en Sincelejo para obtener el certificado?",
        "a": "No. Certitradición es un gestor privado que realiza el trámite completamente en línea, así que no necesitas acercarte a las instalaciones de la ORIP ubicada en el centro de Sincelejo ni hacer filas. Todo el proceso, desde ingresar la matrícula hasta recibir el documento, lo haces desde tu celular o computador, sin importar si estás en el barrio Venecia, en Mochilá o fuera de la ciudad."
      }
    ]
  },
  {
    "slug": "riohacha",
    "ciudad": "Riohacha",
    "departamento": "La Guajira",
    "oficinas": [
      {
        "nombre": "RIOHACHA",
        "codigo": "210"
      }
    ],
    "metaTitle": "Certificado de Tradición Riohacha | $39.900",
    "metaDescription": "Obtén tu Certificado de Tradición y Libertad en Riohacha en minutos. Trámite en línea, PDF oficial al correo, sin filas. Solo $39.900 pago único por Wompi.",
    "h1": "Certificado de Tradición y Libertad en Riohacha (La Guajira)",
    "intro": "¿Vas a comprar un lote en el corredor de Maicao, un apartamento cerca del malecón de Riohacha o una finca en las sabanas de la Alta Guajira? Antes de firmar cualquier promesa de compraventa, necesitas el Certificado de Tradición y Libertad para saber quién figura como propietario real y si el predio tiene hipotecas, embargos o limitaciones vigentes. En Riohacha, los predios quedan inscritos en la ORIP RIOHACHA con código de matrícula inmobiliaria 210, y aquí puedes obtener ese certificado oficial sin salir de casa.",
    "comoObtener": "Todo predio registrado en Riohacha —ya sea en el barrio El Prado, la urbanización Villa del Sur, zonas rurales de Manaure o riberas del río Ranchería— tiene una matrícula que empieza por el código 210, asignado a la ORIP RIOHACHA. Certitradición es un gestor privado (no somos la SNR ni un ente gubernamental) que tramita el certificado en línea por ti: ingresa el número de matrícula inmobiliaria, paga $39.900 COP una sola vez mediante Wompi y recibe el PDF oficial en tu correo electrónico (y por WhatsApp si lo prefieres) en cuestión de minutos. Sin filas, sin desplazamientos, validez de 30 días.",
    "faqs": [
      {
        "q": "¿Cuál es la ORIP de Riohacha y qué significa el código 210 en la matrícula?",
        "a": "La Oficina de Registro de Instrumentos Públicos que cubre Riohacha y gran parte del departamento de La Guajira es la ORIP RIOHACHA. El código 210 es el identificador que esta oficina asigna como prefijo a cada matrícula inmobiliaria; si tu número de matrícula comienza con 210, el predio está inscrito allí. Ese mismo código aparece en escrituras, promesas de compraventa y avalúos de predios ubicados desde el casco urbano de Riohacha hasta corregimientos como Camarones o Albania."
      },
      {
        "q": "¿Cuánto cuesta el Certificado de Tradición y Libertad en Riohacha a través de Certitradición?",
        "a": "El valor es de $39.900 COP, pago único y sin costos ocultos. Se procesa de forma segura mediante Wompi. Una vez confirmado el pago, recibes el PDF del certificado oficial directamente en tu correo electrónico (y por WhatsApp si así lo prefieres) en pocos minutos, con validez de 30 días desde la fecha de expedición."
      },
      {
        "q": "¿Tengo que ir personalmente a las oficinas de la ORIP en Riohacha para obtener el certificado?",
        "a": "No. Certitradición es un gestor privado que realiza el trámite completamente en línea, sin que tengas que desplazarte hasta las instalaciones de la ORIP en Riohacha. Esto es especialmente útil para propietarios que viven fuera de La Guajira o para compradores que negocian predios a distancia. Solo necesitas el número de matrícula inmobiliaria para iniciar el proceso desde cualquier dispositivo."
      }
    ]
  },
  {
    "slug": "quibdo",
    "ciudad": "Quibdó",
    "departamento": "Chocó",
    "oficinas": [
      {
        "nombre": "QUIBDO",
        "codigo": "180"
      }
    ],
    "metaTitle": "Certificado de Tradición Quibdó | En línea",
    "metaDescription": "Obtén el Certificado de Tradición y Libertad en Quibdó (Chocó) en minutos desde tu celular. Sin filas en la ORIP. Solo $39.900 por Wompi. PDF oficial al instante.",
    "h1": "Certificado de Tradición y Libertad en Quibdó (Chocó)",
    "intro": "Si vas a comprar un lote en el barrio La Yesca, vender una casa en Kennedy, o aclarar una herencia de un predio rural en el corregimiento de Tutunendo, lo primero que necesitas es el Certificado de Tradición y Libertad. Este documento, expedido por la ORIP QUIBDO (código 180), revela quién figura como propietario, si el inmueble tiene hipotecas, embargos, gravámenes o cualquier limitación que pueda frenarte en el negocio. Con Certitradición lo gestionas en línea, sin moverte del Chocó ni esperar turno.",
    "comoObtener": "Todo predio registrado en Quibdó y el departamento del Chocó tiene su matrícula inmobiliaria bajo el prefijo 180, asignado por la ORIP QUIBDO. Para obtener tu certificado con Certitradición solo necesitas ese número de matrícula: ingrésalo en nuestro formulario, realiza el pago único de $39.900 a través de Wompi (tarjeta, PSE o Nequi) y en minutos recibes el PDF oficial en tu correo y, si lo prefieres, por WhatsApp. Certitradición es un gestor privado que tramita el documento en nombre del usuario; no es la SNR ni un canal gubernamental oficial.",
    "faqs": [
      {
        "q": "¿Cuál es la ORIP de Quibdó y qué significa el código 180?",
        "a": "La Oficina de Registro de Instrumentos Públicos (ORIP) que cubre Quibdó y el departamento del Chocó se llama ORIP QUIBDO. El código 180 es el prefijo que identifica todas las matrículas inmobiliarias inscritas allí: si tu predio está en el barrio Niño Jesús, en la vereda de Tagachí o en cualquier otro punto del municipio, su número de matrícula comenzará con 180."
      },
      {
        "q": "¿Cuánto cuesta obtener el certificado a través de Certitradición?",
        "a": "El servicio tiene un costo fijo de $39.900 COP, sin cobros adicionales ni sorpresas. El pago se realiza en un solo paso con Wompi, usando tarjeta débito o crédito, PSE o Nequi. Una vez confirmado el pago, el PDF oficial llega a tu correo en cuestión de minutos, con validez de 30 días calendario."
      },
      {
        "q": "¿Tengo que ir personalmente a la ORIP en Quibdó para conseguir el certificado?",
        "a": "No. Gracias a la plataforma de Certitradición puedes gestionar el Certificado de Tradición y Libertad desde cualquier lugar: desde tu casa en el barrio Huapango, desde Medellín o incluso desde el exterior. Todo el proceso es 100 % en línea. Solo necesitas el número de matrícula inmobiliaria y una forma de pago digital. No hay filas, ni desplazamientos, ni días de espera."
      }
    ]
  },
  {
    "slug": "florencia",
    "ciudad": "Florencia",
    "departamento": "Caquetá",
    "oficinas": [
      {
        "nombre": "FLORENCIA",
        "codigo": "420"
      }
    ],
    "metaTitle": "Certificado de Tradición Florencia (Caquetá) – Online",
    "metaDescription": "Obtén el Certificado de Tradición y Libertad en Florencia, Caquetá en minutos. Sin filas, 100% en línea, pago único de $39.900. PDF oficial al correo.",
    "h1": "Certificado de Tradición y Libertad en Florencia (Caquetá)",
    "intro": "Si estás comprando un apartamento en el barrio San Luis, vendiendo una finca en las veredas del piedemonte caqueteño o iniciando una sucesión sobre un predio urbano de Florencia, el Certificado de Tradición y Libertad es el documento que te dice quién es el propietario real, si la propiedad tiene hipotecas, embargos, gravámenes o limitaciones que puedan frenar el negocio. En Florencia, todos los predios están matriculados ante la Oficina de Registro de Instrumentos Públicos FLORENCIA — código 420. Nosotros lo tramitamos por ti, en línea y en minutos.",
    "comoObtener": "En Florencia, la matrícula inmobiliaria comienza con el código 420, asignado a la ORIP de esta ciudad. Solo necesitas ese número de matrícula —sin importar si el predio está en el centro histórico, en el barrio Comuneros o en una vereda rural del Caquetá— para solicitar tu certificado. El proceso es sencillo: ingresa la matrícula en nuestro formulario, paga $39.900 una sola vez con Wompi (tarjeta, PSE o Nequi) y en minutos recibes el PDF oficial en tu correo electrónico. Certitradición es un gestor privado que actúa en nombre del usuario; no somos canal oficial de la SNR ni del Gobierno Nacional.",
    "faqs": [
      {
        "q": "¿Qué es la ORIP de Florencia y qué significa el código 420?",
        "a": "La Oficina de Registro de Instrumentos Públicos (ORIP) de Florencia es la entidad estatal que inscribe y custodia los actos jurídicos sobre predios ubicados en Florencia y gran parte del departamento del Caquetá. El código 420 es el prefijo que identifica a esta oficina dentro del sistema nacional, y aparece al inicio del número de matrícula inmobiliaria de cada predio registrado en su jurisdicción."
      },
      {
        "q": "¿Cuánto cuesta obtener el certificado a través de Certitradición?",
        "a": "El costo del servicio de Certitradición es de $39.900 COP, pago único. Este valor cubre la gestión completa: consulta en el sistema de la SNR, generación del documento y entrega del PDF oficial a tu correo electrónico —y también por WhatsApp si lo solicitas— en cuestión de minutos. El certificado tiene una validez de 30 días calendario desde su expedición."
      },
      {
        "q": "¿Tengo que ir a las instalaciones de la ORIP en Florencia para tramitar el certificado?",
        "a": "No. No es necesario desplazarte a la sede de la ORIP ubicada en el centro de Florencia ni hacer fila. Certitradición realiza el trámite completamente en línea a través del portal de la Superintendencia de Notariado y Registro. Desde cualquier lugar del Caquetá —o del país— puedes solicitar el certificado de un predio en Florencia con solo tener el número de matrícula inmobiliaria a la mano."
      }
    ]
  },
  {
    "slug": "yopal",
    "ciudad": "Yopal",
    "departamento": "Casanare",
    "oficinas": [
      {
        "nombre": "YOPAL",
        "codigo": "470"
      }
    ],
    "metaTitle": "Certificado de Tradición Yopal – En línea",
    "metaDescription": "Obtén tu Certificado de Tradición y Libertad en Yopal (Casanare) en minutos. Sin filas, solo $39.900. PDF oficial al correo. ORIP código 470.",
    "h1": "Certificado de Tradición y Libertad en Yopal (Casanare)",
    "intro": "Si estás comprando un apartamento en el barrio La Managa, vendiendo una finca en la vereda Tilodirán o tramitando una sucesión de un predio ganadero en las sabanas del piedemonte casanareño, el primer documento que necesitas es el Certificado de Tradición y Libertad. Este certificado, expedido por la ORIP Yopal con código 470, te muestra el historial completo del inmueble: quién ha sido propietario, si tiene hipotecas, embargos, gravámenes o cualquier limitación legal vigente. Con Certitradición lo obtienes en minutos desde cualquier lugar.",
    "comoObtener": "Todo predio urbano o rural registrado en Yopal y el departamento de Casanare tiene su matrícula inmobiliaria con el prefijo 470, asignada por la Oficina de Registro de Instrumentos Públicos ORIP Yopal. Para obtener tu certificado con Certitradición solo necesitas ese número: ingrésalo en el formulario, realiza el pago único de $39.900 COP a través de Wompi (tarjeta, PSE o Nequi) y recibes el PDF oficial directamente en tu correo en cuestión de minutos. Certitradición es un gestor privado independiente; no es un canal oficial de la Superintendencia de Notariado y Registro ni del Gobierno colombiano.",
    "faqs": [
      {
        "q": "¿Qué es la ORIP Yopal y por qué el código 470 aparece en la matrícula?",
        "a": "La Oficina de Registro de Instrumentos Públicos (ORIP) de Yopal es la entidad estatal que inscribe y custodia los derechos sobre inmuebles en Casanare. El código 470 es el identificador territorial asignado a esta oficina, y es el prefijo que aparece al inicio de toda matrícula inmobiliaria del departamento, ya sea un lote en el barrio Arrayanes, una casa en Ciudadela Bochica o una finca en las llanuras del Cusiana."
      },
      {
        "q": "¿Cuánto cuesta obtener el certificado a través de Certitradición?",
        "a": "El costo es de $39.900 COP, pago único sin cargos adicionales. El pago se realiza de forma segura a través de Wompi, aceptando tarjetas débito y crédito, PSE o Nequi. Una vez confirmado el pago, el PDF oficial del certificado llega a tu correo electrónico en minutos, con una validez de 30 días calendario."
      },
      {
        "q": "¿Tengo que ir personalmente a la ORIP en Yopal para obtener el certificado?",
        "a": "No. Todo el proceso con Certitradición es completamente en línea, sin importar si estás en Yopal, en Bogotá o en cualquier otra ciudad. No necesitas desplazarte al centro de Yopal ni hacer fila en la sede de la ORIP. Solo necesitas el número de matrícula inmobiliaria prefijo 470 y conexión a internet para recibir el certificado en tu correo."
      }
    ]
  },
  {
    "slug": "arauca",
    "ciudad": "Arauca",
    "departamento": "Arauca",
    "oficinas": [
      {
        "nombre": "ARAUCA",
        "codigo": "410"
      }
    ],
    "metaTitle": "Certificado de Tradición Arauca | En línea",
    "metaDescription": "Obtén tu Certificado de Tradición y Libertad en Arauca en minutos. Sin filas, sin desplazamientos, por solo $39.900. PDF oficial directo a tu correo.",
    "h1": "Certificado de Tradición y Libertad en Arauca (Arauca): consúltalo hoy en línea",
    "intro": "Si estás negociando una vivienda en el barrio Sandoval, una finca en las veredas del piedemonte araucano o un local en el centro de la capital del Llano, lo primero que debes revisar es el Certificado de Tradición y Libertad. Este documento, expedido sobre las matrículas registradas en la ORIP Arauca (código 410), te muestra en detalle quién es el propietario actual, si el inmueble tiene hipotecas, embargos, gravámenes o cualquier limitación que pueda afectar la transacción. Ahora puedes obtenerlo sin salir de casa.",
    "comoObtener": "Todo predio ubicado en el municipio de Arauca y su área rural queda inscrito en la Oficina de Registro de Instrumentos Públicos con código 410, por lo que tu número de matrícula inmobiliaria comienza con ese prefijo. Para tramitar el certificado a través de Certitradición —gestor privado, no canal oficial de la SNR ni del Gobierno— solo necesitas ese número: ingrésalo en el formulario, paga $39.900 con Wompi (tarjeta, PSE o Nequi) y recibes el PDF oficial en cuestión de minutos en tu correo y, si lo prefieres, también por WhatsApp. Sin desplazamientos, sin filas en la ORIP.",
    "faqs": [
      {
        "q": "¿Cuál es la ORIP encargada de los predios en Arauca y qué significa el código 410?",
        "a": "Los inmuebles ubicados en el municipio de Arauca —desde el casco urbano hasta veredas como La Pesquera o Todos los Santos— están registrados en la Oficina de Registro de Instrumentos Públicos de Arauca. El código asignado a esa oficina es el 410, y ese número aparece como prefijo en toda matrícula inmobiliaria de la ciudad. Al ingresar tu matrícula en nuestro formulario, el sistema la reconoce automáticamente y consulta la información más actualizada disponible."
      },
      {
        "q": "¿Cuánto cuesta obtener el certificado y qué métodos de pago acepta Certitradición?",
        "a": "El servicio de Certitradición tiene un costo fijo de $39.900 COP por certificado, sin cobros adicionales ni suscripciones. El pago se realiza de forma segura a través de la pasarela Wompi, que acepta tarjetas débito y crédito, PSE y billeteras digitales como Nequi. Una vez confirmado el pago, el PDF oficial con plena validez jurídica llega a tu correo electrónico en minutos."
      },
      {
        "q": "¿Tengo que ir personalmente a la oficina de registro en Arauca para obtener este documento?",
        "a": "No. Certitradición es un gestor privado que realiza la consulta en línea por ti, de modo que no necesitas desplazarte hasta la ORIP Arauca ni hacer filas. El trámite es completamente digital: ingresas el número de matrícula inmobiliaria, realizas el pago y recibes el certificado en tu correo en pocos minutos, con validez de 30 días desde su expedición. Recuerda que Certitradición no es un canal oficial de la Superintendencia de Notariado y Registro."
      }
    ]
  },
  {
    "slug": "mocoa",
    "ciudad": "Mocoa",
    "departamento": "Putumayo",
    "oficinas": [
      {
        "nombre": "MOCOA",
        "codigo": "440"
      }
    ],
    "metaTitle": "Certificado de Tradición Mocoa – En Línea",
    "metaDescription": "Obtén el Certificado de Tradición y Libertad en Mocoa (Putumayo) en minutos, sin filas. Pago único de $39.900 con Wompi. PDF oficial al correo.",
    "h1": "Certificado de Tradición y Libertad en Mocoa (Putumayo)",
    "intro": "Si estás comprando un lote en el sector de La Esmeralda, vendiendo una casa en el barrio El Centro de Mocoa o tramitando una sucesión sobre un predio rural en la vereda El Pepino, necesitas el Certificado de Tradición y Libertad antes de firmar cualquier escritura. Este documento, expedido por la ORIP Mocoa (código 440), revela el historial completo del inmueble: quiénes han sido sus propietarios, si tiene hipotecas activas, embargos, servidumbres u otros gravámenes que puedan afectar la negociación. Con Certitradición lo solicitas en línea en minutos.",
    "comoObtener": "Todo predio ubicado en Mocoa y el resto del Putumayo queda matriculado ante la ORIP con código 440 como prefijo de la matrícula inmobiliaria. Para tramitar el certificado a través de Certitradición solo necesitas ese número de matrícula: ingrésalo en el formulario, realiza el pago único de $39.900 mediante Wompi (tarjeta, PSE o efectivo en corresponsal) y recibirás el PDF oficial directamente en tu correo electrónico —y por WhatsApp si lo prefieres— en cuestión de minutos. Importante: Certitradición es un gestor privado que actúa en nombre del usuario; no somos un canal oficial de la Superintendencia de Notariado y Registro ni del Gobierno colombiano. El certificado tiene validez de 30 días.",
    "faqs": [
      {
        "q": "¿Cuál es la ORIP de Mocoa y para qué sirve el código 440?",
        "a": "La Oficina de Registro de Instrumentos Públicos (ORIP) de Mocoa es la entidad adscrita a la Superintendencia de Notariado y Registro que inscribe todos los actos jurídicos sobre inmuebles en Putumayo. El código 440 es el identificador asignado a esta oficina y aparece como prefijo en toda matrícula inmobiliaria del departamento, por ejemplo 440-12345. Ese número es el que debes ingresar para consultar el certificado."
      },
      {
        "q": "¿Cuánto cuesta obtener el Certificado de Tradición y Libertad a través de Certitradición?",
        "a": "El costo del servicio de Certitradición es de $39.900 COP por certificado, pago único sin cobros adicionales. El pago se realiza de forma segura a través de Wompi, aceptando tarjetas débito y crédito, PSE y pagos en efectivo por corresponsal bancario. Una vez confirmado el pago, el PDF oficial del certificado llega a tu correo en minutos."
      },
      {
        "q": "¿Tengo que ir personalmente a las oficinas de la ORIP en Mocoa para solicitar el certificado?",
        "a": "No. Gracias al servicio en línea de Certitradición puedes obtener el certificado desde cualquier lugar, sin desplazarte al centro de Mocoa ni hacer filas en la ORIP. Esto es especialmente útil para propietarios de predios en veredas alejadas como Alto Afán o San Antonio del Pepino, o para compradores que están negociando desde otra ciudad y necesitan verificar el estado jurídico del inmueble antes de viajar."
      }
    ]
  },
  {
    "slug": "leticia",
    "ciudad": "Leticia",
    "departamento": "Amazonas",
    "oficinas": [
      {
        "nombre": "LETICIA",
        "codigo": "400"
      }
    ],
    "metaTitle": "Certificado de Tradición Leticia – Online $39.900",
    "metaDescription": "Obtén el Certificado de Tradición y Libertad en Leticia (Amazonas) en minutos desde $39.900. Sin filas, sin desplazamientos, PDF oficial al correo.",
    "h1": "Certificado de Tradición y Libertad en Leticia (Amazonas)",
    "intro": "Si estás comprando una finca en el kilómetro 11 vía Leticia-Tarapacá, cerrando la venta de un apartamento en el barrio Centro o tramitando la sucesión de un lote en La Chorrera, necesitas el Certificado de Tradición y Libertad para conocer quién es el propietario y si el predio tiene hipotecas, embargos o limitaciones. Este documento lo expide la ORIP LETICIA, código 400, que registra todos los predios del departamento del Amazonas. Con Certitradición lo solicitas en línea en minutos, sin moverse de casa.",
    "comoObtener": "Los predios del Amazonas tienen matrícula inmobiliaria con prefijo 400, asignada por la ORIP LETICIA. Para tramitar tu certificado no necesitas desplazarte hasta la oficina ubicada en el centro de Leticia: ingresa el número de matrícula en nuestro formulario, realiza el pago de $39.900 mediante Wompi (tarjeta, PSE o Nequi) y en cuestión de minutos recibirás el PDF oficial en tu correo y, si lo prefieres, por WhatsApp. Certitradición es un gestor privado que facilita este trámite en línea; no somos canal oficial de la Superintendencia de Notariado y Registro ni del Gobierno colombiano.",
    "faqs": [
      {
        "q": "¿Qué es la ORIP de Leticia y qué significa el código 400 en la matrícula?",
        "a": "La Oficina de Registro de Instrumentos Públicos (ORIP) de Leticia es la entidad estatal que inscribe y certifica todos los actos sobre bienes inmuebles en el departamento del Amazonas. El código 400 es el prefijo que identifica esta oficina: si la matrícula de tu predio comienza por 400, significa que está registrado en Leticia y solo la ORIP LETICIA puede expedir su Certificado de Tradición y Libertad."
      },
      {
        "q": "¿Cuánto cuesta el Certificado de Tradición y Libertad en Leticia con Certitradición?",
        "a": "El servicio de Certitradición tiene un costo de $39.900 COP, pago único. No hay cobros adicionales ni suscripciones. El pago se realiza de forma segura a través de Wompi, que acepta tarjetas débito y crédito, PSE y Nequi. El certificado con validez de 30 días llega directamente a tu correo electrónico en pocos minutos."
      },
      {
        "q": "¿Tengo que ir personalmente a la oficina de Leticia para obtener el certificado?",
        "a": "No. Gracias a la plataforma en línea de Certitradición puedes solicitar el certificado desde cualquier lugar, ya sea que estés en Leticia, en Bogotá o fuera del país. Solo necesitas el número de matrícula inmobiliaria con prefijo 400. Esto es especialmente útil en Leticia, donde la distancia y la conectividad pueden dificultar los trámites presenciales en la ORIP."
      }
    ]
  },
  {
    "slug": "san-andres",
    "ciudad": "San Andrés",
    "departamento": "Archipiélago de San Andrés",
    "oficinas": [
      {
        "nombre": "SAN ANDRES (Isla)",
        "codigo": "450"
      }
    ],
    "metaTitle": "Certificado de Tradición San Andrés Isla | En Línea",
    "metaDescription": "Obtén el Certificado de Tradición y Libertad en San Andrés (Archipiélago) por $39.900. PDF oficial en minutos, sin filas ni desplazamientos. Pago seguro con Wompi.",
    "h1": "Certificado de Tradición y Libertad en San Andrés (Archipiélago de San Andrés)",
    "intro": "Si estás comprando un apartamento en El Centro, vendiendo una casa en El Cliff o gestionando una sucesión de un predio en North End, necesitas el Certificado de Tradición y Libertad para conocer los propietarios actuales, hipotecas, embargos y cualquier gravamen que pese sobre el inmueble. En San Andrés, todas las matrículas inmobiliarias están registradas en la ORIP SAN ANDRES (Isla), identificada con el código 450. Certitradición tramita este documento de forma completamente digital, sin que tengas que desplazarte hasta la oficina ni hacer fila.",
    "comoObtener": "Los predios de la isla —desde cabañas en Sound Bay hasta locales en la Avenida Newball— tienen matrícula inmobiliaria con prefijo 450, asignada por la ORIP SAN ANDRES (Isla). Para obtener el certificado con Certitradición, ingresa ese número de matrícula en el formulario, realiza el pago único de $39.900 a través de Wompi y recibirás el PDF oficial en tu correo electrónico (y por WhatsApp si lo prefieres) en cuestión de minutos. Certitradición es un gestor privado; no somos la Superintendencia de Notariado y Registro ni un canal oficial del Gobierno. El documento tiene validez de 30 días.",
    "faqs": [
      {
        "q": "¿Cuál es la ORIP de San Andrés y qué significa el código 450?",
        "a": "La Oficina de Registro de Instrumentos Públicos competente para la isla de San Andrés es la ORIP SAN ANDRES (Isla). El código 450 es el prefijo que identifica a esta oficina y aparece al inicio de toda matrícula inmobiliaria de predios ubicados en el Archipiélago de San Andrés, Providencia y Santa Catalina. Si tu matrícula empieza con 450, el certificado lo expide esa ORIP."
      },
      {
        "q": "¿Cuánto cuesta el Certificado de Tradición y Libertad en San Andrés?",
        "a": "A través de Certitradición el costo es de $39.900 COP, pago único que se realiza de forma segura con Wompi. No hay cobros adicionales ni sorpresas. Por ese valor gestionamos el documento ante la SNR y te lo enviamos en PDF directamente a tu correo, con validez de 30 días a partir de su expedición."
      },
      {
        "q": "¿Tengo que ir en persona a la ORIP de San Andrés para obtener el certificado?",
        "a": "No. Gracias a la plataforma en línea de la SNR, el trámite es 100% digital. Certitradición lo gestiona por ti: solo necesitas el número de matrícula inmobiliaria (prefijo 450), pagas en línea y recibes el PDF en minutos. No tienes que ir a la oficina en la isla, pedir cita presencial ni desplazarte desde ningún punto del Archipiélago."
      }
    ]
  },
  {
    "slug": "inirida",
    "ciudad": "Inírida",
    "departamento": "Guainía",
    "oficinas": [
      {
        "nombre": "INIRIDA",
        "codigo": "500"
      }
    ],
    "metaTitle": "Certificado de Tradición Inírida | En línea",
    "metaDescription": "Obtén tu Certificado de Tradición y Libertad en Inírida (Guainía) en minutos. Sin filas, 100% en línea, pago único de $39.900. PDF oficial al correo.",
    "h1": "Certificado de Tradición y Libertad en Inírida (Guainía): Consúltalo en Minutos",
    "intro": "En Inírida, capital del Guainía, el mercado inmobiliario se mueve tanto en el casco urbano —desde el barrio Primero de Mayo hasta sectores como La Esmeralda, cerca del río Inírida— como en zonas rurales y veredas alejadas del Atabapo. Si estás comprando un lote, vendiendo una vivienda, tramitando una sucesión o poniendo un predio como garantía hipotecaria, el primer paso obligatorio es el Certificado de Tradición y Libertad. Este documento, expedido por la ORIP INIRIDA (código 500), revela propietarios actuales e históricos, hipotecas, embargos, gravámenes y cualquier limitación que pese sobre el inmueble.",
    "comoObtener": "Todo predio registrado en Inírida lleva una matrícula inmobiliaria con prefijo 500, asignada por la ORIP INIRIDA. Para obtener tu certificado a través de Certitradición —gestor privado, no canal oficial de la Superintendencia de Notariado y Registro ni del Gobierno colombiano— solo necesitas ese número. El proceso es sencillo: ingresa la matrícula en nuestra plataforma, realiza el pago único de $39.900 con Wompi (tarjeta, PSE o Nequi) y en minutos recibirás el PDF oficial vigente directamente en tu correo electrónico y, si lo prefieres, por WhatsApp. El certificado tiene validez de 30 días.",
    "faqs": [
      {
        "q": "¿Qué es la ORIP INIRIDA y qué significa el código 500 en la matrícula inmobiliaria?",
        "a": "La Oficina de Registro de Instrumentos Públicos de Inírida, conocida como ORIP INIRIDA, es la entidad pública que inscribe y custodia todos los actos sobre predios del departamento de Guainía. El código 500 es el identificador de esa oficina y aparece como prefijo en toda matrícula inmobiliaria registrada en Inírida, ya sea en el casco urbano, en sectores ribereños del Inírida o en terrenos rurales del Guainía. Ese número es indispensable para consultar el historial del predio."
      },
      {
        "q": "¿Cuánto cuesta obtener el certificado con Certitradición y qué incluye ese valor?",
        "a": "El servicio de Certitradición tiene un costo único de $39.900 COP por matrícula. Ese valor cubre la gestión en línea, el procesamiento del trámite ante la plataforma oficial y la entrega del PDF con el Certificado de Tradición y Libertad vigente, directamente en tu correo (y por WhatsApp si lo solicitas). No hay cobros ocultos ni tarifas adicionales. El pago se realiza de forma segura a través de Wompi, con opciones como tarjeta débito o crédito, PSE o Nequi."
      },
      {
        "q": "¿Tengo que desplazarme a la ORIP en Inírida para obtener el certificado?",
        "a": "No. Dado que Inírida es una ciudad con acceso limitado por vía terrestre —a la que se llega principalmente por avión o por ríos como el Inírida o el Guaviare— la posibilidad de tramitar este documento 100% en línea es especialmente valiosa. Con Certitradición no necesitas acercarte a ninguna oficina ni hacer filas. Desde cualquier dispositivo con internet, en Inírida o desde cualquier parte de Colombia, puedes ingresar el número de matrícula, pagar y recibir el PDF oficial en minutos."
      }
    ]
  },
  {
    "slug": "san-jose-del-guaviare",
    "ciudad": "San José del Guaviare",
    "departamento": "Guaviare",
    "oficinas": [
      {
        "nombre": "SAN JOSE DEL GUAVIAR",
        "codigo": "480"
      }
    ],
    "metaTitle": "Certificado de Tradición San José del Guaviare",
    "metaDescription": "Obtén tu Certificado de Tradición y Libertad en San José del Guaviare en línea, sin filas, en minutos. Pago único de $39.900 por Wompi. PDF oficial al correo.",
    "h1": "Certificado de Tradición y Libertad en San José del Guaviare (Guaviare)",
    "intro": "Si estás comprando una finca en la vereda La Libertad, un apartamento en el barrio La Alborada o un lote en la zona de expansión urbana cerca al aeropuerto de San José del Guaviare, necesitas el Certificado de Tradición y Libertad antes de firmar cualquier escritura. Este documento, expedido por la ORIP SAN JOSE DEL GUAVIAR (código 480), revela los propietarios actuales e históricos del predio, hipotecas vigentes, embargos, gravámenes y cualquier limitación legal. Con Certitradición lo gestionas en línea y recibes el PDF oficial en minutos.",
    "comoObtener": "Todo predio inscrito en San José del Guaviare y el departamento del Guaviare lleva una matrícula inmobiliaria que comienza con el prefijo 480, asignado por la ORIP local. Para obtener tu certificado solo necesitas ese número: ingrésalo en nuestro formulario, paga $39.900 (pago único) de forma segura con Wompi y recibirás el PDF oficial directamente en tu correo, con envío opcional por WhatsApp, en cuestión de minutos. Certitradición es un gestor privado independiente; tramitamos el documento en línea en tu nombre, pero no somos un canal oficial de la Superintendencia de Notariado y Registro ni del Gobierno colombiano.",
    "faqs": [
      {
        "q": "¿Cuál es la ORIP de San José del Guaviare y qué significa el código 480?",
        "a": "La Oficina de Registro de Instrumentos Públicos que cubre San José del Guaviare y el resto del departamento del Guaviare se denomina ORIP SAN JOSE DEL GUAVIAR. El código 480 es el identificador que esta oficina asigna a todas las matrículas inmobiliarias del departamento, por lo que cualquier predio registrado allí, ya sea en el casco urbano, en veredas como Caño Grande o Agua Bonita, o en zonas rurales del Guaviare, tendrá una matrícula que empieza con 480."
      },
      {
        "q": "¿Cuánto cuesta obtener el Certificado de Tradición a través de Certitradición?",
        "a": "El costo del servicio es de $39.900 COP, un pago único que se realiza de forma segura a través de Wompi. No hay cobros adicionales ni sorpresas: ese valor incluye la gestión completa del trámite y la entrega del PDF oficial en tu correo electrónico, con la opción de recibirlo también por WhatsApp."
      },
      {
        "q": "¿Tengo que ir personalmente a la ORIP en San José del Guaviare para obtener el certificado?",
        "a": "No. Gracias a la plataforma en línea de Certitradición, no necesitas desplazarte hasta las instalaciones de la ORIP en San José del Guaviare ni hacer filas. El trámite se realiza completamente en línea: ingresas tu número de matrícula inmobiliaria, realizas el pago y recibes el certificado en minutos sin salir de tu casa u oficina, algo especialmente útil si te encuentras en una zona rural del Guaviare o fuera del departamento."
      }
    ]
  },
  {
    "slug": "mitu",
    "ciudad": "Mitú",
    "departamento": "Vaupés",
    "oficinas": [
      {
        "nombre": "MITÚ",
        "codigo": "520"
      }
    ],
    "metaTitle": "Certificado de Tradición Mitú | En línea $39.900",
    "metaDescription": "Obtén tu Certificado de Tradición y Libertad en Mitú (Vaupés) en minutos. Sin filas, 100% en línea, pago único de $39.900. PDF oficial al correo.",
    "h1": "Certificado de Tradición y Libertad en Mitú (Vaupés)",
    "intro": "Si estás comprando una finca sobre el río Vaupés, vendiendo un predio en el casco urbano de Mitú o adelantando una sucesión familiar en las comunidades indígenas del departamento, el Certificado de Tradición y Libertad es el documento que confirma quién es el propietario real y si el inmueble tiene hipotecas, embargos o limitaciones vigentes. Este certificado lo expide la ORIP MITÚ (código 520), oficina que registra todas las matrículas inmobiliarias del Vaupés. Con Certitradición lo obtienes en minutos, sin desplazarte hasta la oficina física.",
    "comoObtener": "Todo predio en Mitú y en el Vaupés queda registrado en la ORIP código 520; ese código encabeza el número de matrícula inmobiliaria que aparece en la escritura pública o en el impuesto predial. Con ese número en mano, el proceso en Certitradición es directo: ingresas la matrícula en el formulario, realizas el pago único de $39.900 COP a través de Wompi (tarjeta, PSE o Nequi) y en pocos minutos recibes el PDF oficial en tu correo y, si lo prefieres, por WhatsApp. Certitradición es un gestor privado que tramita el certificado en nombre del usuario; no somos la Superintendencia de Notariado y Registro ni un canal gubernamental oficial.",
    "faqs": [
      {
        "q": "¿Qué es la ORIP de Mitú y qué significa el código 520?",
        "a": "La Oficina de Registro de Instrumentos Públicos de Mitú es la entidad estatal que inscribe todos los actos relacionados con inmuebles en el departamento del Vaupés: compraventas, hipotecas, embargos, servidumbres y más. El código 520 es el identificador de esa oficina y forma el prefijo de cada matrícula inmobiliaria registrada allí, ya sea un lote en el barrio Centro de Mitú, una parcela ribereña o un predio en zonas como Monfort o Yuruparí."
      },
      {
        "q": "¿Cuánto cuesta obtener el certificado a través de Certitradición?",
        "a": "El valor del servicio es de $39.900 COP, pago único sin costos ocultos. Este valor cubre la gestión en línea, el procesamiento de la solicitud ante el sistema de la SNR y la entrega del PDF oficial con validez de 30 días. El pago se realiza de forma segura a través de Wompi, plataforma que acepta tarjetas débito y crédito, PSE y billeteras digitales como Nequi."
      },
      {
        "q": "¿Es necesario ir personalmente a la ORIP de Mitú para obtener el certificado?",
        "a": "No. Gracias a la plataforma en línea de la SNR, el certificado se puede tramitar sin presentarse físicamente en la oficina ubicada en Mitú, lo cual es especialmente útil para propietarios que residen fuera del Vaupés o en zonas de difícil acceso del departamento. Certitradición gestiona todo el proceso de forma remota: solo necesitas el número de matrícula y recibes el documento oficial en tu correo electrónico en cuestión de minutos."
      }
    ]
  },
  {
    "slug": "puerto-carreno",
    "ciudad": "Puerto Carreño",
    "departamento": "Vichada",
    "oficinas": [
      {
        "nombre": "PUERTO CARREÑO",
        "codigo": "540"
      }
    ],
    "metaTitle": "Certificado de Tradición Puerto Carreño | $39.900",
    "metaDescription": "Obtén tu Certificado de Tradición y Libertad en Puerto Carreño (Vichada) en minutos. Sin filas, 100% en línea, pago único de $39.900. PDF oficial al correo.",
    "h1": "Certificado de Tradición y Libertad en Puerto Carreño (Vichada)",
    "intro": "¿Vas a comprar una finca en la vereda Caño Grulla, un lote en el barrio La Paz o un apartamento cerca del malecón del río Meta en Puerto Carreño? Antes de firmar cualquier promesa de compraventa, necesitas el Certificado de Tradición y Libertad para conocer quién figura como propietario real, si el predio carga hipotecas, embargos, gravámenes o limitaciones de dominio. Este documento lo expide la ORIP Puerto Carreño — código 540 — y es la fuente oficial del historial jurídico de todo inmueble matriculado en el Vichada.",
    "comoObtener": "Todo predio urbano o rural registrado en Puerto Carreño lleva matrícula inmobiliaria con prefijo 540, asignada por la ORIP local. Para obtener tu certificado a través de Certitradición — un gestor privado independiente, sin vínculo con la Superintendencia de Notariado y Registro ni con el Gobierno — solo sigues tres pasos: ingresa el número de matrícula 540-XXXXX en el formulario, realiza el pago único de $39.900 COP a través de Wompi y recibe el PDF oficial en tu correo electrónico (y WhatsApp si lo prefieres) en cuestión de minutos. Sin desplazarte hasta las oficinas sobre la Avenida Orinoco ni hacer filas.",
    "faqs": [
      {
        "q": "¿Qué es la ORIP de Puerto Carreño y qué código tiene?",
        "a": "La Oficina de Registro de Instrumentos Públicos (ORIP) de Puerto Carreño es la entidad estatal que inscribe y custodia el historial jurídico de los predios del Vichada. Su código oficial es el 540, que aparece como prefijo en toda matrícula inmobiliaria del departamento, ya sea un predio urbano en el casco de Puerto Carreño o una finca en zonas rurales como el corredor del río Bita o las sabanas del Tuparro."
      },
      {
        "q": "¿Cuánto cuesta obtener el certificado con Certitradición?",
        "a": "El servicio de gestión tiene un costo de $39.900 COP, pago único procesado de forma segura mediante Wompi. Este valor cubre la consulta, la obtención del PDF oficial con sello de la SNR y la entrega al correo electrónico registrado. No hay cobros adicionales ni suscripciones."
      },
      {
        "q": "¿Tengo que ir personalmente a las oficinas en Puerto Carreño?",
        "a": "No. Dado que Puerto Carreño está a más de 700 km de Bogotá y su acceso aéreo o fluvial puede ser complejo, Certitradición tramita el certificado completamente en línea. No necesitas desplazarte a ninguna oficina: con el número de matrícula inmobiliaria (prefijo 540) el proceso se hace desde tu celular o computador, sin importar si estás en la capital del Vichada o en cualquier otra ciudad del país."
      }
    ]
  },
  {
    "slug": "barrancabermeja",
    "ciudad": "Barrancabermeja",
    "departamento": "Santander",
    "oficinas": [
      {
        "nombre": "BARRANCABERMEJA",
        "codigo": "303"
      }
    ],
    "metaTitle": "Certificado de Tradición Barrancabermeja | Online",
    "metaDescription": "Obtén el Certificado de Tradición y Libertad en Barrancabermeja en minutos. Sin filas, 100% en línea. Pago único de $39.900 con Wompi. PDF oficial al correo.",
    "h1": "Certificado de Tradición y Libertad en Barrancabermeja (Santander)",
    "intro": "Si vas a comprar un apartamento en El Centro, vender una casa en el barrio Olaya Herrera, heredar un lote en la vereda El Llanito o hipotecar una propiedad cerca del puerto petrolero, lo primero que necesitas es el Certificado de Tradición y Libertad. Este documento, expedido por la ORIP BARRANCABERMEJA con código 303, revela quién figura como propietario real del predio, si tiene hipotecas activas, embargos judiciales, servidumbres u otros gravámenes. Con Certitradición lo gestionamos en línea por ti, sin que tengas que desplazarte a ninguna oficina en Barrancabermeja.",
    "comoObtener": "Todo predio ubicado en Barrancabermeja —desde una bodega en la Zona Industrial hasta una vivienda en el barrio Ciudad Bolívar— tiene su matrícula inmobiliaria registrada en la ORIP código 303. Para tramitar el certificado solo necesitas ese número de matrícula. Ingresa el número en nuestro formulario, realiza el pago único de $39.900 a través de Wompi (tarjeta, PSE o Nequi) y en cuestión de minutos recibirás el PDF oficial en tu correo y, si lo prefieres, también por WhatsApp. Certitradición es un gestor privado y no tiene afiliación con la Superintendencia de Notariado y Registro ni con entidades del Gobierno colombiano.",
    "faqs": [
      {
        "q": "¿Qué es la ORIP de Barrancabermeja y qué significa el código 303?",
        "a": "La Oficina de Registro de Instrumentos Públicos (ORIP) de Barrancabermeja es la entidad adscrita a la Superintendencia de Notariado y Registro que registra y custodia todos los actos sobre inmuebles ubicados en el municipio y su área de influencia en el Magdalena Medio santandereano. El código 303 es el identificador oficial de esa ORIP y aparece como prefijo en toda matrícula inmobiliaria de la ciudad: por ejemplo, 303-XXXXX. Es el número que necesitas para solicitar tu certificado."
      },
      {
        "q": "¿Cuánto cuesta obtener el certificado a través de Certitradición?",
        "a": "El servicio tiene un costo fijo de $39.900 COP, pago único. No hay cobros adicionales ni suscripciones. El pago se realiza de forma segura mediante Wompi, que acepta tarjetas débito y crédito, PSE y billeteras como Nequi. Una vez confirmado el pago, el PDF oficial del certificado se envía directamente a tu correo electrónico en minutos."
      },
      {
        "q": "¿Tengo que ir personalmente a alguna oficina en Barrancabermeja para obtener el certificado?",
        "a": "No. Todo el proceso es 100% en línea, sin importar si estás en el barrio Versalles, en Bogotá o en el exterior. Certitradición gestiona el trámite de manera digital por ti. El certificado tiene una validez de 30 días desde su expedición y llega en formato PDF, listo para presentar ante notarías, bancos, juzgados o cualquier otra entidad que lo requiera."
      }
    ]
  },
  {
    "slug": "palmira",
    "ciudad": "Palmira",
    "departamento": "Valle del Cauca",
    "oficinas": [
      {
        "nombre": "PALMIRA",
        "codigo": "378"
      }
    ],
    "metaTitle": "Certificado de Tradición Palmira | En línea",
    "metaDescription": "Obtén el Certificado de Tradición y Libertad en Palmira (Valle del Cauca) en minutos. Sin filas, 100% en línea. Solo $39.900 por Wompi. PDF oficial al correo.",
    "h1": "Certificado de Tradición y Libertad en Palmira (Valle del Cauca)",
    "intro": "Si estás comprando un apartamento en El Prado, vendiendo una finca en la vereda Palmaseca o gestionando una sucesión en El Recreo, el Certificado de Tradición y Libertad es el documento que revela la historia real del predio: quiénes han sido sus propietarios, si tiene hipotecas activas, embargos judiciales, servidumbres o cualquier limitación que afecte la propiedad. En Palmira, todos los predios se registran ante la ORIP PALMIRA (código 378), y ese número de matrícula es todo lo que necesitas para solicitar el tuyo con Certitradición.",
    "comoObtener": "Los inmuebles de Palmira — desde los conjuntos cerrados de Llano Grande hasta los lotes industriales cerca del corredor vial Cali-Palmira — tienen su matrícula inmobiliaria bajo el código de ORIP 378. Con ese número en mano, el proceso en Certitradición es directo: ingresas la matrícula en el formulario, pagas $39.900 (pago único) a través de Wompi con tarjeta débito, crédito o PSE, y en pocos minutos recibes el PDF oficial en tu correo y, si lo prefieres, por WhatsApp. Certitradición es un gestor privado independiente; no somos la SNR ni un canal gubernamental oficial, pero tramitamos el certificado por ti de forma rápida y segura.",
    "faqs": [
      {
        "q": "¿Qué es la ORIP de Palmira y por qué su código es el 378?",
        "a": "La Oficina de Registro de Instrumentos Públicos (ORIP) de Palmira es la entidad adscrita a la Superintendencia de Notariado y Registro que inscribe y custodia todos los actos sobre bienes inmuebles del municipio y su área de influencia en el norte del Valle del Cauca. El código 378 es el prefijo oficial asignado a esta oficina, por lo que todas las matrículas inmobiliarias de Palmira comienzan con ese número."
      },
      {
        "q": "¿Cuánto cuesta solicitar el certificado a través de Certitradición?",
        "a": "El valor del servicio es de $39.900 COP, pago único sin cargos ocultos. Se paga de forma segura con Wompi (tarjeta débito, crédito o PSE). Este costo cubre la gestión completa: consulta ante el sistema de registro, emisión del PDF oficial con código de verificación y entrega al correo electrónico que registres."
      },
      {
        "q": "¿Tengo que ir personalmente a la ORIP de Palmira para obtener el certificado?",
        "a": "No. El Certificado de Tradición y Libertad se puede obtener de forma completamente virtual desde cualquier lugar. Con Certitradición solo necesitas el número de matrícula inmobiliaria, tu correo electrónico y realizar el pago en línea. En minutos recibes el PDF válido por 30 días, sin desplazarte ni hacer fila en la oficina ubicada en el centro de Palmira."
      }
    ]
  },
  {
    "slug": "buenaventura",
    "ciudad": "Buenaventura",
    "departamento": "Valle del Cauca",
    "oficinas": [
      {
        "nombre": "BUENAVENTURA",
        "codigo": "372"
      }
    ],
    "metaTitle": "Certificado de Tradición Buenaventura | Online",
    "metaDescription": "Obtén tu Certificado de Tradición y Libertad en Buenaventura en minutos. Sin filas en la ORIP, 100% en línea. Solo $39.900 COP. PDF oficial al instante.",
    "h1": "Certificado de Tradición y Libertad en Buenaventura (Valle del Cauca)",
    "intro": "Si estás comprando una casa en el barrio Punta del Este, vendiendo un lote en la vereda Citronela o tramitando una sucesión en la zona de Cascajal, el Certificado de Tradición y Libertad es el documento que te dice quién es el dueño real del predio y si tiene hipotecas, embargos o limitaciones. En Buenaventura, todos los inmuebles quedan registrados ante la ORIP BUENAVENTURA (código 372), y este certificado es el paso obligatorio antes de firmar cualquier escritura o solicitar un crédito hipotecario. Aquí lo obtienes sin salir de casa.",
    "comoObtener": "Cada predio en Buenaventura tiene una matrícula inmobiliaria que empieza con el código 372, asignado por la ORIP BUENAVENTURA. Con ese número en mano, el trámite en Certitradición toma minutos: ingresas la matrícula en nuestro formulario, pagas $39.900 COP de forma segura con Wompi y recibes el PDF oficial del certificado en tu correo (también disponible por WhatsApp). El documento tiene validez de 30 días. Certitradición es un gestor privado que realiza el trámite en línea en tu nombre; no somos un canal oficial de la Superintendencia de Notariado y Registro (SNR) ni del Gobierno colombiano.",
    "faqs": [
      {
        "q": "¿Qué es la ORIP de Buenaventura y qué significa el código 372?",
        "a": "La Oficina de Registro de Instrumentos Públicos (ORIP) de Buenaventura es la entidad del Estado que inscribe y custodia todos los actos relacionados con inmuebles en el municipio y su área rural en el Valle del Cauca. El código 372 identifica a esta oficina y aparece como prefijo en cada matrícula inmobiliaria registrada en Buenaventura, desde apartamentos en el sector de La Playita hasta fincas en corregimientos como Ladrilleros o Juanchaco."
      },
      {
        "q": "¿Cuánto cuesta obtener el certificado a través de Certitradición?",
        "a": "El costo del servicio de Certitradición es de $39.900 COP, pago único. Este valor cubre la gestión completa: consulta ante la ORIP BUENAVENTURA, generación del PDF oficial y entrega inmediata a tu correo electrónico y, si lo deseas, por WhatsApp. El pago se realiza de forma segura a través de Wompi, que acepta tarjetas débito, crédito y PSE."
      },
      {
        "q": "¿Tengo que ir personalmente a la ORIP de Buenaventura para obtener el certificado?",
        "a": "No. Gracias al sistema en línea de la SNR y al servicio de Certitradición como gestor privado, no necesitas desplazarte hasta las instalaciones de la ORIP en Buenaventura ni hacer fila. El trámite es completamente virtual: solo necesitas el número de matrícula inmobiliaria con prefijo 372 y conexión a internet. En cuestión de minutos recibes el documento válido por 30 días en tu correo."
      }
    ]
  },
  {
    "slug": "tulua",
    "ciudad": "Tuluá",
    "departamento": "Valle del Cauca",
    "oficinas": [
      {
        "nombre": "TULUA",
        "codigo": "384"
      }
    ],
    "metaTitle": "Certificado de Tradición Tuluá | En línea $39.900",
    "metaDescription": "Obtén el Certificado de Tradición y Libertad en Tuluá en minutos. Sin filas, pago de $39.900 por Wompi y PDF oficial en tu correo. ORIP Tuluá código 384.",
    "h1": "Certificado de Tradición y Libertad en Tuluá (Valle del Cauca)",
    "intro": "Si estás comprando un apartamento en el barrio El Paraíso, vendiendo una finca en la vereda El Overo o tramitando una sucesión en la zona rural del corredor vial hacia Buga, lo primero que necesitas es el Certificado de Tradición y Libertad de tu predio. Este documento oficial, expedido por la ORIP TULUA (código 384), muestra la historia jurídica completa del inmueble: quiénes han sido sus propietarios, si tiene hipotecas activas, embargos, gravámenes o cualquier limitación que pueda complicar tu negocio. Con Certitradición lo obtienes en minutos, desde cualquier lugar del Valle del Cauca.",
    "comoObtener": "Todos los predios ubicados en Tuluá y sus corregimientos —desde urbanizaciones en La Luisa hasta parcelas en la zona cafetera de Barragán— están matriculados ante la Oficina de Registro de Instrumentos Públicos con el prefijo 384. Solo necesitas ese número de matrícula inmobiliaria para comenzar. El proceso es simple: ingresa la matrícula en nuestro formulario, realiza el pago único de $39.900 a través de Wompi y en minutos recibes el PDF oficial en tu correo o WhatsApp. Certitradición es un gestor privado; no somos la SNR ni un canal gubernamental, pero tramitamos tu consulta de forma segura y ágil.",
    "faqs": [
      {
        "q": "¿Qué es la ORIP de Tuluá y qué significa el código 384 en mi matrícula?",
        "a": "La Oficina de Registro de Instrumentos Públicos (ORIP) de Tuluá es la entidad de la Superintendencia de Notariado y Registro que tiene jurisdicción sobre los predios del municipio y buena parte del centro del Valle del Cauca. El código 384 es el identificador asignado a esta oficina, y aparece como prefijo en cada número de matrícula inmobiliaria de la zona. Por ejemplo, una matrícula con prefijo 384-XXXXXX pertenece a un predio registrado en esta sede."
      },
      {
        "q": "¿Cuánto cuesta obtener el Certificado de Tradición y Libertad a través de Certitradición?",
        "a": "El servicio tiene un costo fijo de $39.900 COP, sin cobros adicionales ni suscripciones. El pago se realiza de forma segura a través de Wompi, plataforma que acepta tarjetas débito, crédito y PSE. Una vez confirmado el pago, gestionamos la consulta ante el sistema de la SNR y te enviamos el PDF oficial con el histórico del predio, propietarios, hipotecas, embargos y gravámenes. El certificado tiene validez de 30 días."
      },
      {
        "q": "¿Tengo que ir personalmente a la ORIP de Tuluá para obtener el certificado?",
        "a": "No. El Certificado de Tradición y Libertad se puede consultar en línea a través de los sistemas habilitados, sin necesidad de desplazarte hasta las instalaciones de la ORIP en Tuluá. Con Certitradición, nosotros hacemos la gestión por ti: tú ingresas la matrícula, pagas y recibes el documento en tu correo electrónico o WhatsApp en cuestión de minutos, sin filas ni trámites presenciales. Esto es especialmente útil si resides fuera del municipio o en otra ciudad del país."
      }
    ]
  },
  {
    "slug": "buga",
    "ciudad": "Buga",
    "departamento": "Valle del Cauca",
    "oficinas": [
      {
        "nombre": "BUGA",
        "codigo": "373"
      }
    ],
    "metaTitle": "Certificado de Tradición Buga – En Línea",
    "metaDescription": "Obtén el Certificado de Tradición y Libertad en Buga (Valle del Cauca) en minutos desde casa. Sin filas, PDF oficial por $39.900. ORIP código 373.",
    "h1": "Certificado de Tradición y Libertad en Buga (Valle del Cauca)",
    "intro": "Si vas a comprar una casa en el barrio El Paraíso, vender una finca en la vereda Guabas o tramitar una sucesión de un predio en el sector de la Guadalajara, lo primero que necesitas es el Certificado de Tradición y Libertad. Este documento, emitido por la ORIP BUGA con código 373, revela quién es el propietario real del inmueble, si tiene hipotecas, embargos, gravámenes o cualquier limitación vigente. En Certitradición lo gestionamos por ti en línea, sin que tengas que desplazarte ni hacer filas.",
    "comoObtener": "En Buga, todo predio urbano o rural —desde un apartamento en el centro histórico hasta una parcela en las veredas del piedemonte hacia el lago Calima— queda matriculado en la ORIP código 373. Solo necesitas ese número de matrícula inmobiliaria. El proceso con Certitradición es simple: ingresa el número de matrícula en nuestro formulario, paga $39.900 con Wompi (tarjeta, PSE o Nequi) y en minutos recibes el PDF oficial en tu correo y, si lo prefieres, por WhatsApp. Certitradición es un gestor privado; no somos un canal oficial de la Superintendencia de Notariado y Registro (SNR) ni del Gobierno colombiano.",
    "faqs": [
      {
        "q": "¿Qué es la ORIP de Buga y por qué tiene el código 373?",
        "a": "La Oficina de Registro de Instrumentos Públicos de Buga (ORIP BUGA) es la entidad adscrita a la Superintendencia de Notariado y Registro que inscribe todos los actos sobre inmuebles ubicados en Guadalajara de Buga y varios municipios del centro del Valle del Cauca. El código 373 es el identificador único de esa oficina y forma el prefijo de cada matrícula inmobiliaria registrada allí, por ejemplo 373-XXXXXX."
      },
      {
        "q": "¿Cuánto cuesta obtener el certificado con Certitradición?",
        "a": "El servicio tiene un valor fijo de $39.900 COP, pago único. No hay cobros adicionales ni sorpresas. El pago se realiza de forma segura a través de Wompi, que acepta tarjetas débito y crédito, PSE y Nequi. Una vez confirmado el pago, el PDF oficial llega a tu correo en cuestión de minutos y tiene validez de 30 días."
      },
      {
        "q": "¿Tengo que ir personalmente a la ORIP en Buga para obtenerlo?",
        "a": "No. Con Certitradición todo el trámite es 100 % en línea desde cualquier lugar. No necesitas presentarte en las instalaciones de la ORIP de Buga ni gestionar turnos. Es ideal si vives fuera de la ciudad, si el inmueble está en una vereda distante o simplemente si quieres ahorrar tiempo. Recuerda que Certitradición actúa como gestor privado y tramita el documento en tu nombre a través de los canales digitales disponibles."
      }
    ]
  },
  {
    "slug": "girardot",
    "ciudad": "Girardot",
    "departamento": "Cundinamarca",
    "oficinas": [
      {
        "nombre": "GIRARDOT",
        "codigo": "307"
      }
    ],
    "metaTitle": "Certificado de Tradición Girardot | En Línea",
    "metaDescription": "Obtén el Certificado de Tradición y Libertad en Girardot (Cundinamarca) en minutos, sin filas, desde $39.900. PDF oficial directo a tu correo.",
    "h1": "Certificado de Tradición y Libertad en Girardot (Cundinamarca)",
    "intro": "Si estás comprando un apartamento en La Castilla, vendiendo una casa en El Peñón o tramitando una sucesión de un lote en vereda Pubenza, lo primero que necesitas es el Certificado de Tradición y Libertad. Este documento, expedido con base en los registros de la ORIP GIRARDOT (código 307), muestra el historial completo del predio: quiénes han sido sus propietarios, hipotecas vigentes, embargos, gravámenes y cualquier limitación que pese sobre el inmueble. Con Certitradición lo gestionas en minutos desde tu celular o computador, sin desplazarte.",
    "comoObtener": "Todo predio inscrito en la ORIP Girardot lleva una matrícula inmobiliaria que comienza con el prefijo 307. Con ese número en mano, el proceso es muy sencillo: ingrésalo en el formulario de Certitradición, realiza el pago único de $39.900 COP a través de Wompi (tarjeta, PSE o Nequi) y en pocos minutos recibirás el PDF oficial en tu correo electrónico, con envío opcional por WhatsApp. Certitradición es un gestor privado que tramita el certificado en línea en nombre del usuario; no somos canal oficial de la Superintendencia de Notariado y Registro (SNR) ni entidad del Gobierno.",
    "faqs": [
      {
        "q": "¿Cuál es la ORIP de Girardot y qué significa el código 307?",
        "a": "La Oficina de Registro de Instrumentos Públicos competente para Girardot y su área de influencia en el sur del Cundinamarca es la ORIP GIRARDOT. El código 307 es el identificador oficial de esta oficina y funciona como prefijo de todas las matrículas inmobiliarias de predios registrados allí, tanto en el casco urbano —barrios como Sucre, Acapulco o Los Andes— como en zonas rurales y veredas del municipio."
      },
      {
        "q": "¿Cuánto cuesta el Certificado de Tradición y Libertad a través de Certitradición?",
        "a": "El servicio de Certitradición tiene un valor fijo de $39.900 COP, que se paga una sola vez mediante Wompi (acepta tarjetas débito y crédito, PSE y Nequi). Este pago cubre la gestión completa y la entrega del PDF oficial con validez de 30 días calendario a partir de su expedición."
      },
      {
        "q": "¿Tengo que ir personalmente a la ORIP Girardot para obtener el certificado?",
        "a": "No. Gracias a la plataforma en línea, puedes solicitar tu certificado desde cualquier lugar, ya sea que estés en Girardot, en Bogotá o en el exterior. No es necesario hacer fila ni visitar la carrera 8 con calle 19 donde opera la ORIP. Solo necesitas el número de matrícula inmobiliaria y conexión a internet; el PDF llega directamente a tu correo en minutos."
      }
    ]
  },
  {
    "slug": "zipaquira",
    "ciudad": "Zipaquirá",
    "departamento": "Cundinamarca",
    "oficinas": [
      {
        "nombre": "ZIPAQUIRA",
        "codigo": "176"
      }
    ],
    "metaTitle": "Certificado de Tradición Zipaquirá | En línea",
    "metaDescription": "Obtén el Certificado de Tradición y Libertad en Zipaquirá (Cundinamarca) desde $39.900. PDF oficial en minutos, sin filas. ORIP código 176.",
    "h1": "Certificado de Tradición y Libertad en Zipaquirá (Cundinamarca)",
    "intro": "Si estás comprando una casa en el centro histórico de Zipaquirá, vendiendo un lote en la vereda Portachuelo o tramitando una sucesión de un predio cerca del Parque de la Sal, lo primero que debes consultar es el Certificado de Tradición y Libertad. Este documento, expedido por la ORIP ZIPAQUIRA (código 176), revela el historial completo del inmueble: quiénes han sido sus propietarios, si tiene hipotecas activas, embargos, servidumbres u otro gravamen. En Certitradición lo gestionamos por ti en línea, sin que tengas que desplazarte a ninguna oficina.",
    "comoObtener": "Todo predio ubicado en Zipaquirá y sus veredas —desde Barandillas hasta Barro Blanco— queda matriculado ante la ORIP con el prefijo 176. Con ese número de matrícula inmobiliaria es suficiente para iniciar el trámite. Ingresa la matrícula en nuestro formulario, realiza el pago único de $39.900 COP a través de Wompi (tarjeta, PSE o Nequi) y en pocos minutos recibirás el PDF oficial en tu correo, con copia opcional por WhatsApp. El certificado tiene validez de 30 días. Importante: Certitradición es un gestor privado; no somos la SNR ni un canal oficial del Gobierno colombiano.",
    "faqs": [
      {
        "q": "¿Cuál es la oficina de registro que cubre Zipaquirá y qué significa el código 176?",
        "a": "Los predios de Zipaquirá y sus veredas del altiplano cundinamarqués están inscritos en la Oficina de Registro de Instrumentos Públicos ZIPAQUIRA, conocida como ORIP código 176. Ese número es el prefijo que identifica las matrículas inmobiliarias del municipio; por ejemplo, una matrícula típica luce como 176-XXXXXX. Es la misma oficina que gestiona el registro de compraventas, hipotecas y demás actos sobre inmuebles en la zona."
      },
      {
        "q": "¿Cuánto cuesta obtener el certificado a través de Certitradición?",
        "a": "El servicio tiene un costo único de $39.900 COP, que cubre la gestión en línea y la entrega del PDF oficial con validez de 30 días. El pago se realiza de forma segura por Wompi, plataforma que acepta tarjetas débito y crédito, PSE y billeteras como Nequi. No hay cobros adicionales ni suscripciones."
      },
      {
        "q": "¿Tengo que ir personalmente a alguna oficina en Zipaquirá para obtener el certificado?",
        "a": "No. Todo el proceso se hace en línea desde donde estés, ya sea que vivas en el barrio Santa Isabel de Zipaquirá, en Bogotá o en cualquier otra ciudad. Certitradición es un gestor privado que tramita el certificado de forma digital; una vez completado el pago, el PDF oficial llega directamente a tu correo en cuestión de minutos, sin filas ni desplazamientos."
      }
    ]
  },
  {
    "slug": "fusagasuga",
    "ciudad": "Fusagasugá",
    "departamento": "Cundinamarca",
    "oficinas": [
      {
        "nombre": "FUSAGASUGA",
        "codigo": "157"
      }
    ],
    "metaTitle": "Certificado de Tradición Fusagasugá | En línea",
    "metaDescription": "Obtén tu Certificado de Tradición y Libertad en Fusagasugá en minutos, sin filas. Trámite 100% en línea por solo $39.900. PDF oficial al correo.",
    "h1": "Certificado de Tradición y Libertad en Fusagasugá (Cundinamarca)",
    "intro": "¿Vas a comprar una casa en el barrio Santa Lucia, vender un lote en la vereda Palacios o tramitar una sucesión de un predio en la zona rural de Chinauta? Antes de firmar cualquier escritura necesitas el Certificado de Tradición y Libertad: el documento que revela quién figura como propietario, si el inmueble tiene hipotecas, embargos, servidumbres o cualquier otro gravamen. En Fusagasugá, todos los predios están matriculados ante la ORIP FUSAGASUGA, identificada con el código 157. Con Certitradición lo obtienes en línea, sin desplazarte, en cuestión de minutos.",
    "comoObtener": "Todo predio en Fusagasugá —ya sea un apartamento en La Palma, una finca en la vereda El Placer o un local comercial en el centro— lleva un número de matrícula inmobiliaria que comienza con el prefijo 157, asignado por la ORIP FUSAGASUGA. Para solicitar tu certificado, ingresa ese número en nuestro formulario, completa el pago de $39.900 a través de Wompi (tarjeta, PSE o efectivo) y en pocos minutos recibirás el PDF oficial del SNR en tu correo y, si lo prefieres, también por WhatsApp. Certitradición es un gestor privado; no somos canal oficial de la Superintendencia de Notariado y Registro ni del Gobierno colombiano.",
    "faqs": [
      {
        "q": "¿Qué es la ORIP de Fusagasugá y cuál es su código?",
        "a": "La Oficina de Registro de Instrumentos Públicos (ORIP) FUSAGASUGA es la entidad estatal encargada de registrar todos los actos sobre inmuebles ubicados en Fusagasugá y municipios de su círculo registral en Cundinamarca. Su código oficial es el 157, y ese mismo número aparece como prefijo en la matrícula inmobiliaria de cada predio del área. El Certificado de Tradición y Libertad que gestionamos proviene directamente de los sistemas de la Superintendencia de Notariado y Registro."
      },
      {
        "q": "¿Cuánto cuesta obtener el certificado con Certitradición?",
        "a": "El servicio tiene un costo de $39.900 COP, pago único. Ese valor cubre la gestión completa: consulta ante el SNR, emisión del PDF oficial con código de verificación y entrega a tu correo electrónico (y por WhatsApp si lo solicitas). No hay costos ocultos ni cobros adicionales por certificados con varios folios."
      },
      {
        "q": "¿Tengo que ir personalmente a alguna oficina en Fusagasugá?",
        "a": "No. El trámite es 100% en línea desde cualquier dispositivo. No necesitas presentarte en la ORIP de Fusagasugá ni en ninguna otra oficina. Solo necesitas el número de matrícula inmobiliaria del predio, que generalmente aparece en la escritura, en el recibo del impuesto predial o en la promesa de compraventa."
      }
    ]
  },
  {
    "slug": "sogamoso",
    "ciudad": "Sogamoso",
    "departamento": "Boyacá",
    "oficinas": [
      {
        "nombre": "SOGAMOSO",
        "codigo": "095"
      }
    ],
    "metaTitle": "Certificado de Tradición Sogamoso | En línea",
    "metaDescription": "Obtén el Certificado de Tradición y Libertad en Sogamoso (Boyacá) en minutos, sin filas. Pago único de $39.900 por Wompi. PDF oficial al correo. ORIP código 095.",
    "h1": "Certificado de Tradición y Libertad en Sogamoso (Boyacá)",
    "intro": "Si estás comprando una casa en el barrio Cedritos, vendiendo un lote en la vereda Morca o tramitando la sucesión de una finca cerca al lago de Tota, necesitas el Certificado de Tradición y Libertad antes de firmar cualquier escritura. Este documento, emitido por la ORIP SOGAMOSO con código 095, revela quién es el propietario legal del predio, si tiene hipotecas, embargos, gravámenes o limitaciones de dominio. Con Certitradición lo obtienes en minutos desde cualquier lugar, sin desplazarte al centro de Sogamoso.",
    "comoObtener": "Todo predio ubicado en Sogamoso y su área de influencia en Boyacá tiene su matrícula inmobiliaria registrada en la ORIP código 095, ya sea una vivienda en el sector de Morcá, un apartamento en la zona Centro o un terreno en las veredas del corredor minero hacia Iza. Para obtener el certificado, solo necesitas ese número de matrícula: ingrésalo en nuestro formulario, realiza el pago único de $39.900 a través de Wompi y recibirás el PDF oficial en tu correo en cuestión de minutos. Certitradición es un gestor privado; no somos la SNR ni un ente gubernamental, sino un servicio que facilita el trámite en tu nombre.",
    "faqs": [
      {
        "q": "¿Qué es la ORIP de Sogamoso y qué significa el código 095?",
        "a": "La Oficina de Registro de Instrumentos Públicos de Sogamoso es la entidad adscrita a la Superintendencia de Notariado y Registro (SNR) encargada de inscribir y certificar los derechos sobre inmuebles en el municipio y varios municipios circunvecinos de Boyacá. El código 095 es el prefijo que identifica esta oficina y aparece al inicio de toda matrícula inmobiliaria de predios registrados allí, como por ejemplo 095-12345."
      },
      {
        "q": "¿Cuánto cuesta obtener el certificado a través de Certitradición?",
        "a": "El costo del servicio de Certitradición es de $39.900 COP, pago único procesado de forma segura por Wompi. Este valor cubre la gestión del trámite y la entrega del PDF oficial en tu correo electrónico (y por WhatsApp si lo prefieres) en pocos minutos, sin costos ocultos ni suscripciones."
      },
      {
        "q": "¿Tengo que ir personalmente a la ORIP en el centro de Sogamoso?",
        "a": "No. Con Certitradición todo el proceso es 100 % en línea. No tienes que trasladarte a las oficinas de la ORIP ubicadas en Sogamoso ni hacer fila. Basta con tener el número de matrícula inmobiliaria para que gestionemos el certificado por ti y te lo entreguemos directamente en formato PDF, con validez de 30 días."
      }
    ]
  },
  {
    "slug": "duitama",
    "ciudad": "Duitama",
    "departamento": "Boyacá",
    "oficinas": [
      {
        "nombre": "DUITAMA",
        "codigo": "074"
      }
    ],
    "metaTitle": "Certificado de Tradición Duitama | Online $39.900",
    "metaDescription": "Obtén el Certificado de Tradición y Libertad en Duitama (Boyacá) en minutos, sin filas. Pago único de $39.900 por Wompi. PDF oficial al correo. ORIP código 074.",
    "h1": "Certificado de Tradición y Libertad en Duitama (Boyacá)",
    "intro": "Si estás comprando un apartamento en el centro de Duitama, un lote en el sector de La Granja o una finca en las veredas del altiplano boyacense, el Certificado de Tradición y Libertad es el primer documento que debes revisar. Este certificado, expedido por la Oficina de Registro de Instrumentos Públicos —ORIP DUITAMA, código 074— revela los propietarios actuales, hipotecas activas, embargos, gravámenes y cualquier limitación que pese sobre el predio. Con Certitradición lo recibes en tu correo en minutos, sin desplazarte hasta las oficinas del centro.",
    "comoObtener": "Todo predio registrado en Duitama y los municipios de su área de influencia en Boyacá lleva una matrícula inmobiliaria que comienza con el prefijo 074, asignado por la ORIP DUITAMA. Para obtener tu certificado solo necesitas ese número. Ingrésalo en nuestro formulario, paga los $39.900 con Wompi (tarjeta, PSE o Nequi) y en cuestión de minutos recibirás el PDF oficial en tu correo, con reenvío opcional por WhatsApp. Certitradición es un gestor privado que realiza el trámite en línea en tu nombre; no somos un canal oficial de la Superintendencia de Notariado y Registro ni del Gobierno colombiano. Validez del documento: 30 días.",
    "faqs": [
      {
        "q": "¿Qué es la ORIP de Duitama y por qué tiene el código 074?",
        "a": "La Oficina de Registro de Instrumentos Públicos de Duitama es la entidad adscrita a la Superintendencia de Notariado y Registro que inscribe todas las transacciones sobre inmuebles en Duitama y varios municipios aledaños de Boyacá, como Paipa, Tibasosa y Nobsa, entre otros. El código 074 es el identificador oficial asignado a esta ORIP y aparece como prefijo en cada matrícula inmobiliaria de los predios bajo su jurisdicción. Ese número es el que debes usar para solicitar el certificado."
      },
      {
        "q": "¿Cuánto cuesta el certificado y qué incluye ese precio?",
        "a": "El costo total del servicio de Certitradición es de $39.900 COP, pago único. No hay cobros adicionales ni suscripciones. Con ese valor gestionamos la consulta ante el sistema de registro, descargamos el PDF oficial del certificado —que incluye histórico de propietarios, hipotecas, embargos, gravámenes y demás anotaciones del predio— y te lo enviamos directamente al correo electrónico que registres. Si lo prefieres, también podemos reenviarlo por WhatsApp."
      },
      {
        "q": "¿Tengo que ir hasta las oficinas de la ORIP en Duitama para obtenerlo?",
        "a": "No. El proceso es completamente en línea y lo puedes hacer desde cualquier lugar de Colombia o del exterior. No necesitas trasladarte hasta el centro de Duitama ni hacer filas en la ORIP. Certitradición, como gestor privado, realiza el trámite digital en tu nombre. Solo necesitas el número de matrícula inmobiliaria con prefijo 074, acceso a internet para pagar y una dirección de correo donde recibir el PDF. El certificado llega en minutos."
      }
    ]
  },
  {
    "slug": "rionegro",
    "ciudad": "Rionegro",
    "departamento": "Antioquia",
    "oficinas": [
      {
        "nombre": "RIONEGRO",
        "codigo": "020"
      }
    ],
    "metaTitle": "Certificado de Tradición Rionegro | En línea",
    "metaDescription": "Obtén tu Certificado de Tradición y Libertad en Rionegro (Antioquia) en minutos. Sin filas, 100% en línea, solo $39.900. PDF oficial al correo.",
    "h1": "Certificado de Tradición y Libertad en Rionegro (Antioquia)",
    "intro": "Si estás comprando una casa en El Porvenir, vendiendo un lote en la vereda La Convención o tramitando una sucesión en el sector de Tablazo, lo primero que te van a pedir es el Certificado de Tradición y Libertad. Este documento oficial, emitido por la ORIP Rionegro (código 020), muestra el historial completo del predio: quiénes han sido sus propietarios, si tiene hipotecas activas, embargos, servidumbres u otros gravámenes. Con Certitradición lo gestionas en minutos desde cualquier dispositivo, sin desplazarte hasta la oficina.",
    "comoObtener": "En Rionegro, todos los predios urbanos y rurales —desde apartamentos en el centro hasta fincas en La Fe o Marinilla Road— quedan matriculados ante la ORIP con el prefijo 020. Solo necesitas ese número de matrícula inmobiliaria para empezar. Ingresas la matrícula en nuestro formulario, realizas el pago único de $39.900 a través de Wompi (tarjeta, PSE o Nequi) y en pocos minutos recibes el PDF oficial en tu correo y, si lo prefieres, por WhatsApp. El certificado tiene validez de 30 días. Certitradición es un gestor privado; no somos la SNR ni un ente gubernamental.",
    "faqs": [
      {
        "q": "¿Cuál es la ORIP de Rionegro y qué significa el código 020?",
        "a": "La Oficina de Registro de Instrumentos Públicos competente para Rionegro y buena parte del Oriente antioqueño es la ORIP Rionegro. El código 020 es el prefijo oficial de todas las matrículas inmobiliarias registradas ahí; por eso, si el número de tu predio empieza con 020, el certificado lo expide precisamente esa oficina."
      },
      {
        "q": "¿Cuánto cuesta obtener el certificado a través de Certitradición?",
        "a": "El servicio de gestión tiene un costo único de $39.900 COP, que cubres en un solo pago por Wompi usando tarjeta débito o crédito, PSE o Nequi. No hay cargos adicionales ni suscripciones: pagas una vez y recibes el PDF oficial con validez de 30 días."
      },
      {
        "q": "¿Tengo que ir personalmente a la ORIP en Rionegro para tramitar el certificado?",
        "a": "No. Todo el proceso es 100% en línea. No necesitas pedir cita, desplazarte hasta las instalaciones de la ORIP en Rionegro ni hacer fila. Ingresa la matrícula, paga y listo: el documento llega directamente a tu correo electrónico en cuestión de minutos, sea que estés en el aeropuerto José María Córdova, en La Ceja o en cualquier otro lugar."
      }
    ]
  },
  {
    "slug": "apartado",
    "ciudad": "Apartadó",
    "departamento": "Antioquia",
    "oficinas": [
      {
        "nombre": "APARTADO",
        "codigo": "008"
      }
    ],
    "metaTitle": "Certificado de Tradición Apartadó | En línea",
    "metaDescription": "Obtén el Certificado de Tradición y Libertad en Apartadó (Antioquia) en minutos. Sin filas, 100% en línea, entrega al correo. Solo $39.900 con Wompi.",
    "h1": "Certificado de Tradición y Libertad en Apartadó (Antioquia)",
    "intro": "Si estás comprando un apartamento en el barrio Obrero, vendiendo una finca en la vereda Zungo Carretera o tramitando una sucesión en algún sector del eje bananero del Urabá antioqueño, el Certificado de Tradición y Libertad es el documento que te confirma quién es el propietario real del predio, qué hipotecas tiene, si está embargado o tiene gravámenes activos. En Apartadó, los predios quedan registrados ante la ORIP APARTADO (código 008), y con Certitradición lo obtienes en minutos desde cualquier dispositivo.",
    "comoObtener": "Todo predio de Apartadó y los municipios de su área de influencia en el Urabá antioqueño queda matriculado bajo el código 008 de la ORIP APARTADO. Para obtener el certificado solo necesitas el número de matrícula inmobiliaria: ingrésalo en el formulario, paga $39.900 con Wompi (tarjeta, PSE o Nequi) y recibes el PDF oficial directamente en tu correo, y si quieres también por WhatsApp, en cuestión de minutos. Certitradición es un gestor privado que realiza el trámite en línea por ti; no somos el canal oficial de la Superintendencia de Notariado y Registro (SNR) ni una entidad gubernamental.",
    "faqs": [
      {
        "q": "¿Cuál es la oficina de registro que cubre Apartadó y qué significa el código 008?",
        "a": "La Oficina de Registro de Instrumentos Públicos (ORIP) competente para Apartadó y buena parte del Urabá antioqueño es la ORIP APARTADO, identificada con el código 008. Ese código es el prefijo de toda matrícula inmobiliaria registrada en esta jurisdicción, por ejemplo 008-XXXXXX. Si tu predio está en Apartadó, en la zona rural del río León o en veredas cercanas como El Reposo, su matrícula debe comenzar con 008."
      },
      {
        "q": "¿Cuánto cuesta obtener el Certificado de Tradición y Libertad en Apartadó a través de Certitradición?",
        "a": "El costo del servicio de Certitradición es de $39.900 COP, pago único. Este valor cubre la gestión en línea y la entrega del PDF oficial en tu correo electrónico (y por WhatsApp si lo solicitas) en minutos. No hay cobros adicionales ni sorpresas al final del proceso. El pago se realiza de forma segura a través de Wompi, con opciones como tarjeta débito/crédito, PSE o Nequi."
      },
      {
        "q": "¿Tengo que ir personalmente a alguna oficina en Apartadó para obtener este certificado?",
        "a": "No. No es necesario desplazarte hasta la ORIP de Apartadó ni hacer filas. Todo el proceso es 100% en línea a través de Certitradición: ingresas la matrícula inmobiliaria, pagas y recibes el documento en tu correo en minutos. Esto es especialmente útil para personas que viven fuera del Urabá antioqueño o que simplemente no quieren invertir tiempo en trámites presenciales en la ciudad."
      }
    ]
  },
  {
    "slug": "ipiales",
    "ciudad": "Ipiales",
    "departamento": "Nariño",
    "oficinas": [
      {
        "nombre": "IPIALES",
        "codigo": "244"
      }
    ],
    "metaTitle": "Certificado de Tradición Ipiales – En Línea",
    "metaDescription": "Obtén tu Certificado de Tradición y Libertad en Ipiales (Nariño) en minutos, sin filas, desde $39.900. PDF oficial al correo. ORIP código 244.",
    "h1": "Certificado de Tradición y Libertad en Ipiales (Nariño)",
    "intro": "Si estás por comprar una casa en el barrio Corazón de Jesús, vender un lote en la vereda Yaramal o tramitar una sucesión de predio rural en las faldas del volcán Azufral, lo primero que necesitas es el Certificado de Tradición y Libertad. Este documento, expedido por la ORIP Ipiales (código de matrícula 244), revela quién figura como propietario, si el inmueble tiene hipotecas, embargos, afectaciones a vivienda familiar u otros gravámenes. Con Certitradición lo gestionas en línea en minutos, sin desplazarte hasta las oficinas del centro de Ipiales.",
    "comoObtener": "Todo predio registrado en Ipiales y municipios vecinos como Cumbal o Guachucal tiene su matrícula inmobiliaria con el prefijo 244, asignado por la ORIP Ipiales. Para obtener tu certificado solo necesitas ese número. Ingresa la matrícula en nuestro formulario, realiza el pago único de $39.900 a través de Wompi (PSE, tarjeta o Nequi) y en minutos recibirás el PDF oficial en tu correo; también puedes solicitarlo por WhatsApp. Certitradición es un gestor privado que tramita el certificado en línea por ti; no somos un canal oficial de la SNR ni del Gobierno Nacional. El documento tiene validez de 30 días.",
    "faqs": [
      {
        "q": "¿Qué es la ORIP Ipiales y qué significa el código 244 en la matrícula?",
        "a": "La Oficina de Registro de Instrumentos Públicos (ORIP) de Ipiales es la entidad adscrita a la Superintendencia de Notariado y Registro que gestiona el registro de todos los predios urbanos y rurales del municipio de Ipiales y de varios municipios del sur de Nariño, como Cumbal, Guachucal y Córdoba. El código 244 es el identificador de esa circunscripción registral: aparece como prefijo en cada matrícula inmobiliaria (por ejemplo, 244-12345). Si tu predio está en sectores como La Pamba, El Charco o veredas del área rural de Ipiales, su matrícula lleva ese código."
      },
      {
        "q": "¿Cuánto cuesta obtener el certificado a través de Certitradición?",
        "a": "El servicio de gestión tiene un costo único de $39.900 COP, que se paga de forma segura a través de la pasarela Wompi (acepta PSE, tarjetas débito/crédito y Nequi). No hay cobros adicionales ni suscripciones. Este valor cubre la consulta, la gestión ante el sistema de la SNR y la entrega del PDF oficial en tu correo electrónico o WhatsApp en cuestión de minutos, con validez de 30 días a partir de su expedición."
      },
      {
        "q": "¿Tengo que ir personalmente a las oficinas de la ORIP en Ipiales para obtener el certificado?",
        "a": "No. Gracias a la plataforma en línea de la SNR, el certificado se puede tramitar de forma completamente virtual, sin necesidad de acercarte al edificio de la ORIP en el centro de Ipiales ni hacer fila. A través de Certitradición ingresas el número de matrícula, realizas el pago y recibes el documento directamente en tu correo. Esto es especialmente útil si vives en veredas alejadas del casco urbano, como Cuaspud o sectores de la cordillera de Nariño, o si te encuentras fuera del municipio gestionando la compraventa de un inmueble."
      }
    ]
  },
  {
    "slug": "maicao",
    "ciudad": "Maicao",
    "departamento": "La Guajira",
    "oficinas": [
      {
        "nombre": "MAICAO",
        "codigo": "212"
      }
    ],
    "metaTitle": "Certificado de Tradición Maicao – Online $39.900",
    "metaDescription": "Obtén el Certificado de Tradición y Libertad de Maicao en línea, sin filas, desde $39.900 COP. PDF oficial en minutos, con validez de 30 días. Pago fácil por Wompi.",
    "h1": "Certificado de Tradición y Libertad en Maicao (La Guajira)",
    "intro": "Si estás comprando un local en el centro comercial de Maicao, vendiendo una casa en el barrio Villa del Sur, tramitando una sucesión en La Paz o hipotecando un predio rural en las veredas del municipio, el Certificado de Tradición y Libertad es el documento que confirma quién es el propietario legal y si el inmueble tiene hipotecas, embargos o gravámenes vigentes. En Maicao, todos los predios quedan matriculados ante la ORIP Maicao, identificada con el código 212, prefijo de toda matrícula inmobiliaria del municipio. Con Certitradición lo obtienes en línea en minutos.",
    "comoObtener": "Cada predio urbano o rural de Maicao —desde apartamentos en el sector de Diez de Mayo hasta fincas en la zona rural cercana a la serranía de la Macuira— tiene su matrícula inmobiliaria con el prefijo 212, asignada por la ORIP Maicao. Para tramitar el certificado solo necesitas ese número: ingrésalo en nuestro formulario, paga $39.900 COP de forma segura con Wompi y recibirás el PDF oficial en tu correo (y por WhatsApp si lo prefieres) en minutos. Certitradición es un gestor privado que realiza el trámite en línea por ti; no somos la SNR ni un canal oficial del Gobierno colombiano.",
    "faqs": [
      {
        "q": "¿Qué es la ORIP de Maicao y cuál es su código?",
        "a": "La Oficina de Registro de Instrumentos Públicos (ORIP) de Maicao es la entidad pública que registra todos los actos sobre inmuebles del municipio, incluyendo predios del casco urbano y del extenso territorio rural de La Guajira que cubre su jurisdicción. Su código oficial es el 212, y ese número aparece como prefijo en toda matrícula inmobiliaria registrada allí. Por ejemplo, una matrícula típica luce así: 212-XXXXXX."
      },
      {
        "q": "¿Cuánto cuesta obtener el Certificado de Tradición y Libertad de un predio en Maicao?",
        "a": "A través de Certitradición el costo es de $39.900 COP, pago único. No hay cobros adicionales ni tarifas ocultas. El pago se realiza de forma segura mediante Wompi, que acepta tarjetas débito, crédito y transferencias PSE. Una vez confirmado el pago, el PDF oficial con validez de 30 días llega a tu correo electrónico en cuestión de minutos."
      },
      {
        "q": "¿Tengo que ir personalmente a la oficina de registro en Maicao para obtener el certificado?",
        "a": "No. El trámite es 100% en línea y no requiere desplazarte hasta las instalaciones de la ORIP Maicao. Certitradición gestiona la consulta de forma digital por ti; solo necesitas tener a mano el número de matrícula inmobiliaria del predio. Esto es especialmente útil para propietarios que residen fuera de Maicao o en otras ciudades de La Guajira como Riohacha o Uribia."
      }
    ]
  },
  {
    "slug": "magangue",
    "ciudad": "Magangué",
    "departamento": "Bolívar",
    "oficinas": [
      {
        "nombre": "MAGANGUE",
        "codigo": "064"
      }
    ],
    "metaTitle": "Certificado de Tradición Magangué | En línea",
    "metaDescription": "Obtén tu Certificado de Tradición y Libertad en Magangué (Bolívar) en minutos desde casa. Sin filas, PDF oficial al correo. Solo $39.900. ¡Pide el tuyo ya!",
    "h1": "Certificado de Tradición y Libertad en Magangué (Bolívar)",
    "intro": "Si estás comprando una casa en el barrio La Manga, vendiendo un lote en La Popa o tramitando una sucesión sobre un predio rural cerca al río Magdalena, lo primero que te van a pedir es el Certificado de Tradición y Libertad. Este documento, expedido por la ORIP MAGANGUE (código 064), revela la historia jurídica completa del inmueble: quién es el propietario actual, si tiene hipoteca, embargo, gravamen o cualquier limitación que pueda complicar tu negocio. Con Certitradición lo obtienes en minutos, sin salir de tu casa.",
    "comoObtener": "Todo predio ubicado en Magangué y los municipios aledaños del sur de Bolívar queda matriculado en la ORIP con código 064, que es el prefijo que verás al inicio del número de matrícula inmobiliaria. Para tramitar tu certificado solo necesitas ese número. Ingrésalo en nuestro formulario, paga los $39.900 de forma segura con Wompi (tarjeta, PSE o Nequi) y recibe el PDF oficial en tu correo en cuestión de minutos. Certitradición es un gestor privado y no pertenece a la Superintendencia de Notariado y Registro ni al Gobierno nacional; actuamos como intermediarios para agilizarte el trámite.",
    "faqs": [
      {
        "q": "¿Cuál es la ORIP de Magangué y qué significa el código 064?",
        "a": "La Oficina de Registro de Instrumentos Públicos competente para Magangué es la ORIP MAGANGUE, identificada con el código 064. Ese número es el prefijo de toda matrícula inmobiliaria de predios registrados en el municipio y en buena parte del sur de Bolívar, desde zonas urbanas como el centro histórico hasta veredas ribereñas del Magdalena. Sin ese código no es posible consultar el folio de matrícula correctamente."
      },
      {
        "q": "¿Cuánto cuesta el Certificado de Tradición y Libertad en Magangué?",
        "a": "A través de Certitradición el costo es de $39.900 COP, pago único sin cobros adicionales. El pago se realiza en línea por Wompi usando tarjeta débito o crédito, PSE o Nequi. Una vez confirmado el pago recibes el PDF oficial en tu correo electrónico, con validez de 30 días calendario, igual que el expedido directamente por la SNR."
      },
      {
        "q": "¿Hay que ir en persona a alguna oficina en Magangué para obtener el certificado?",
        "a": "No. El trámite es 100 % en línea y no requiere desplazarte hasta la ORIP de Magangué ni hacer fila. Certitradición gestiona la consulta de manera digital, por lo que puedes solicitarlo desde cualquier lugar, ya sea que estés en el mismo Magangué, en Cartagena o en el exterior. El PDF llega a tu correo y, si lo prefieres, también por WhatsApp en cuestión de minutos."
      }
    ]
  },
  {
    "slug": "san-gil",
    "ciudad": "San Gil",
    "departamento": "Santander",
    "oficinas": [
      {
        "nombre": "SAN GIL",
        "codigo": "319"
      }
    ],
    "metaTitle": "Certificado de Tradición San Gil | Desde $39.900",
    "metaDescription": "Obtén el Certificado de Tradición y Libertad de San Gil en minutos. Trámite 100% en línea, sin filas, PDF oficial al correo. Solo $39.900 por Wompi. ORIP código 319.",
    "h1": "Certificado de Tradición y Libertad en San Gil (Santander)",
    "intro": "Si estás comprando una casa en el barrio La Independencia, vendiendo un lote en la vereda Cabrera o tramitando una sucesión en el sector de Gallineral, necesitas el Certificado de Tradición y Libertad antes de firmar cualquier escritura. Este documento, expedido por la ORIP SAN GIL (código 319), revela quién figura como propietario del predio, si tiene hipotecas activas, embargos judiciales, condiciones resolutorias u otros gravámenes que puedan bloquear la negociación. Certitradición te lo gestiona en línea en minutos, sin que tengas que desplazarte hasta las oficinas en el centro de San Gil.",
    "comoObtener": "Todo predio ubicado en San Gil y en los municipios aledaños registrados ante la ORIP código 319 tiene una matrícula inmobiliaria que empieza con ese número. Con ese dato en mano, el proceso es muy sencillo: ingresa la matrícula en nuestro formulario, realiza el pago de $39.900 COP a través de Wompi (tarjeta, PSE o Nequi) y en minutos recibirás el PDF oficial en tu correo y, si lo deseas, por WhatsApp. Certitradición es un gestor privado independiente; no pertenece a la Superintendencia de Notariado y Registro (SNR) ni a ninguna entidad del Gobierno colombiano.",
    "faqs": [
      {
        "q": "¿Qué es la ORIP de San Gil y qué significa el código 319?",
        "a": "La Oficina de Registro de Instrumentos Públicos (ORIP) de San Gil es la sede de la Superintendencia de Notariado y Registro que atiende al municipio de San Gil y a varios municipios de la provincia de Guanentá en Santander. El código 319 es el prefijo que identifica a esta ORIP: toda matrícula inmobiliaria de predios registrados allí comienza con 319, y ese número es el que necesitas para solicitar el Certificado de Tradición y Libertad."
      },
      {
        "q": "¿Cuánto cuesta el certificado y cómo se paga?",
        "a": "El servicio de Certitradición tiene un costo único de $39.900 COP por certificado. El pago se realiza en línea a través de Wompi, una plataforma segura que acepta tarjetas débito y crédito, PSE y billeteras digitales como Nequi. No hay cobros adicionales ocultos: con ese valor único recibes el PDF oficial del certificado directamente en tu correo electrónico en cuestión de minutos."
      },
      {
        "q": "¿Tengo que ir en persona a las oficinas de registro en San Gil?",
        "a": "No. Todo el proceso es 100% en línea desde cualquier lugar. No necesitas desplazarte hasta la ORIP ubicada en el centro de San Gil ni hacer filas. Basta con tener el número de matrícula inmobiliaria del predio, ingresar al formulario de Certitradición, pagar y esperar el PDF en tu correo. El certificado tiene validez de 30 días contados desde su expedición."
      }
    ]
  }
];

export function getCiudad(slug: string): Ciudad | undefined {
  return CIUDADES.find((c) => c.slug === slug);
}
