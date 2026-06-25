// Cluster de contenido: guías por anotación/concepto del Certificado de Tradición y Libertad.
// Contenido generado con el workflow cluster-guias-ctl. La ruta /guias/[slug] renderiza esto.
export interface Guia {
  slug: string;
  tema: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  secciones: { heading: string; body: string }[];
  faqs: { q: string; a: string }[];
}

export const GUIAS: Guia[] = [
  {
    "slug": "embargo",
    "tema": "Embargo",
    "metaTitle": "Embargo en el Certificado de Tradición: qué es y cómo se levanta",
    "metaDescription": "¿El inmueble tiene embargo? Aprende qué significa esa anotación en el Certificado de Tradición y Libertad, cómo afecta la compraventa y cómo se levanta.",
    "h1": "Embargo en el Certificado de Tradición y Libertad: qué significa y cómo se levanta",
    "intro": "Un embargo es una de las anotaciones más delicadas que puede aparecer en el Certificado de Tradición y Libertad de un inmueble en Colombia. Significa que una autoridad ordenó retener jurídicamente el bien dentro de un proceso, lo que limita seriamente su venta o hipoteca. Antes de comprar, vender o estudiar una propiedad, lo primero es verificar si existe esta medida y si ya fue cancelada. Aquí te explicamos, en términos prácticos y correctos, qué implica y cómo se libera.",
    "secciones": [
      {
        "heading": "¿Qué es un embargo y por qué aparece en el certificado?",
        "body": "Un embargo es una medida cautelar: una autoridad ordena retener el inmueble para garantizar el cumplimiento de una obligación o el resultado de un proceso. Puede provenir de un juez (procesos ejecutivos, alimentos, sucesiones, divorcios) o de entidades con facultad de cobro coactivo, como la DIAN o los municipios por impuestos. Cuando esa orden llega a la Oficina de Registro de Instrumentos Públicos, se inscribe como una anotación en el folio de matrícula del inmueble. Por eso queda visible para cualquiera que consulte el Certificado de Tradición y Libertad. No es una opinión ni un rumor: es un acto registrado que refleja una restricción real y vigente sobre la propiedad mientras no se cancele."
      },
      {
        "heading": "¿Cómo afecta un embargo al comprar o vender el inmueble?",
        "body": "Un inmueble embargado, en la práctica, no se puede vender ni hipotecar libremente. El bien queda fuera del comercio: si intentas firmar una escritura de compraventa, el notario y la Oficina de Registro rechazarán la inscripción mientras la medida esté vigente. Para el comprador, esto significa que pagar por un inmueble embargado es asumir un riesgo enorme, porque la transferencia no quedará registrada a su nombre y el bien podría rematarse dentro del proceso judicial. Por eso, antes de entregar arras o dinero, revisa la columna de anotaciones del certificado: busca la palabra 'embargo' y confirma si tiene una anotación posterior que la haya cancelado."
      },
      {
        "heading": "¿Cómo se levanta o cancela un embargo?",
        "body": "Un embargo no caduca solo ni se borra pagándole a un particular: se levanta con una orden de la misma autoridad que lo decretó. Cuando se paga la deuda, se concilia, o el proceso termina, el juez o la entidad expide un oficio de desembargo. Ese oficio se radica en la Oficina de Registro de Instrumentos Públicos, que inscribe una nueva anotación cancelando el embargo. Solo cuando esa anotación de cancelación aparece en el folio, el inmueble queda libre para venderse. Si una anotación dice 'embargo' pero no encuentras otra posterior que lo levante, asume que la medida sigue vigente. Conserva el oficio judicial y verifica siempre el registro actualizado."
      },
      {
        "heading": "¿Dónde verifico si un inmueble está embargado?",
        "body": "Todo esto se ve y se verifica en el Certificado de Tradición y Libertad, el documento que muestra la historia jurídica del inmueble: propietarios, hipotecas, limitaciones y, por supuesto, embargos y desembargos. Cada movimiento queda numerado como una anotación con fecha, así que puedes seguir la secuencia y saber si una medida fue cancelada. La recomendación es trabajar siempre con un certificado reciente, no con uno de hace meses, porque una anotación nueva cambia todo. Con Certitradición puedes generar el certificado en línea, pagando con Wompi, y recibirlo en tu correo en minutos por $39.900, sin filas ni desplazamientos."
      }
    ],
    "faqs": [
      {
        "q": "¿Puedo comprar un inmueble que tiene embargo?",
        "a": "No es recomendable. Mientras el embargo esté vigente, la escritura de compraventa será rechazada en registro y el bien podría rematarse en el proceso. Exige primero que aparezca la anotación de cancelación del embargo en el certificado."
      },
      {
        "q": "¿Quién puede levantar un embargo sobre una propiedad?",
        "a": "Solo la autoridad que lo ordenó: el juez o la entidad de cobro coactivo, como la DIAN. Tras pagar o terminar el proceso, expide un oficio de desembargo que la Oficina de Registro inscribe como nueva anotación en el folio."
      },
      {
        "q": "¿Cómo sé si el embargo ya fue cancelado en el certificado?",
        "a": "Busca en las anotaciones la palabra 'embargo' y revisa si existe una anotación posterior, con fecha más reciente, que lo cancele o levante. Si no aparece esa cancelación, la medida sigue vigente sobre el inmueble."
      }
    ]
  },
  {
    "slug": "hipoteca",
    "tema": "Hipoteca",
    "metaTitle": "Hipoteca en el Certificado de Tradición y Libertad",
    "metaDescription": "¿El inmueble tiene hipoteca? Aprende a leerla en el Certificado de Tradición y Libertad, cómo cancelarla y qué pasa al comprar una propiedad hipotecada.",
    "h1": "Hipoteca en el Certificado de Tradición y Libertad: cómo leerla, cancelarla y comprar con seguridad",
    "intro": "La hipoteca es uno de los datos más importantes al comprar, vender o estudiar un inmueble en Colombia, porque significa que la propiedad respalda una deuda. Lo bueno es que no es un secreto: queda registrada y cualquiera puede verificarla en el Certificado de Tradición y Libertad. En esta guía te explicamos qué es una hipoteca, cómo aparece en el folio de matrícula, cómo se cancela y qué debes revisar antes de comprar un inmueble hipotecado.",
    "secciones": [
      {
        "heading": "¿Qué es una hipoteca y por qué aparece en el folio?",
        "body": "La hipoteca es una garantía: el propietario afecta su inmueble para respaldar el pago de una deuda, normalmente un crédito hipotecario con un banco. El inmueble sigue siendo del dueño y este puede vivirlo o usarlo, pero queda \"gravado\": si no se paga la obligación, el acreedor puede perseguir el bien para cobrarse. Como la hipoteca debe constar por escritura pública y registrarse ante la Oficina de Registro de Instrumentos Públicos, queda anotada en el folio de matrícula inmobiliaria. Por eso el Certificado de Tradición y Libertad es el documento donde realmente confirmas si una propiedad tiene o no hipoteca vigente, sin depender solo de lo que diga el vendedor."
      },
      {
        "heading": "¿Cómo se ve la hipoteca en el Certificado de Tradición y Libertad?",
        "body": "En el CTL la información se organiza por anotaciones numeradas y cronológicas. Cada anotación incluye la fecha, el tipo de acto (por ejemplo, \"hipoteca\" o \"constitución de hipoteca\"), los datos del documento que la originó (escritura pública, notaría y fecha) y las partes involucradas: quién es el deudor y quién el acreedor (el banco o entidad). Una hipoteca aparece dentro del grupo de gravámenes y limitaciones al dominio. Lo clave es revisar si esa anotación sigue activa o si más adelante existe otra que la cancele. Una hipoteca que nunca fue cancelada seguirá figurando como vigente, aunque la deuda ya se haya pagado, hasta que se registre formalmente su levantamiento."
      },
      {
        "heading": "¿Cómo se cancela una hipoteca en el folio?",
        "body": "Pagar la totalidad del crédito no borra la hipoteca del certificado de forma automática. La cancelación es un trámite que debe registrarse. En la práctica, el acreedor (normalmente el banco) emite un documento que autoriza el levantamiento del gravamen; con él se otorga la escritura pública de cancelación de hipoteca en notaría y luego se registra ante la Oficina de Registro. Solo cuando ese registro queda hecho, aparece en el folio una nueva anotación que cancela la hipoteca. Por eso es tan común encontrar inmuebles con hipotecas \"fantasma\" ya pagadas pero no levantadas. Verificar este paso en el Certificado de Tradición y Libertad evita sorpresas al vender o comprar."
      },
      {
        "heading": "¿Se puede comprar un inmueble hipotecado? Qué revisar antes",
        "body": "Sí, comprar una propiedad hipotecada es legal y muy frecuente. Lo importante es manejar bien el proceso para que la deuda no quede a tu cargo. Suele resolverse cancelando la hipoteca con parte del precio de venta o coordinando un crédito que sustituya al anterior, con acompañamiento de la notaría y la entidad financiera. Antes de firmar, confirma en el CTL quién es el acreedor, si la hipoteca sigue vigente y si existen embargos u otras limitaciones. Pide un certificado reciente, no uno viejo. Con Certitradición puedes generar el Certificado de Tradición y Libertad en línea, pagar con Wompi y recibirlo en tu correo en minutos por $39.900, ideal para verificar el estado real del inmueble antes de comprometerte."
      }
    ],
    "faqs": [
      {
        "q": "¿La hipoteca desaparece del certificado al pagar la deuda?",
        "a": "No automáticamente. Aunque pagues todo el crédito, la hipoteca sigue figurando como vigente hasta que se registre su cancelación con escritura pública ante la Oficina de Registro. Hasta entonces, el folio mostrará el gravamen activo."
      },
      {
        "q": "¿Cómo sé si un inmueble tiene hipoteca antes de comprarlo?",
        "a": "Revisando el Certificado de Tradición y Libertad actualizado. Allí, dentro de los gravámenes, verás si hay una anotación de hipoteca vigente, quién es el acreedor y si fue cancelada. Es la fuente confiable, más allá de lo que diga el vendedor."
      },
      {
        "q": "¿Puedo vender un inmueble con hipoteca vigente?",
        "a": "Sí. Es habitual: la hipoteca suele cancelarse con el dinero de la venta o el comprador asume un nuevo crédito. La notaría y el banco coordinan el proceso. Conviene tener un Certificado de Tradición y Libertad reciente para mostrar el estado real."
      }
    ]
  },
  {
    "slug": "falsa-tradicion",
    "tema": "Falsa tradición",
    "metaTitle": "Falsa tradición: qué es y cómo verla en el CTL",
    "metaDescription": "¿Vas a comprar un inmueble? La falsa tradición es un riesgo grave que se ve en el Certificado de Tradición y Libertad. Aprende a detectarla antes de pagar.",
    "h1": "Falsa tradición: qué es, por qué es un riesgo al comprar y cómo detectarla en el Certificado de Tradición y Libertad",
    "intro": "La falsa tradición es una de las advertencias más serias que pueden aparecer en un inmueble en Colombia y, sin embargo, muchos compradores la descubren tarde. En la práctica significa que quien le vende no transfiere un derecho de propiedad pleno, sino algo incompleto o discutible. Lo importante es que esta condición no se esconde: queda registrada y se ve directamente en el Certificado de Tradición y Libertad. Aquí te explicamos qué es, por qué importa y cómo identificarla antes de firmar.",
    "secciones": [
      {
        "heading": "¿Qué es la falsa tradición en términos prácticos?",
        "body": "La falsa tradición ocurre cuando alguien transfiere un inmueble sobre el que no tiene la propiedad plena y demostrada, sino un derecho incompleto. Casos típicos: la venta de cosa ajena, la transferencia de derechos y acciones hereditarios sin sucesión liquidada, o la enajenación de mejoras sobre un predio cuyo dominio no se acredita. En el registro de instrumentos públicos esto no se inscribe como una verdadera tradición del dominio, sino bajo la categoría de falsa tradición. En lenguaje sencillo: el vendedor te puede entregar la posesión o un derecho, pero no necesariamente la titularidad limpia que esperarías al comprar. Por eso es un concepto que conviene entender antes de poner dinero sobre la mesa."
      },
      {
        "heading": "¿Por qué es un riesgo grave comprar con falsa tradición?",
        "body": "Comprar un inmueble con falsa tradición es entrar a un terreno jurídicamente frágil. No adquieres dominio pleno, sino una posición que puede ser cuestionada por terceros, herederos o verdaderos dueños. Esto dificulta acceder a crédito hipotecario, pues los bancos suelen rechazar garantías sin tradición sana; complica revender, porque el siguiente comprador encontrará la misma advertencia; y te expone a litigios costosos para sanear el título. Regularizar una falsa tradición puede exigir procesos como pertenencia o saneamiento, que toman tiempo y dinero, sin garantía de éxito. No significa que el predio no valga nada, pero sí que su precio, su seguridad y su liquidez son muy distintos a los de un inmueble con propiedad limpia."
      },
      {
        "heading": "¿Cómo se detecta la falsa tradición en el Certificado de Tradición y Libertad?",
        "body": "El Certificado de Tradición y Libertad (CTL) es el documento donde queda la historia jurídica del inmueble, y la falsa tradición se ve allí de forma explícita. En el certificado revisa el grupo de anotaciones referidas a la tradición: cuando existe esta condición, suele aparecer mencionada como falsa tradición, junto a expresiones como venta de derechos y acciones, venta de cosa ajena o transferencia de mejoras. Fíjate en quién aparece como titular del dominio y en cómo se describe cada acto inscrito. Si una anotación no transfiere el dominio pleno, el CTL lo indica. Por eso, antes de firmar promesa o escritura, lo prudente es leer el certificado completo y, ante cualquier duda, consultarlo con un abogado."
      },
      {
        "heading": "¿Cómo verificar el inmueble antes de comprar con Certitradición?",
        "body": "La forma más rápida de salir de dudas es revisar el documento mismo. Con Certitradición generas el Certificado de Tradición y Libertad en línea: pagas de forma segura con Wompi, cuesta $39.900 y llega a tu correo en minutos, sin filas ni desplazamientos. Somos un gestor privado que facilita el trámite; el certificado refleja la información del registro de instrumentos públicos. Con el documento en mano puedes ubicar las anotaciones de tradición y confirmar si existe alguna advertencia de falsa tradición antes de comprometer tu dinero. Tener el CTL actualizado es el primer paso de una compra responsable: te permite negociar con información y, si hace falta, llevarlo a un abogado para análisis."
      }
    ],
    "faqs": [
      {
        "q": "¿La falsa tradición significa que el inmueble es robado o ilegal?",
        "a": "No necesariamente. Indica que la transferencia no recae sobre un dominio pleno y acreditado, sino sobre un derecho incompleto, como mejoras o derechos hereditarios. Es una advertencia jurídica seria, no una prueba automática de ilegalidad, pero exige asesoría antes de comprar."
      },
      {
        "q": "¿Se puede sanear o regularizar un inmueble con falsa tradición?",
        "a": "En muchos casos sí, mediante procesos como pertenencia o saneamiento de la propiedad, según la situación particular. Sin embargo, son trámites que toman tiempo, dinero y no siempre prosperan. Lo recomendable es consultar con un abogado antes de adquirir el inmueble."
      },
      {
        "q": "¿Dónde veo si un inmueble tiene falsa tradición?",
        "a": "En el Certificado de Tradición y Libertad, dentro de las anotaciones de tradición del predio. Allí aparece descrita la condición y términos relacionados. Con Certitradición puedes generarlo en línea por $39.900 y recibirlo en tu correo en minutos para revisarlo."
      }
    ]
  },
  {
    "slug": "patrimonio-de-familia",
    "tema": "Patrimonio de familia inembargable",
    "metaTitle": "Patrimonio de Familia Inembargable en el CTL | Guía",
    "metaDescription": "Qué es el patrimonio de familia inembargable, cómo afecta la venta del inmueble y cómo se cancela. Verifícalo en tu Certificado de Tradición y Libertad.",
    "h1": "Patrimonio de familia inembargable: qué es y cómo se ve en el Certificado de Tradición",
    "intro": "El patrimonio de familia inembargable es una protección legal sobre la vivienda que la blinda frente a embargos por deudas. Si vas a comprar o vender un inmueble en Colombia, esta figura puede frenar o condicionar el negocio, porque mientras esté vigente la propiedad no se puede transferir libremente ni rematar. Todo queda registrado y es visible en el Certificado de Tradición y Libertad. Aquí te explicamos qué es, cómo afecta la venta y cómo se cancela, sin tecnicismos.",
    "secciones": [
      {
        "heading": "¿Qué es el patrimonio de familia inembargable?",
        "body": "Es una figura jurídica que afecta un inmueble destinado a vivienda para protegerlo de los acreedores: estando vigente, el bien no puede ser embargado ni rematado por deudas del propietario. Busca garantizar que la familia conserve un techo. Puede ser voluntario, cuando el propietario lo constituye sobre su vivienda, o legal u obligatorio, cuando nace por mandato de la ley en ciertos casos, como predios de vivienda de interés social. La afectación queda anotada en el folio de matrícula inmobiliaria y, por eso, aparece en el Certificado de Tradición y Libertad como una limitación al dominio. Si estudias un inmueble, esta anotación te avisa que la propiedad tiene una protección activa que condiciona cualquier negocio sobre ella."
      },
      {
        "heading": "¿Cómo afecta la venta del inmueble?",
        "body": "El patrimonio de familia inembargable limita la libre disposición del bien. En la práctica, vender, hipotecar o gravar el inmueble suele exigir trámites adicionales, como la cancelación previa de la afectación o, según el caso, autorización judicial cuando hay menores de edad beneficiarios. No basta con la voluntad del vendedor: la protección está pensada para resguardar a toda la familia, incluidos los hijos. Por eso, antes de firmar promesa o escritura, comprador y vendedor deben verificar si el folio tiene esta anotación. Una venta hecha sin levantar correctamente la limitación puede quedar viciada o no inscribirse en el registro. Revisar el Certificado de Tradición y Libertad al inicio del negocio evita sorpresas, demoras en notaría y dinero comprometido sobre un inmueble que aún no se puede transferir."
      },
      {
        "heading": "¿Cómo se cancela o levanta el patrimonio de familia?",
        "body": "El levantamiento depende del tipo de patrimonio y de la situación familiar. Cuando hay beneficiarios menores de edad, normalmente se requiere un proceso ante el juez de familia, que evalúa si la cancelación conviene a los menores antes de autorizarla. Si todos los beneficiarios son mayores y están de acuerdo, el trámite puede hacerse por escritura pública en notaría. En cualquier caso, el acto que cancela la afectación debe inscribirse en la Oficina de Registro de Instrumentos Públicos para que surta efecto frente a terceros. Solo cuando esa cancelación queda registrada, la limitación desaparece del folio. Por eso conviene pedir el Certificado de Tradición y Libertad después del trámite: confirma que la anotación fue efectivamente levantada y que el inmueble ya está libre para venderse."
      },
      {
        "heading": "¿Dónde verificas todo esto? En el Certificado de Tradición y Libertad",
        "body": "El Certificado de Tradición y Libertad (CTL) es el documento donde aparece la historia jurídica del inmueble: propietarios, hipotecas, embargos, limitaciones y, claro, el patrimonio de familia inembargable. Cada movimiento queda como una anotación numerada en el folio de matrícula. Leer el CTL te dice si la afectación sigue vigente o ya fue cancelada, y en qué fecha. Es la forma más confiable de no comprar problemas ni vender algo que no puedes transferir todavía. Con Certitradición generas tu CTL en línea de forma sencilla: pagas con Wompi, cuesta $39.900 y llega a tu correo en minutos. Somos un gestor privado que facilita el trámite; así verificas el estado real del inmueble antes de tomar cualquier decisión."
      }
    ],
    "faqs": [
      {
        "q": "¿Se puede vender un inmueble con patrimonio de familia inembargable?",
        "a": "Sí, pero primero hay que levantar la afectación. Según el caso, esto exige escritura pública con acuerdo de los beneficiarios o autorización judicial cuando hay menores. La cancelación debe inscribirse en el registro antes de transferir el inmueble."
      },
      {
        "q": "¿Dónde compruebo si un inmueble tiene patrimonio de familia?",
        "a": "En el Certificado de Tradición y Libertad. Allí, dentro de las anotaciones del folio de matrícula, aparece la constitución de la afectación y, si fue levantada, también la anotación de cancelación con su fecha. Es la fuente más confiable para verificarlo."
      },
      {
        "q": "¿El patrimonio de familia protege contra todas las deudas?",
        "a": "Protege el inmueble frente a embargos y remates por deudas comunes del propietario mientras está vigente. Sin embargo, no es una protección absoluta: existen excepciones legales, por lo que conviene asesorarse y revisar siempre el estado actual en el certificado."
      }
    ]
  },
  {
    "slug": "afectacion-vivienda-familiar",
    "tema": "Afectación a vivienda familiar",
    "metaTitle": "Afectación a vivienda familiar en el CTL: qué es",
    "metaDescription": "¿Tu inmueble tiene afectación a vivienda familiar? Descubre qué significa, cómo afecta vender o hipotecar y verifícalo hoy en tu Certificado de Tradición y Libertad.",
    "h1": "Afectación a vivienda familiar: qué es y cómo verla en el Certificado de Tradición y Libertad",
    "intro": "La afectación a vivienda familiar es una de las anotaciones que más sorpresas genera al comprar o vender un inmueble en Colombia. Es una protección legal que limita lo que el dueño puede hacer con la casa sin el consentimiento de su pareja. Antes de cualquier negocio conviene saber si existe, porque condiciona la venta y la hipoteca. Todo esto queda registrado y se verifica directamente en el Certificado de Tradición y Libertad del predio.",
    "secciones": [
      {
        "heading": "¿Qué es la afectación a vivienda familiar?",
        "body": "Es una figura del derecho colombiano que protege el techo de la familia. Cuando un inmueble se destina a vivienda de la pareja (cónyuges o compañeros permanentes), puede quedar \"afectado\", lo que significa que el propietario no puede venderlo, hipotecarlo ni gravarlo por su cuenta: necesita el consentimiento del otro miembro de la pareja. La idea es evitar que uno solo disponga del hogar y deje a la familia sin vivienda. Esta afectación nace por ministerio de la ley en ciertos casos y también puede constituirse voluntariamente. Lo importante para ti como comprador o vendedor es que se inscribe en el folio de matrícula inmobiliaria, por lo que queda visible en el Certificado de Tradición y Libertad. Si el certificado la registra, el inmueble está sujeto a esa limitación."
      },
      {
        "heading": "¿Cómo afecta vender o hipotecar el inmueble?",
        "body": "Mientras la afectación esté vigente, el dueño no puede disponer libremente del predio. Para vender, hipotecar o constituir cualquier gravamen se exige la firma y autorización de ambos miembros de la pareja; sin ese consentimiento conjunto, el negocio puede quedar viciado o el notario y la oficina de registro pueden negarse a tramitarlo. Por eso, si vas a comprar, verificar esta anotación evita que firmes una compraventa que después no se puede registrar. La afectación termina (se levanta) en supuestos como la venta autorizada por ambos, el divorcio o la liquidación de la sociedad, o por acuerdo de la pareja, y ese levantamiento también debe inscribirse. La forma práctica de confirmar si está activa o ya se levantó es revisar las anotaciones del Certificado de Tradición y Libertad actualizado."
      },
      {
        "heading": "Afectación a vivienda familiar vs. patrimonio de familia: ¿en qué se diferencian?",
        "body": "Suelen confundirse porque ambas protegen la vivienda, pero no son lo mismo. La afectación a vivienda familiar busca proteger a la pareja: limita la disposición del inmueble exigiendo el consentimiento de ambos, y se extingue cuando termina la relación o se vende de común acuerdo. El patrimonio de familia, en cambio, es una figura que hace el bien inembargable para proteger a la familia (especialmente a los hijos) frente a acreedores, con sus propios requisitos y causales de extinción. Una protege contra la disposición unilateral; la otra, principalmente contra el embargo. Un mismo inmueble puede tener una, otra o ambas. Como las dos se inscriben en el registro, ambas aparecen como anotaciones en el Certificado de Tradición y Libertad, y conviene leerlas con atención para no confundir su alcance."
      },
      {
        "heading": "¿Dónde se verifica la afectación a vivienda familiar?",
        "body": "La única fuente confiable es el folio de matrícula inmobiliaria del predio, que se materializa en el Certificado de Tradición y Libertad (CTL). Allí, en el listado de anotaciones, aparece si el inmueble fue afectado a vivienda familiar, con la fecha y el documento que la originó, y si posteriormente se levantó. No basta con preguntarle al vendedor: una afectación no resuelta puede frenar la escritura. Por eso, antes de firmar promesa, desembolsar dinero o solicitar un crédito, pide un certificado reciente y léelo con calma. Con Certitradición puedes generar tu Certificado de Tradición y Libertad en línea, pagando con Wompi; llega a tu correo en minutos por $39.900. Somos un gestor privado que facilita el trámite para que verifiques estas anotaciones sin filas ni demoras."
      }
    ],
    "faqs": [
      {
        "q": "¿La afectación a vivienda familiar me impide comprar la casa?",
        "a": "No te lo impide, pero condiciona la compra: el negocio requiere el consentimiento de ambos miembros de la pareja propietaria. Verifica en el Certificado de Tradición y Libertad si está vigente antes de firmar, para que la escritura pueda registrarse sin problemas."
      },
      {
        "q": "¿Cómo se levanta la afectación a vivienda familiar?",
        "a": "Generalmente se levanta por acuerdo de la pareja, por venta autorizada por ambos, o cuando termina la relación o se liquida la sociedad. El levantamiento debe inscribirse en el registro y quedará reflejado en las anotaciones del Certificado de Tradición y Libertad."
      },
      {
        "q": "¿Cómo sé si mi inmueble tiene afectación a vivienda familiar?",
        "a": "Revisando el Certificado de Tradición y Libertad del predio: la afectación figura en las anotaciones, con su fecha y documento. Con Certitradición lo generas en línea, pagas con Wompi y lo recibes en tu correo en minutos por $39.900."
      }
    ]
  },
  {
    "slug": "medidas-cautelares",
    "tema": "Medidas cautelares (demandas y prohibiciones de enajenar)",
    "metaTitle": "Medidas cautelares en el CTL: demandas y embargos",
    "metaDescription": "¿El inmueble tiene demanda registrada o prohibición de enajenar? Aprende a leer las medidas cautelares en el Certificado de Tradición y evita comprar un problema.",
    "h1": "Medidas cautelares en el inmueble: demandas y prohibiciones de enajenar en el Certificado de Tradición y Libertad",
    "intro": "Antes de comprar un inmueble, una de las verificaciones más importantes es saber si tiene medidas cautelares. Demandas registradas, embargos o prohibiciones de enajenar pueden congelar la venta o poner en riesgo tu dinero. Todas estas restricciones quedan anotadas en el folio de matrícula inmobiliaria y se reflejan en el Certificado de Tradición y Libertad (CTL). En esta guía te explicamos qué significan, qué riesgo representan al comprar y cómo confirmarlas leyendo el certificado correctamente.",
    "secciones": [
      {
        "heading": "¿Qué son las medidas cautelares y por qué aparecen en el CTL?",
        "body": "Las medidas cautelares son decisiones que toma un juez o una autoridad para proteger un derecho mientras se resuelve un proceso. En materia inmobiliaria buscan asegurar que el bien no salga del patrimonio del demandado antes de que termine el litigio. Las más comunes son el embargo, la inscripción de la demanda y la prohibición de enajenar. Cuando un juzgado las decreta, ordena su inscripción en el folio de matrícula del inmueble en la Oficina de Registro de Instrumentos Públicos. Por eso aparecen como anotaciones en el Certificado de Tradición y Libertad: el CTL es el espejo histórico del inmueble y registra cada restricción vigente o ya cancelada. Verificarlas es el primer filtro de seguridad antes de cualquier negocio."
      },
      {
        "heading": "Demanda registrada vs. prohibición de enajenar: ¿en qué se diferencian?",
        "body": "Aunque ambas son medidas cautelares, no son lo mismo. La inscripción de la demanda advierte a terceros que existe un proceso judicial sobre la propiedad o sobre derechos asociados al inmueble; quien compre lo hace sabiendo que hay un pleito en curso y puede verse afectado por la sentencia. La prohibición de enajenar, en cambio, impide directamente vender, gravar o transferir el bien mientras la medida esté vigente; busca congelar la situación jurídica. El embargo, por su parte, retiene el inmueble como garantía de una deuda y suele acompañarse de remate. En el Certificado de Tradición y Libertad cada una figura como una anotación distinta, con su tipo de acto, la autoridad que la ordenó y la fecha. Distinguirlas te dice exactamente qué tan bloqueado está el inmueble."
      },
      {
        "heading": "¿Qué riesgo corres si compras un inmueble con medidas cautelares?",
        "body": "Comprar un inmueble con medidas cautelares vigentes es uno de los errores más costosos. Si hay prohibición de enajenar o embargo, lo más probable es que la Oficina de Registro rechace la inscripción de tu escritura de compraventa: pagarías sin quedar como propietario. Si hay una demanda inscrita, podrías adquirir el bien y luego perder el pleito, quedando expuesto a que un tercero reclame derechos sobre él. Incluso si te dicen que la medida 'ya se levantó', solo cuentas si la cancelación está efectivamente anotada en el folio. La recomendación práctica es clara: nunca firmes promesa ni entregues dinero sin revisar primero las anotaciones del Certificado de Tradición y Libertad y confirmar que no haya restricciones activas."
      },
      {
        "heading": "¿Cómo verificar las medidas cautelares en el Certificado de Tradición y Libertad?",
        "body": "En el CTL, las anotaciones se leen en orden cronológico y numeradas. Revisa la columna de cada anotación: ahí se indica el tipo de acto (embargo, demanda, prohibición de enajenar), la autoridad que lo ordenó y la fecha de inscripción. Una medida cautelar sigue vigente hasta que aparezca otra anotación posterior que la cancele o levante expresamente. No basta con que el vendedor lo afirme: debe constar en el documento. Por eso conviene tener un certificado reciente y completo. Con Certitradición puedes generar el Certificado de Tradición y Libertad en línea, pagando con Wompi y recibiéndolo en tu correo en minutos por $39.900. Así verificas el estado real del inmueble antes de tomar cualquier decisión de compra o venta."
      }
    ],
    "faqs": [
      {
        "q": "¿Una prohibición de enajenar impide vender el inmueble por completo?",
        "a": "Sí. Mientras esté vigente, esa medida cautelar impide vender, hipotecar o transferir el bien, y el registro normalmente rechazará la escritura. Solo desaparece cuando una anotación posterior en el Certificado de Tradición y Libertad confirma que fue levantada."
      },
      {
        "q": "Si la demanda ya terminó, ¿por qué sigue apareciendo en el certificado?",
        "a": "El CTL es histórico: las anotaciones no se borran. Una medida cautelar solo deja de tener efecto cuando aparece otra anotación que la cancela expresamente. Si no ves esa cancelación registrada, asume que la restricción sigue vigente y verifícalo."
      },
      {
        "q": "¿Cómo confirmo rápido si un inmueble tiene medidas cautelares?",
        "a": "Generando un Certificado de Tradición y Libertad reciente y leyendo sus anotaciones. Con Certitradición lo obtienes en línea, pagando con Wompi, y llega a tu correo en minutos por $39.900, mostrando embargos, demandas o prohibiciones registradas."
      }
    ]
  },
  {
    "slug": "como-saber-si-una-propiedad-esta-hipotecada-o-embargada",
    "tema": "Cómo saber si una propiedad está hipotecada o embargada antes de comprar",
    "metaTitle": "¿Hipotecada o embargada? Revísalo en el CTL",
    "metaDescription": "Antes de comprar, descubre si una propiedad está hipotecada o embargada leyendo el Certificado de Tradición y Libertad. Guía práctica y en línea desde $39.900.",
    "h1": "Cómo saber si una propiedad está hipotecada o embargada antes de comprar",
    "intro": "Comprar un inmueble sin verificar su situación jurídica es uno de los errores más costosos del mercado. Una hipoteca vigente o un embargo pueden bloquear la transferencia o hacerte heredar deudas ajenas. La buena noticia es que toda esa información está reunida en un solo documento: el Certificado de Tradición y Libertad (CTL). En esta guía práctica te explicamos qué revisar, cómo interpretar las anotaciones y por qué pedir un certificado actualizado es tu mejor blindaje antes de firmar.",
    "secciones": [
      {
        "heading": "¿Qué es el Certificado de Tradición y Libertad y por qué importa antes de comprar?",
        "body": "El Certificado de Tradición y Libertad es el documento que refleja la historia jurídica de un inmueble identificado por su matrícula inmobiliaria en la Oficina de Registro de Instrumentos Públicos. Allí quedan inscritas las anotaciones: compraventas, hipotecas, embargos, limitaciones de dominio y demás actos que afectan la propiedad. Antes de comprar, este certificado te dice quién es el verdadero titular y si el inmueble tiene cargas que limiten o impidan venderlo. No te fíes solo de la palabra del vendedor ni de documentos antiguos: lo que vale es lo registrado y vigente. Por eso, revisar un CTL actualizado es el primer paso indispensable de cualquier negociación inmobiliaria seria en Colombia."
      },
      {
        "heading": "¿Cómo identificar una hipoteca en el certificado?",
        "body": "En el CTL las hipotecas aparecen como anotaciones específicas que mencionan el acto de \"hipoteca\" a favor de un acreedor, normalmente un banco o entidad financiera. Lo clave es revisar dos cosas: si la anotación existe y si fue cancelada. Una hipoteca vigente significa que el inmueble respalda una deuda; si el dueño no paga, el acreedor puede perseguir el bien. Cuando la deuda se salda, debe registrarse una anotación de cancelación de la hipoteca. Si solo ves la constitución pero no su cancelación, asume que sigue activa. Lee cada anotación con su fecha y, si una hipoteca aparece levantada, confirma que la cancelación quedó efectivamente inscrita. Todo esto se verifica directamente en el Certificado de Tradición y Libertad."
      },
      {
        "heading": "¿Cómo detectar embargos y otras medidas que bloquean la venta?",
        "body": "Los embargos también figuran como anotaciones en el CTL y suelen originarse en procesos judiciales o cobros coactivos. Un embargo limita la libre disposición del inmueble: mientras esté vigente, la venta puede ser nula o quedar sujeta al resultado del proceso. Igual que con la hipoteca, busca la anotación del embargo y verifica si existe su correspondiente desembargo o levantamiento. Además del embargo, presta atención a otras limitaciones que reduzcan tu seguridad: demandas, afectación a vivienda familiar, patrimonio de familia, usufructos o servidumbres. Cualquiera de estas puede complicar la compra. La regla práctica es simple: lee todas las anotaciones en orden y desconfía de cualquier carga que no aparezca expresamente cancelada en el certificado."
      },
      {
        "heading": "¿Por qué pedir el certificado actualizado en línea con Certitradición?",
        "body": "Un certificado viejo no sirve: las anotaciones cambian y una hipoteca o embargo puede inscribirse días antes de la firma. Por eso conviene pedir el CTL lo más cerca posible de la negociación y, en operaciones grandes, volver a verificarlo justo antes de firmar la escritura. En Certitradición, gestor privado, generas tu Certificado de Tradición y Libertad en línea de forma sencilla: pagas con Wompi y lo recibes en tu correo en minutos, por $39.900. No somos la entidad oficial de registro; somos un servicio que te facilita obtener el documento rápido para que revises hipotecas, embargos y titularidad con tranquilidad antes de tomar una de las decisiones más importantes de tu vida."
      }
    ],
    "faqs": [
      {
        "q": "¿Puedo comprar un inmueble que tiene hipoteca?",
        "a": "Sí, pero con cuidado. Lo habitual es cancelar la hipoteca con parte del precio o pactar su levantamiento antes de la escritura. Verifica siempre en el Certificado de Tradición y Libertad que la cancelación quede efectivamente inscrita antes de pagar el saldo final."
      },
      {
        "q": "¿Un embargo siempre impide vender la propiedad?",
        "a": "Un embargo limita la libre disposición del inmueble y puede afectar la validez de la venta mientras esté vigente. Lo más seguro es esperar el levantamiento o desembargo, confirmado en el certificado, antes de avanzar con la compra para evitar perder tu dinero."
      },
      {
        "q": "¿Cada cuánto debo actualizar el certificado antes de comprar?",
        "a": "Las anotaciones pueden cambiar en cualquier momento, así que conviene pedir un certificado reciente al negociar y volver a verificarlo justo antes de firmar la escritura. Con Certitradición lo generas en línea y lo recibes en minutos por $39.900."
      }
    ]
  },
  {
    "slug": "servidumbre",
    "tema": "Servidumbre",
    "metaTitle": "Servidumbre en el Certificado de Tradición y Libertad",
    "metaDescription": "Qué es una servidumbre, cómo aparece en el Certificado de Tradición y Libertad y cómo afecta tu predio. Verifícalo en línea con Certitradición en minutos.",
    "h1": "Servidumbre en el predio: qué es y cómo verla en el Certificado de Tradición y Libertad",
    "intro": "Antes de comprar o vender un inmueble en Colombia conviene saber si sobre él pesa una servidumbre, es decir, un gravamen que obliga a tu predio a soportar cierto uso en beneficio de otro. Estas cargas no siempre se ven a simple vista en el terreno, pero sí quedan reflejadas en el Certificado de Tradición y Libertad. En esta guía te explicamos qué es una servidumbre, cómo aparece en el certificado y de qué manera puede afectar el uso y el valor de tu predio.",
    "secciones": [
      {
        "heading": "¿Qué es una servidumbre y por qué afecta tu predio?",
        "body": "Una servidumbre es un gravamen impuesto sobre un predio (llamado sirviente) en beneficio de otro predio de distinto dueño (el dominante). En palabras simples, tu inmueble debe soportar o permitir cierto uso a favor de un vecino. La más común es la servidumbre de tránsito o paso, cuando un predio encerrado necesita atravesar el tuyo para llegar a la vía pública. También existen servidumbres de acueducto, de desagüe, de vista o de tendido de redes eléctricas. La servidumbre sigue al predio, no a la persona: aunque cambie el propietario, la carga permanece. Por eso es un derecho real que limita lo que puedes hacer en esa porción de terreno y debe conocerse antes de cualquier negocio inmobiliario."
      },
      {
        "heading": "¿Cómo aparece la servidumbre en el Certificado de Tradición y Libertad?",
        "body": "Las servidumbres son actos sujetos a registro, de modo que quedan inscritas como una anotación en el folio de matrícula inmobiliaria del predio. En el Certificado de Tradición y Libertad las verás dentro del listado de anotaciones, normalmente bajo descripciones como \"constitución de servidumbre\", \"servidumbre de tránsito\" o similares, con la fecha, el documento que la originó (escritura pública o sentencia) y las partes involucradas. Si tu predio es el sirviente, la anotación lo señala como gravamen; si es el dominante, puede figurar como un derecho a su favor. Revisar el certificado completo es la única forma confiable de confirmar si existe una servidumbre, ya que muchas no se perciben recorriendo el terreno."
      },
      {
        "heading": "¿Cómo afecta el uso y el valor del inmueble?",
        "body": "Una servidumbre limita el aprovechamiento de la franja de terreno afectada: no podrás construir, cercar ni obstaculizar libremente el paso, el acueducto o las redes que cruzan tu predio. Esto puede reducir el área útil, condicionar proyectos de construcción y, en ciertos casos, incidir en el precio de venta. No siempre es negativo: si tu predio es el dominante, la servidumbre puede ser justo lo que garantiza tu acceso a la vía o al agua. Lo riesgoso es comprar sin saber que existe. Por eso, antes de firmar, verifica en el Certificado de Tradición y Libertad si hay servidumbres inscritas y consulta con un abogado el alcance exacto de cada una sobre el inmueble."
      },
      {
        "heading": "Verifica las servidumbres de tu predio con Certitradición",
        "body": "La forma más práctica de saber si un inmueble tiene servidumbres es revisar su Certificado de Tradición y Libertad actualizado, donde se registran estas anotaciones junto con los demás gravámenes y limitaciones. Con Certitradición puedes generar el certificado en línea de forma sencilla: pagas $39.900 mediante Wompi y lo recibes en tu correo en minutos, sin filas ni desplazamientos. Somos un gestor privado que facilita la obtención del documento para que lo revises con calma antes de comprar, vender o estudiar un predio. Una vez tengas el certificado, ubica el listado de anotaciones y busca cualquier mención a servidumbres para confirmar qué cargas pesan sobre el inmueble."
      }
    ],
    "faqs": [
      {
        "q": "¿Una servidumbre desaparece si vendo el inmueble?",
        "a": "No. La servidumbre es un derecho real que recae sobre el predio, no sobre el propietario. Aunque vendas, la carga sigue inscrita en el folio y obliga al nuevo dueño. Solo se extingue por las causas legales y cancelando la anotación en el registro."
      },
      {
        "q": "¿Dónde veo si mi predio tiene una servidumbre?",
        "a": "En el Certificado de Tradición y Libertad, dentro del listado de anotaciones del folio de matrícula. Allí aparecen las servidumbres inscritas con su fecha y documento de origen. Es la fuente confiable, pues muchas no se notan recorriendo el terreno."
      },
      {
        "q": "¿Cómo obtengo rápido el certificado para revisar servidumbres?",
        "a": "Con Certitradición lo generas en línea: pagas $39.900 con Wompi y lo recibes en tu correo en minutos. Somos un gestor privado que agiliza el trámite para que revises servidumbres y demás gravámenes antes de cualquier negocio inmobiliario."
      }
    ]
  },
  {
    "slug": "estudio-de-titulos",
    "tema": "Estudio de títulos",
    "metaTitle": "Estudio de Títulos: el rol del Certificado de Tradición",
    "metaDescription": "Aprende qué es el estudio de títulos, por qué el Certificado de Tradición y Libertad es su base y qué revisa un abogado. Genera tu CTL en línea en minutos.",
    "h1": "Estudio de títulos: qué es y por qué parte del Certificado de Tradición y Libertad",
    "intro": "Antes de comprar un inmueble en Colombia, un estudio de títulos revisa su historia jurídica para confirmar que el vendedor sí es dueño y que la propiedad no arrastra problemas ocultos. Ese análisis siempre empieza por un documento: el Certificado de Tradición y Libertad. Allí se reflejan, en orden, las anotaciones que cuentan qué le ha pasado al predio. En esta guía te explicamos qué es el estudio de títulos, por qué el certificado es su columna vertebral y qué examina realmente un abogado.",
    "secciones": [
      {
        "heading": "¿Qué es exactamente un estudio de títulos?",
        "body": "El estudio de títulos es el análisis jurídico de la historia de un inmueble para verificar quién es el propietario actual, cómo adquirió la propiedad y si existen limitaciones, gravámenes o pleitos que afecten la venta. No es un trámite de la Superintendencia de Notariado y Registro: lo realiza un abogado, normalmente a solicitud del comprador o de un banco que va a otorgar un crédito hipotecario. El objetivo es responder una pregunta práctica: ¿es seguro comprar este predio? Para lograrlo, el profesional reconstruye la cadena de transferencias (la tradición), revisa escrituras públicas y compara todo contra lo que aparece registrado. Un buen estudio reduce el riesgo de comprar un inmueble con problemas que aparecen después de firmar."
      },
      {
        "heading": "¿Por qué el Certificado de Tradición y Libertad es la base?",
        "body": "El Certificado de Tradición y Libertad (CTL) es el documento que resume la vida jurídica de un inmueble identificado por su matrícula inmobiliaria. En él se registran, en orden cronológico, las anotaciones: compraventas, hipotecas, embargos, sucesiones, afectaciones a vivienda familiar y demás actos que recaen sobre el predio. Por eso es el punto de partida obligado de todo estudio de títulos. Sin el certificado, el abogado no tiene el mapa que le dice qué escrituras buscar ni qué cargas confirmar. Toda la información de las secciones siguientes se verifica precisamente en el CTL. En Certitradición puedes generar tu Certificado de Tradición y Libertad en línea, pagando con Wompi, y recibirlo en tu correo en minutos por $39.900: el insumo ideal para empezar."
      },
      {
        "heading": "¿Qué revisa un abogado en el certificado?",
        "body": "Sobre el CTL, el abogado verifica varios puntos clave. Primero, la titularidad: que quien dice vender sea efectivamente el último propietario inscrito. Segundo, los gravámenes, como hipotecas a favor de bancos, que deben cancelarse o asumirse con claridad. Tercero, las limitaciones al dominio: embargos, demandas, patrimonio de familia o afectación a vivienda familiar que pueden impedir o condicionar la venta. Cuarto, la cadena de tradición, revisando que cada transferencia anterior tenga respaldo en una escritura válida. También observa si hay anotaciones de medidas cautelares, falsa tradición o procesos de pertenencia. Cada hallazgo se contrasta con las escrituras y documentos originales para confirmar que la realidad coincide con lo registrado."
      },
      {
        "heading": "¿Para qué te sirve hacer este estudio antes de comprar o vender?",
        "body": "Hacer el estudio de títulos antes de firmar te protege de sorpresas costosas. Si compras un inmueble con una hipoteca vigente, un embargo o un problema en la cadena de propiedad, podrías perder dinero, enfrentar pleitos o quedarte sin poder registrar la escritura a tu nombre. Para el vendedor, revisar primero el certificado ayuda a anticipar inconvenientes y a sanear el inmueble antes de ofrecerlo, lo que agiliza el negocio. Tener a la mano un Certificado de Tradición y Libertad actualizado le permite al abogado trabajar con información reciente, ya que las anotaciones cambian con el tiempo. Generarlo en línea con Certitradición es una forma rápida y práctica de iniciar ese análisis con datos al día."
      }
    ],
    "faqs": [
      {
        "q": "¿El estudio de títulos lo hace la Superintendencia de Notariado y Registro?",
        "a": "No. El estudio de títulos lo realiza un abogado particular, normalmente a solicitud del comprador o del banco. La entidad registral administra la información del inmueble, pero el análisis jurídico y la conclusión sobre si es seguro comprar corresponden al profesional."
      },
      {
        "q": "¿Basta el Certificado de Tradición y Libertad para un estudio de títulos completo?",
        "a": "El certificado es la base imprescindible, pero no es suficiente por sí solo. El abogado lo complementa con las escrituras públicas, documentos de identidad y demás soportes para confirmar que lo registrado coincide con la realidad y que la cadena de propiedad es válida."
      },
      {
        "q": "¿Cómo obtengo el certificado para iniciar el estudio?",
        "a": "Puedes generarlo en línea con Certitradición, un gestor privado. Pagas con Wompi, cuesta $39.900 y lo recibes en tu correo en minutos. Con ese documento actualizado, tu abogado tiene el insumo principal para comenzar el estudio de títulos del inmueble."
      }
    ]
  },
  {
    "slug": "cancelacion-de-hipoteca",
    "tema": "Cancelación de hipoteca",
    "metaTitle": "Cancelación de hipoteca: cómo verla en el certificado",
    "metaDescription": "Aprende a verificar en el Certificado de Tradición y Libertad si una hipoteca ya fue cancelada. Confirma el paz y salvo antes de comprar o vender tu inmueble.",
    "h1": "Cancelación de hipoteca: cómo confirmar el paz y salvo en el Certificado de Tradición y Libertad",
    "intro": "Pagar el crédito no es lo mismo que tener la hipoteca cancelada en el registro. Mientras la cancelación no quede inscrita en el folio de matrícula inmobiliaria, el gravamen sigue figurando y puede frenar una venta o un nuevo crédito. La forma segura de confirmarlo es leyendo el Certificado de Tradición y Libertad (CTL), el documento donde se ve cada anotación del inmueble. Aquí te explicamos cómo identificar que una hipoteca quedó realmente cancelada y obtener tu paz y salvo registral.",
    "secciones": [
      {
        "heading": "¿Por qué pagar el crédito no cancela automáticamente la hipoteca?",
        "body": "La hipoteca es un gravamen que el banco inscribe sobre tu inmueble en la Oficina de Registro de Instrumentos Públicos para garantizar el crédito. Cuando terminas de pagar, la entidad emite una carta o escritura de cancelación, pero ese documento por sí solo no borra el gravamen del registro. Alguien debe llevar el acto cancelatorio a la oficina de registro para que se inscriba en el folio de matrícula del inmueble. Hasta que esa inscripción ocurre, el certificado seguirá mostrando la hipoteca como vigente, aunque el dinero ya esté pagado. Por eso el paso final, y el que muchos olvidan, es verificar en el Certificado de Tradición y Libertad que la cancelación efectivamente quedó anotada."
      },
      {
        "heading": "¿Cómo se ve una hipoteca cancelada en el certificado?",
        "body": "El CTL lista las anotaciones en orden cronológico y numerado. La hipoteca aparece primero como una anotación que dice algo como hipoteca a favor de la entidad financiera, con su naturaleza, fecha y documento que la originó. Cuando se cancela, se inscribe una anotación posterior cuya naturaleza es la cancelación de esa hipoteca, indicando el acto y el documento que la soporta (por ejemplo, escritura pública). La clave es que el certificado refleje esa segunda anotación cancelatoria y que la hipoteca ya no figure entre los gravámenes vigentes. Si solo ves la anotación de constitución y ninguna de cancelación, el gravamen sigue activo registralmente, sin importar lo que diga tu recibo de pago."
      },
      {
        "heading": "¿Qué revisar para confirmar el paz y salvo registral?",
        "body": "Primero, ubica todas las anotaciones relacionadas con la hipoteca y comprueba que exista una de cancelación posterior a la de constitución. Segundo, revisa el cuerpo del certificado donde se resumen los gravámenes, limitaciones y afectaciones: la hipoteca cancelada no debería figurar allí como vigente. Tercero, verifica que la fecha de la anotación cancelatoria sea reciente y coherente con el momento en que pagaste. Cuarto, confirma que los datos del inmueble (matrícula, dirección, propietario) correspondan al tuyo. Si todo concuerda y no quedan gravámenes activos, el inmueble está saneado en ese aspecto. Esta verificación se hace directamente sobre el Certificado de Tradición y Libertad, que es la fuente que consultan bancos, notarías y compradores."
      },
      {
        "heading": "Genera y verifica tu certificado en minutos con Certitradición",
        "body": "Para comprobar el estado de una hipoteca no necesitas desplazarte ni hacer filas: basta con tener un Certificado de Tradición y Libertad actualizado y leer sus anotaciones. En Certitradición lo generas en línea con tu número de matrícula inmobiliaria; pagas de forma segura por Wompi y el documento llega a tu correo en minutos por $39.900. Somos un gestor privado que te facilita obtener el certificado de manera rápida; no somos un canal oficial del Estado. Con el CTL en mano puedes confirmar tú mismo si la cancelación de la hipoteca ya quedó inscrita o si aún falta tramitarla antes de comprar, vender o pedir un nuevo crédito."
      }
    ],
    "faqs": [
      {
        "q": "¿Cuánto tarda en aparecer la cancelación de la hipoteca en el certificado?",
        "a": "Depende de cuándo se lleve el acto de cancelación a la Oficina de Registro y se inscriba. Solo cuando esa inscripción se completa aparece la anotación en el certificado. Por eso conviene generar un CTL actualizado para verificarlo, no confiar en la carta del banco."
      },
      {
        "q": "Si el banco me dio el paz y salvo, ¿ya está cancelada la hipoteca?",
        "a": "No necesariamente. El paz y salvo o la carta de cancelación del banco son el insumo, pero el gravamen sigue figurando hasta que la cancelación se inscribe en el registro. La única prueba definitiva es que aparezca anotada en el Certificado de Tradición y Libertad."
      },
      {
        "q": "¿Puedo vender un inmueble con una hipoteca que figura en el certificado?",
        "a": "Puedes negociarlo, pero la hipoteca vigente es un gravamen que afecta la venta y suele exigir cancelarla en la misma transacción. Antes de cerrar, genera un certificado actualizado para confirmar si el gravamen sigue activo o ya fue cancelado registralmente."
      }
    ]
  }
];

export function getGuia(slug: string): Guia | undefined {
  return GUIAS.find((g) => g.slug === slug);
}
