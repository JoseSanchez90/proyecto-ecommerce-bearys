// Fuente: INEI, Directorio Nacional de Municipalidades Provinciales y Distritales, julio de 2026.
export interface ProvinceLocation {
  name: string;
  districts: readonly string[];
}

export interface DepartmentLocation {
  name: string;
  provinces: readonly ProvinceLocation[];
}

export const DELIVERY_LOCATIONS = [
  {
    "name": "Lima",
    "provinces": [
      {
        "name": "Lima",
        "districts": [
          "Lima",
          "Ancón",
          "Ate",
          "Barranco",
          "Breña",
          "Carabayllo",
          "Chaclacayo",
          "Chorrillos",
          "Cieneguilla",
          "Comas",
          "El Agustino",
          "Independencia",
          "Jesús María",
          "La Molina",
          "La Victoria",
          "Lince",
          "Los Olivos",
          "Lurigancho",
          "Lurín",
          "Magdalena Del Mar",
          "Pueblo Libre",
          "Miraflores",
          "Pachacámac",
          "Pucusana",
          "Puente Piedra",
          "Punta Hermosa",
          "Punta Negra",
          "Rímac",
          "San Bartolo",
          "San Borja",
          "San Isidro",
          "San Juan de Lurigancho",
          "San Juan de Miraflores",
          "San Luis",
          "San Martin de Porres",
          "San Miguel",
          "Santa Anita",
          "Santa María del Mar",
          "Santa Rosa",
          "Santiago de Surco",
          "Surquillo",
          "Villa El Salvador",
          "Villa María Del Triunfo"
        ]
      },
      {
        "name": "Barranca",
        "districts": [
          "Barranca",
          "Paramonga",
          "Pativilca",
          "Supe",
          "Supe Puerto"
        ]
      },
      {
        "name": "Cajatambo",
        "districts": [
          "Cajatambo",
          "Copa",
          "Gorgor",
          "Huancapón",
          "Manas"
        ]
      },
      {
        "name": "Canta",
        "districts": [
          "Canta",
          "Arahuay",
          "Huamantanga ",
          "Huaros",
          "Lachaqui",
          "San Buenaventura",
          "Santa Rosa de Quives"
        ]
      },
      {
        "name": "Cañete",
        "districts": [
          "San Vicente de Cañete",
          "Asia",
          "Calango",
          "Cerro Azul",
          "Chilca",
          "Coayllo",
          "Imperial",
          "Lunahuana",
          "Mala",
          "Nuevo Imperial",
          "Pacarán",
          "Quilmana",
          "San Antonio",
          "San Luis",
          "Santa Cruz de Flores",
          "Zuñiga"
        ]
      },
      {
        "name": "Huaral",
        "districts": [
          "Huaral",
          "Atavillos Alto",
          "Atavillos Bajo",
          "Aucallama",
          "Chancay",
          "Ihuari",
          "Lampián",
          "Pacaraos",
          "San Miguel de Acos",
          "Santa Cruz de Andamarca",
          "Sumbilca",
          "Veintisiete de Noviembre"
        ]
      },
      {
        "name": "Huarochirí",
        "districts": [
          "Matucana",
          "Antioquía",
          "Callahuanca",
          "Carampoma",
          "Chicla",
          "Cuenca",
          "Huachupampa",
          "Huanza",
          "Huarochirí",
          "Lahuaytambo",
          "Langa",
          "San Pedro de Laraos",
          "Mariatana",
          "Ricardo Palma",
          "San Andrés de Tupicocha",
          "San Antonio",
          "San Bartolomé",
          "San Damian",
          "San Juan de Iris",
          "San Juan de Tantaranche",
          "San Lorenzo de Quinti",
          "San Mateo",
          "San Mateo de Otao",
          "San Pedro de Casta",
          "San Pedro de Huancayre",
          "Sangallaya",
          "Santa Cruz de Cocachacra",
          "Santa Eulalia",
          "Santiago de Anchucaya",
          "Santiago de Tuna",
          "Santo Domingo de Los Olleros",
          "Surco"
        ]
      },
      {
        "name": "Huaura",
        "districts": [
          "Huacho",
          "Ambar",
          "Caleta de Carquín",
          "Checras",
          "Hualmay",
          "Huaura",
          "Leoncio Prado",
          "Paccho",
          "Santa Leonor",
          "Santa María",
          "Sayán",
          "Vegueta"
        ]
      },
      {
        "name": "Oyón",
        "districts": [
          "Oyón",
          "Andajes",
          "Caujul",
          "Cochamarca",
          "Naván",
          "Pachangara"
        ]
      },
      {
        "name": "Yauyos",
        "districts": [
          "Yauyos",
          "Alis",
          "Allauca",
          "Ayaviri",
          "Azángaro",
          "Cacra",
          "Carania",
          "Catahuasi",
          "Chocos",
          "Cochas",
          "Colonia",
          "Hongos",
          "Huampara",
          "Huancaya",
          "Huangascar",
          "Huantan",
          "Huañec",
          "Laraos",
          "Lincha",
          "Madean",
          "Miraflores",
          "Omas",
          "Putinza",
          "Quinches",
          "Quinocay",
          "San Joaquín",
          "San Pedro de Pilas",
          "Tanta",
          "Tauripampa",
          "Tomás",
          "Tupe",
          "Viñac",
          "Vitis"
        ]
      }
    ]
  },
  {
    "name": "Callao",
    "provinces": [
      {
        "name": "Callao",
        "districts": [
          "Callao",
          "Bellavista",
          "Carmen de La Legua Reynoso",
          "La Perla",
          "La Punta",
          "Ventanilla",
          "Mi Perú"
        ]
      }
    ]
  },
  {
    "name": "Áncash",
    "provinces": [
      {
        "name": "Huaraz",
        "districts": [
          "Huaraz",
          "Cochabamba",
          "Colcabamba",
          "Huanchay",
          "Independencia",
          "Jangas",
          "La Libertad",
          "Olleros",
          "Pampas Grande",
          "Pariacoto",
          "Pira",
          "Tarica"
        ]
      },
      {
        "name": "Aija",
        "districts": [
          "Aija",
          "Coris",
          "Huacllán",
          "La Merced",
          "Succha"
        ]
      },
      {
        "name": "Antonio Raymondi",
        "districts": [
          "Llamellín",
          "Aczo",
          "Chaccho",
          "Chingas",
          "Mirgas",
          "San Juan de Rontoy"
        ]
      },
      {
        "name": "Asunción",
        "districts": [
          "Chacas",
          "Acochaca"
        ]
      },
      {
        "name": "Bolognesi",
        "districts": [
          "Chiquián",
          "Abelardo Pardo Lezameta",
          "Antonio Raymondi",
          "Aquia",
          "Cajacay",
          "Canis ",
          "Colquioc",
          "Huallanca",
          "Huasta",
          "Huayllacayán",
          "La Primavera",
          "Mangas",
          "Pacllón",
          "San Miguel de Corpanqui",
          "Ticllos"
        ]
      },
      {
        "name": "Carhuaz",
        "districts": [
          "Carhuaz",
          "Acopampa",
          "Amashca",
          "Anta",
          "Ataquero",
          "Marcará",
          "Pariahuanca",
          "San Miguel de Aco",
          "Shilla",
          "Tinco",
          "Yungar"
        ]
      },
      {
        "name": "Carlos Fermin Fitzcarrald",
        "districts": [
          "San Luis",
          "San Nicolás",
          "Yauya"
        ]
      },
      {
        "name": "Casma",
        "districts": [
          "Casma",
          "Buena Vista Alta",
          "Comandante Noél",
          "Yaután"
        ]
      },
      {
        "name": "Corongo",
        "districts": [
          "Corongo",
          "Aco ",
          "Bambas",
          "Cusca",
          "La Pampa",
          "Yánac",
          "Yupán"
        ]
      },
      {
        "name": "Huari",
        "districts": [
          "Huari",
          "Anra",
          "Cajay",
          "Chavín de Huántar",
          "Huacachi",
          "Huacchis",
          "Huachis",
          "Huántar",
          "Masín",
          "Paucas",
          "Ponto",
          "Rahuapampa",
          "Rapayan",
          "San Marcos",
          "San Pedro de Chana",
          "Uco"
        ]
      },
      {
        "name": "Huarmey",
        "districts": [
          "Huarmey",
          "Cochapeti",
          "Culebras",
          "Huayán",
          "Malvas"
        ]
      },
      {
        "name": "Huaylas",
        "districts": [
          "Caraz",
          "Huallanca",
          "Huata",
          "Huaylas",
          "Mato",
          "Pamparomás",
          "Pueblo Libre",
          "Santa Cruz",
          "Santo Toribio",
          "Yuracmarca"
        ]
      },
      {
        "name": "Mariscal Luzuriaga",
        "districts": [
          "Piscobamba",
          "Casca",
          "Eleazar Guzmán Barrón",
          "Fidel Olivas Escudero",
          "Llama",
          "Llumpa",
          "Lucma",
          "Musga"
        ]
      },
      {
        "name": "Ocros",
        "districts": [
          "Ocros",
          "Acas",
          "Cajamarquilla",
          "Carhuapampa",
          "Cochas",
          "Congas",
          "Llipa",
          "San Cristóbal de Raján",
          "San Pedro",
          "Santiago de Chilcas"
        ]
      },
      {
        "name": "Pallasca",
        "districts": [
          "Cabana",
          "Bolognesi",
          "Conchucos",
          "Huacaschuque",
          "Huandoval",
          "Lacabamba",
          "Llapo",
          "Pallasca",
          "Pampas",
          "Santa Rosa",
          "Tauca"
        ]
      },
      {
        "name": "Pomabamba",
        "districts": [
          "Pomabamba",
          "Huayllán",
          "Parobamba",
          "Quinuabamba"
        ]
      },
      {
        "name": "Recuay",
        "districts": [
          "Recuay",
          "Cátac",
          "Cotaparaco",
          "Huayllapampa",
          "Llacllin",
          "Marca",
          "Pampas Chico",
          "Pararín",
          "Tapacocha",
          "Ticapampa"
        ]
      },
      {
        "name": "Santa",
        "districts": [
          "Chimbote",
          "Cáceres del Perú",
          "Coishco",
          "Macate",
          "Moro",
          "Nepeña",
          "Samanco",
          "Santa",
          "Nuevo Chimbote"
        ]
      },
      {
        "name": "Sihuas",
        "districts": [
          "Sihuas",
          "Acobamba",
          "Alfonso Ugarte",
          "Cashapampa",
          "Chingalpo",
          "Huayllabamba",
          "Quiches",
          "Ragash",
          "San Juan",
          "Sicsibamba"
        ]
      },
      {
        "name": "Yungay",
        "districts": [
          "Yungay",
          "Cascapara",
          "Mancos",
          "Matacoto",
          "Quillo",
          "Ranrahirca",
          "Shupluy",
          "Yanama"
        ]
      }
    ]
  },
  {
    "name": "Ica",
    "provinces": [
      {
        "name": "Ica",
        "districts": [
          "Ica",
          "La Tinguiña",
          "Los Aquijes",
          "Ocucaje",
          "Pachacútec",
          "Parcona",
          "Pueblo Nuevo",
          "Salas",
          "San José de Los Molinos",
          "San Juan Bautista",
          "Santiago",
          "Subtanjalla",
          "Tate",
          "Yauca Del Rosario"
        ]
      },
      {
        "name": "Chincha",
        "districts": [
          "Chincha Alta",
          "Alto Laran",
          "Chavín",
          "Chincha Baja",
          "El Carmen",
          "Grocio Prado",
          "Pueblo Nuevo",
          "San Juan de Yánac",
          "San Pedro de Huacarpana",
          "Sunampe",
          "Tambo de Mora"
        ]
      },
      {
        "name": "Nasca",
        "districts": [
          "Nasca",
          "Changuillo",
          "El Ingenio",
          "Marcona",
          "Vista Alegre"
        ]
      },
      {
        "name": "Palpa",
        "districts": [
          "Palpa",
          "Llipata",
          "Río Grande",
          "Santa Cruz",
          "Tibillo"
        ]
      },
      {
        "name": "Pisco",
        "districts": [
          "Pisco",
          "Huancano",
          "Humay",
          "Independencia",
          "Paracas",
          "San Andrés",
          "San Clemente",
          "Túpac Amaru Inca"
        ]
      }
    ]
  },
  {
    "name": "Junín",
    "provinces": [
      {
        "name": "Huancayo",
        "districts": [
          "Huancayo",
          "Carhuacallanga",
          "Chacapampa",
          "Chicche",
          "Chilca",
          "Chongos Alto",
          "Chupuro",
          "Colca",
          "Cullhuas",
          "El Tambo",
          "Huacrapuquio",
          "Hualhuas",
          "Huancán",
          "Huasicancha",
          "Huayucachi",
          "Ingenio",
          "Pariahuanca",
          "Pilcomayo",
          "Pucará",
          "Quichuay",
          "Quilcas",
          "San Agustín",
          "San Jerónimo de Tunán",
          "Saño",
          "Sapallanga",
          "Sicaya",
          "Santo Domingo de Acobamba",
          "Viques"
        ]
      },
      {
        "name": "Concepción",
        "districts": [
          "Concepción",
          "Aco",
          "Andamarca",
          "Chambará",
          "Cochas",
          "Comas",
          "Heroínas Toledo",
          "Manzanares",
          "Mariscal Castilla",
          "Matahuasi",
          "Mito",
          "Nueve de Julio",
          "Orcotuna",
          "San José de Quero",
          "Santa Rosa de Ocopa"
        ]
      },
      {
        "name": "Chanchamayo",
        "districts": [
          "Chanchamayo",
          "Perené",
          "Pichanaqui",
          "San Luis de Shuaro",
          "San Ramón",
          "Vitoc"
        ]
      },
      {
        "name": "Jauja",
        "districts": [
          "Jauja",
          "Acolla",
          "Apata",
          "Ataura",
          "Canchayllo",
          "Curicaca",
          "El Mantaro",
          "Huamalí",
          "Huaripampa",
          "Huertas",
          "Janjaillo",
          "Julcán",
          "Leonor Ordóñez",
          "Llocllapampa",
          "Marco",
          "Masma",
          "Masma Chicche",
          "Molinos",
          "Monobamba",
          "Muqui",
          "Muquiyauyo",
          "Paca",
          "Paccha",
          "Pancán",
          "Parco",
          "Pomacancha",
          "Ricrán",
          "San Lorenzo",
          "San Pedro de Chunán",
          "Sausa",
          "Sincos",
          "Tunan Marca",
          "Yauli",
          "Yauyos"
        ]
      },
      {
        "name": "Junín",
        "districts": [
          "Junín",
          "Carhuamayo",
          "Ondores",
          "Ulcumayo"
        ]
      },
      {
        "name": "Satipo",
        "districts": [
          "Satipo",
          "Coviriali",
          "Llaylla",
          "Mazamari",
          "Pampa Hermosa",
          "Pangoa",
          "Río Negro",
          "Río Tambo",
          "Vizcatán del Ene"
        ]
      },
      {
        "name": "Tarma",
        "districts": [
          "Tarma",
          "Acobamba",
          "Huaricolca",
          "Huasahuasi",
          "La Unión",
          "Palca",
          "Palcamayo",
          "San Pedro de Cajas",
          "Tapo"
        ]
      },
      {
        "name": "Yauli",
        "districts": [
          "La Oroya",
          "Chacapalpa",
          "Huay-Huay",
          "Marcapomacocha",
          "Morococha",
          "Paccha",
          "Santa Bárbara de Carhuacayán",
          "Santa Rosa de Sacco",
          "Suitucancha",
          "Yauli"
        ]
      },
      {
        "name": "Chupaca",
        "districts": [
          "Chupaca",
          "Ahuac",
          "Chongos Bajo",
          "Huáchac",
          "Huamancaca Chico",
          "San Juan de Iscos",
          "San Juan de Jarpa",
          "Tres de Diciembre",
          "Yanacancha"
        ]
      }
    ]
  },
  {
    "name": "Pasco",
    "provinces": [
      {
        "name": "Pasco",
        "districts": [
          "Chaupimarca",
          "Huachón",
          "Huariaca",
          "Huayllay",
          "Ninacaca",
          "Pallanchacra",
          "Paucartambo",
          "San Francisco de Asís de Yarusyacán",
          "Simón Bolívar",
          "Ticlacayan",
          "Tinyahuarco",
          "Vicco",
          "Yanacancha"
        ]
      },
      {
        "name": "Daniel Alcides Carrión",
        "districts": [
          "Yanahuanca",
          "Chacayan",
          "Goyllarisquizga",
          "Paucar",
          "San Pedro de Pillao",
          "Santa Ana de Tusi",
          "Tapuc",
          "Vilcabamba"
        ]
      },
      {
        "name": "Oxapampa",
        "districts": [
          "Oxapampa",
          "Chontabamba",
          "Huancabamba",
          "Palcazu",
          "Pozuzo",
          "Puerto Bermúdez",
          "Villa Rica",
          "Constitución"
        ]
      }
    ]
  }
] as const satisfies readonly DepartmentLocation[];

export const PERU_DEPARTMENTS = DELIVERY_LOCATIONS.map(
  (department) => department.name,
);

export const SHIPPING_COST_OUTSIDE_LIMA = 25;

export function getProvinces(departmentName: string) {
  return (
    DELIVERY_LOCATIONS.find(
      (department) => department.name === departmentName,
    )?.provinces ?? []
  );
}

export function getDistricts(
  departmentName: string,
  provinceName: string,
) {
  return (
    getProvinces(departmentName).find(
      (province) => province.name === provinceName,
    )?.districts ?? []
  );
}

export function getShippingCost(department: string) {
  return department.trim().toLocaleLowerCase("es") === "lima"
    ? 0
    : SHIPPING_COST_OUTSIDE_LIMA;
}
