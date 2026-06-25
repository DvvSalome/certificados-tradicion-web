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
  }
];

export function getCiudad(slug: string): Ciudad | undefined {
  return CIUDADES.find((c) => c.slug === slug);
}
