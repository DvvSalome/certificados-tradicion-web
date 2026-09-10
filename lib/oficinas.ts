// Oficinas de Registro de la SNR (lista real capturada del portal generate.snr).
export const OFICINAS: string[] = [
  'ABEJORRAL', 'ACACIAS', 'AGUA DE DIOS', 'AGUACHICA', 'AGUADAS', 'AMALFI', 'AMBALEMA', 'ANDES', 'ANSERMA', 'APARTADO',
  'APIA', 'ARAUCA', 'ARMENIA', 'ARMERO', 'BARBACOAS', 'BARICHARA', 'BARRANCABERMEJA', 'BARRANQUILLA', 'BELEN DE UMBRIA',
  'BOGOTA ZONA CENTRO', 'BOGOTA ZONA NORTE', 'BOGOTA ZONA SUR', 'BOLIVAR (ANTIOQUIA)', 'BOLIVAR (CAUCA)', 'BUCARAMANGA',
  'BUENAVENTURA', 'BUGA', 'CACHIRA', 'CAJAMARCA', 'CALARCA', 'CALI', 'CALOTO', 'CAQUEZA', 'CARTAGENA', 'CARTAGO',
  'CAUCASIA', 'CERETE', 'CHAPARRAL', 'CHARALA', 'CHIMICHAGUA', 'CHINACOTA', 'CHINU', 'CHIQUINQUIRA', 'CHOCONTA', 'CIENAGA',
  'CONCEPCION', 'CONTRATACION', 'CONVENCION', 'COROZAL', 'CUCUTA', 'DABEIBA', 'DOSQUEBRADAS', 'DUITAMA', 'EL BANCO',
  'EL CARMEN DE BOLIVAR', 'EL COCUY', 'ESPINAL', 'FACATATIVA', 'FILANDIA', 'FLORENCIA', 'FREDONIA', 'FRESNO', 'FRONTINO',
  'FUNDACION', 'FUSAGASUGA', 'GACHETA', 'GARAGOA', 'GARZON', 'GIRARDOT', 'GIRARDOTA', 'GUADUAS', 'GUAMO', 'GUAPI',
  'GUATEQUE', 'HONDA', 'IBAGUE', 'INIRIDA', 'IPIALES', 'ISTMINA', 'ITUANGO', 'JERICO', 'LA CEJA', 'LA CRUZ', 'LA DORADA',
  'LA MESA', 'LA PALMA', 'LA PLATA', 'LA UNION', 'LETICIA', 'LIBANO', 'LORICA', 'MAGANGUE', 'MAICAO', 'MALAGA', 'MANIZALES',
  'MANZANARES', 'MARINILLA', 'MEDELLIN NORTE', 'MEDELLIN SUR', 'MELGAR', 'MIRAFLORES', 'MITÚ', 'MOCOA', 'MOMPOS',
  'MONIQUIRA', 'MONTELIBANO', 'MONTERIA', 'NEIRA', 'NEIVA', 'NUQUI', 'OCAÑA', 'OROCUE', 'PACHO', 'PACORA', 'PALMIRA',
  'PAMPLONA', 'PASTO', 'PATIA', 'PAZ DE ARIPORO', 'PENSILVANIA', 'PEREIRA', 'PIEDECUESTA', 'PITALITO', 'PLATO', 'POPAYAN',
  'PUENTE NACIONAL', 'PUERTO ASIS', 'PUERTO BERRIO', 'PUERTO BOYACA', 'PUERTO CARREÑO', 'PUERTO LOPEZ', 'PUERTO TEJADA',
  'PURIFICACION', 'QUIBDO', 'RAMIRIQUI', 'RIOHACHA', 'RIONEGRO', 'RIOSUCIO', 'ROLDANILLO', 'SABANALARGA', 'SAHAGUN',
  'SALAMINA', 'SALAZAR', 'SAMANIEGO', 'SAN ANDRES (Isla)', 'SAN ANDRES (STDR)', 'SAN GIL', 'SAN JOSE DEL GUAVIAR',
  'SAN JUAN DEL CESAR', 'SAN MARCOS', 'SAN MARTIN', 'SAN VICENTE DE CHUCURI', 'SAN VICENTE DEL CAGUAN', 'SANTA BARBARA',
  'SANTA FE DE ANTIOQUIA', 'SANTA MARTA', 'SANTA ROSA DE CABAL', 'SANTA ROSA DE OSOS', 'SANTA ROSA DE VITERBO',
  'SANTANDER DE QUILICHAO', 'SANTO DOMINGO', 'SANTUARIO', 'SEGOVIA', 'SEVILLA', 'SIBUNDOY', 'SILVIA', 'SIMITI', 'SINCE',
  'SINCELEJO', 'SITIONUEVO', 'SOACHA', 'SOATA', 'SOCHA', 'SOCORRO', 'SOGAMOSO', 'SOLEDAD', 'SONSON', 'SOPETRAN',
  'TAMESIS', 'TITIRIBI', 'TULUA', 'TUMACO', 'TUNJA', 'TUQUERRES', 'TURBO', 'UBATE', 'URRAO', 'VALLEDUPAR', 'VELEZ',
  'VILLAVICENCIO', 'YARUMAL', 'YOLOMBO', 'YOPAL', 'ZAPATOCA', 'ZIPAQUIRA',
];

// Código (índice ORIP) de cada oficina = prefijo de la matrícula (ej. 040-95200 → BARRANQUILLA).
// Capturado del portal SNR (recon/capture-oficina-codes.mjs). Se muestra en el selector.
export const OFICINA_CODES: Record<string, string> = {
  'ABEJORRAL': '002', 'ACACIAS': '232', 'AGUA DE DIOS': '150', 'AGUACHICA': '196', 'AGUADAS': '102',
  'AMALFI': '003', 'AMBALEMA': '351', 'ANDES': '004', 'ANSERMA': '103', 'APARTADO': '008', 'APIA': '292',
  'ARAUCA': '410', 'ARMENIA': '280', 'ARMERO': '352', 'BARBACOAS': '242', 'BARICHARA': '302',
  'BARRANCABERMEJA': '303', 'BARRANQUILLA': '040', 'BELEN DE UMBRIA': '293', 'BOGOTA ZONA CENTRO': '50C',
  'BOGOTA ZONA NORTE': '50N', 'BOGOTA ZONA SUR': '50S', 'BOLIVAR (ANTIOQUIA)': '005', 'BOLIVAR (CAUCA)': '122',
  'BUCARAMANGA': '300', 'BUENAVENTURA': '372', 'BUGA': '373', 'CACHIRA': '261', 'CAJAMARCA': '354',
  'CALARCA': '282', 'CALI': '370', 'CALOTO': '124', 'CAQUEZA': '152', 'CARTAGENA': '060', 'CARTAGO': '375',
  'CAUCASIA': '015', 'CERETE': '143', 'CHAPARRAL': '355', 'CHARALA': '306', 'CHIMICHAGUA': '192',
  'CHINACOTA': '264', 'CHINU': '144', 'CHIQUINQUIRA': '072', 'CHOCONTA': '154', 'CIENAGA': '222',
  'CONCEPCION': '308', 'CONTRATACION': '161', 'CONVENCION': '266', 'COROZAL': '342', 'CUCUTA': '260',
  'DABEIBA': '007', 'DOSQUEBRADAS': '294', 'DUITAMA': '074', 'EL BANCO': '224', 'EL CARMEN DE BOLIVAR': '062',
  'EL COCUY': '076', 'ESPINAL': '357', 'FACATATIVA': '156', 'FILANDIA': '284', 'FLORENCIA': '420',
  'FREDONIA': '010', 'FRESNO': '359', 'FRONTINO': '011', 'FUNDACION': '225', 'FUSAGASUGA': '157',
  'GACHETA': '160', 'GARAGOA': '078', 'GARZON': '202', 'GIRARDOT': '307', 'GIRARDOTA': '012',
  'GUADUAS': '162', 'GUAMO': '360', 'GUAPI': '126', 'GUATEQUE': '079', 'HONDA': '362', 'IBAGUE': '350',
  'INIRIDA': '500', 'IPIALES': '244', 'ISTMINA': '184', 'ITUANGO': '013', 'JERICO': '014', 'LA CEJA': '017',
  'LA CRUZ': '246', 'LA DORADA': '106', 'LA MESA': '166', 'LA PALMA': '167', 'LA PLATA': '204',
  'LA UNION': '248', 'LETICIA': '400', 'LIBANO': '364', 'LORICA': '146', 'MAGANGUE': '064', 'MAICAO': '212',
  'MALAGA': '312', 'MANIZALES': '100', 'MANZANARES': '108', 'MARINILLA': '018', 'MEDELLIN NORTE': '01N',
  'MEDELLIN SUR': '001', 'MELGAR': '366', 'MIRAFLORES': '082', 'MITÚ': '520', 'MOCOA': '440', 'MOMPOS': '065',
  'MONIQUIRA': '083', 'MONTELIBANO': '142', 'MONTERIA': '140', 'NEIRA': '110', 'NEIVA': '200', 'NUQUI': '186',
  'OCAÑA': '270', 'OROCUE': '086', 'PACHO': '170', 'PACORA': '112', 'PALMIRA': '378', 'PAMPLONA': '272',
  'PASTO': '240', 'PATIA': '128', 'PAZ DE ARIPORO': '475', 'PENSILVANIA': '114', 'PEREIRA': '290',
  'PIEDECUESTA': '314', 'PITALITO': '206', 'PLATO': '226', 'POPAYAN': '120', 'PUENTE NACIONAL': '315',
  'PUERTO ASIS': '442', 'PUERTO BERRIO': '019', 'PUERTO BOYACA': '088', 'PUERTO CARREÑO': '540',
  'PUERTO LOPEZ': '234', 'PUERTO TEJADA': '130', 'PURIFICACION': '368', 'QUIBDO': '180', 'RAMIRIQUI': '090',
  'RIOHACHA': '210', 'RIONEGRO': '020', 'RIOSUCIO': '115', 'ROLDANILLO': '380', 'SABANALARGA': '045',
  'SAHAGUN': '148', 'SALAMINA': '118', 'SALAZAR': '276', 'SAMANIEGO': '250', 'SAN ANDRES (Isla)': '450',
  'SAN ANDRES (STDR)': '318', 'SAN GIL': '319', 'SAN JOSE DEL GUAVIAR': '480', 'SAN JUAN DEL CESAR': '214',
  'SAN MARCOS': '346', 'SAN MARTIN': '236', 'SAN VICENTE DE CHUCURI': '320', 'SAN VICENTE DEL CAGUAN': '425',
  'SANTA BARBARA': '023', 'SANTA FE DE ANTIOQUIA': '024', 'SANTA MARTA': '080', 'SANTA ROSA DE CABAL': '296',
  'SANTA ROSA DE OSOS': '025', 'SANTA ROSA DE VITERBO': '092', 'SANTANDER DE QUILICHAO': '132',
  'SANTO DOMINGO': '026', 'SANTUARIO': '297', 'SEGOVIA': '027', 'SEVILLA': '382', 'SIBUNDOY': '441',
  'SILVIA': '134', 'SIMITI': '068', 'SINCE': '347', 'SINCELEJO': '340', 'SITIONUEVO': '228', 'SOACHA': '051',
  'SOATA': '093', 'SOCHA': '094', 'SOCORRO': '321', 'SOGAMOSO': '095', 'SOLEDAD': '041', 'SONSON': '028',
  'SOPETRAN': '029', 'TAMESIS': '032', 'TITIRIBI': '033', 'TULUA': '384', 'TUMACO': '252', 'TUNJA': '070',
  'TUQUERRES': '254', 'TURBO': '034', 'UBATE': '172', 'URRAO': '035', 'VALLEDUPAR': '190', 'VELEZ': '324',
  'VILLAVICENCIO': '230', 'YARUMAL': '037', 'YOLOMBO': '038', 'YOPAL': '470', 'ZAPATOCA': '326', 'ZIPAQUIRA': '176',
};

export function oficinaCode(name: string): string {
  return OFICINA_CODES[name] || '';
}

const SET = new Set(OFICINAS);
export function isOficina(v: unknown): v is string {
  return typeof v === 'string' && SET.has(v);
}

const plano = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z0-9 ()]/g, ' ').replace(/\s+/g, ' ').trim();

// La oficina tal como la escribe una persona por WhatsApp ("medellin sur", "Bogotá norte", "cali"):
// una sola coincidencia → esa; varias ("medellin", "bogota") → se le pregunta cuál; ninguna → null.
export function buscarOficina(texto: string): { oficina: string } | { opciones: string[] } | null {
  const t = plano(String(texto ?? ''));
  if (t.length < 3) return null;
  const exacta = OFICINAS.find((o) => plano(o) === t);
  if (exacta) return { oficina: exacta };
  const palabras = t.split(' ');
  const candidatas = OFICINAS.filter((o) => { const p = plano(o); return palabras.every((w) => p.includes(w)); });
  if (candidatas.length === 1) return { oficina: candidatas[0] };
  if (candidatas.length > 1 && candidatas.length <= 6) return { opciones: candidatas };
  return null;
}
