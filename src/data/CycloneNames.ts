export function findCycloneNumber(name: string) : number {
    const toFind = name.toLowerCase();

    for (const set of CycloneNames) {
        for (let id = 0; id < set.length; id++) {
            const name = set[id];
            if (name.toLowerCase() === toFind)  {
                return id + 1;
            }
        }
    }

    return 0;
}

export function buildCode(name: string, bulletinNo: number, advisory = false) {
    const cycloneNumber = findCycloneNumber(name);
    return `PAGASA_${
        new Date().getFullYear().toString().substr(2)
    }-TC${
        cycloneNumber < 10 ? `0${cycloneNumber}` : cycloneNumber
    }_${
        name[0].toUpperCase() + name.slice(1).toLowerCase()
    }_TC${
        advisory ? "A" : "B"
    }#${
        bulletinNo < 10 ? `0${bulletinNo}` : bulletinNo
    }`
}

// noinspection SpellCheckingInspection
export const CycloneNames = [
    [
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
    [
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
    [
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
    [
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
];