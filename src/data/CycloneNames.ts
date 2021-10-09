import {PAGASADocument} from "../scraper/PagasaScraper";

export function findCycloneNumber(name: string) : [number, number] {
    const toFind = name.toLowerCase();

    for (const [year, set] of Object.entries(CycloneNames)) {
        for (let id = 0; id < set.length; id++) {
            const name = set[id];
            if (name.toLowerCase() === toFind)  {
                return [+year, id + 1];
            }
        }
    }

    return [+(new Date().getFullYear()), 0];
}

export function buildCode(document: PAGASADocument, advisory = false) {
    const [year, cycloneNumber] = findCycloneNumber(document.name);
    return `PAGASA_${
        year.toString().substr(2)
    }-TC${
        cycloneNumber < 10 ? `0${cycloneNumber}` : cycloneNumber
    }_${
        document.name[0].toUpperCase() + document.name.substr(1).toLowerCase()
    }_TC${
        advisory ? "A" : "B"
    }#${
        document.count < 10 ? `0${document.count}` : document.count
    }${
        document.final ? "-FINAL" : ""
    }`
}

// noinspection SpellCheckingInspection
export const CycloneNames = {
    2021: [
        "Auring",
        "Bising",
        "Crising",
        "Dante",
        "Emong",
        "Fabian",
        "Gorio",
        "Huaning",
        "Isang",
        "Jolina",
        "Kiko",
        "Lannie",
        "Maring",
        "Nando",
        "Odette",
        "Paolo",
        "Quedan",
        "Ramil",
        "Salome",
        "Tino",
        "Uwan",
        "Verbena",
        "Wilma",
        "Yasmin",
        "Zoraida",
        "Alamid",
        "Bruno",
        "Conching",
        "Dolor",
        "Ernie",
        "Florante",
        "Gerardo",
        "Hernan",
        "Isko",
        "Jerome"
    ],
    2022: [
        "Agaton",
        "Basyang",
        "Caloy",
        "Domeng",
        "Ester",
        "Florita",
        "Gardo",
        "Henry",
        "Inday",
        "Josie",
        "Karding",
        "Luis",
        "Maymay",
        "Neneng",
        "Obet",
        "Paeng",
        "Queenie",
        "Rosal",
        "Samuel",
        "Tomas",
        "Umberto",
        "Venus",
        "Waldo",
        "Yayang",
        "Zeny",
        "Agila",
        "Bagwis",
        "Chito",
        "Diego",
        "Elena",
        "Felino",
        "Gunding",
        "Harriet",
        "Indang",
        "Jessa"
    ],
    2023: [
        "Amang",
        "Betty",
        "Chedeng",
        "Dodong",
        "Egay",
        "Falcon",
        "Goring",
        "Hanna",
        "Ineng",
        "Jenny",
        "Kabayan",
        "Liwayway",
        "Marilyn",
        "Nimfa",
        "Onyok",
        "Perla",
        "Quiel",
        "Ramon",
        "Sarah",
        "Tamaraw",
        "Ugong",
        "Viring",
        "Weng",
        "Yoyoy",
        "Zigzag",
        "Abe",
        "Berto",
        "Charo",
        "Dado",
        "Estoy",
        "Felion",
        "Gening",
        "Herman",
        "Irma",
        "Jaime"
    ],
    2024: [
        "Aghon",
        "Butchoy",
        "Carina",
        "Dindo",
        "Enteng",
        "Ferdie",
        "Gener",
        "Helen",
        "Igme",
        "Julian",
        "Kristine",
        "Leon",
        "Marce",
        "Nika",
        "Ofel",
        "Pepito",
        "Querubin",
        "Romina",
        "Siony",
        "Tonyo",
        "Upang",
        "Vicky",
        "Warren",
        "Yoyong",
        "Zosimo",
        "Alakdan",
        "Baldo",
        "Clara",
        "Dencio",
        "Estong",
        "Felipe",
        "Gomer",
        "Heling",
        "Ismael",
        "Julio"
    ]
};
