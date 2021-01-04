export interface Option {
  id: number;
  name: string;
  imagePath: string;
}

const OPTIONS: Array<Option> = [
  {
    id: 0,
    name: "Space Marines",
    imagePath: "Aquila.jpg",
  },
  {
    id: 1,
    name: "Eldar",
    imagePath: "AsuryaniRune.jpg",
  },
  {
    id: 2,
    name: "Chaos Space Marines",
    imagePath: "Star_of_Chaos.jpg",
  },
  {
    id: 3,
    name: "Orks",
    imagePath: "Orks.jpg",
  },
  {
    id: 4,
    name: "Imperial Guard",
    imagePath: "Astra_Militarum_Icon.jpg",
  },
  {
    id: 5,
    name: "Tau",
    imagePath: "T'au_Empire_Icon.jpg",
  },
  {
    id: 6,
    name: "Necrons",
    imagePath: "Ankh_Triarch.jpg",
  },
  {
    id: 7,
    name: "Sisters of Battle",
    imagePath: "Adeptus_Sororitas_Icon.jpg",
  },
  {
    id: 8,
    name: "Dark Eldar",
    imagePath: "DrukhariRune.jpg",
  },
];

export default OPTIONS;
