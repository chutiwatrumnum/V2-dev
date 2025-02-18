interface WhiteLabelType {
  buttonShape: "default" | "round";
  primaryColor: string;
  secondaryColor: string;
  loginColor: string;
  logoutColor: string;
  whiteColor: string;
  whiteTransColor: string;
  blackColor: string;
  grayColor: string;
  cardBGColor: string;
  grayTransColor: string;
  lightGrayColor: string;
  defaultIconColor: string;

  // Semantic Colors
  dangerColor: string;
  warningColor: string;
  successColor: string;

  // Text colors
  mainTextColor: string;
  menuTextColor: string;
  menuTextActiveColor: string;
  subMenuTextColor: string;
  subMenuTextActiveColor: string;
  successTextColor: string;
  dangerTextColor: string;

  // BG colors
  mainBgColor: string;
  menuBgColor: string;
  menuBgActiveColor: string;
  subMenuBgColor: string;
  subMenuBgActiveColor: string;

  // Button colors
  mainBtnColor: string;
  cancelBtnColor: string;
  mainBtnTextColor: string;
  cancelBtnTextColor: string;

  // Table Colors
  tableHeadBgColor: string;
  tableHeadTextColor: string;
  tableTextColor: string;
  subTableHeadBgColor: string;

  // Font weights
  normalWeight: number;
  boldWeight: number;
}

export const theme: object = {
  token: {
    colorPrimary: "#D6AA68",
    colorText: "#7B6038",
    colorInfo: "#7B6038",
    colorLink: "#7B6038",
    fontFamily: "Kanit",
  },
};

export const whiteLabel: WhiteLabelType = {
  buttonShape: "round",
  primaryColor: "#D6AA68",
  secondaryColor: "#000000",
  loginColor: "#413A39",
  logoutColor: "#221F20",
  whiteColor: "#F4F4F4",
  whiteTransColor: "rgba(255, 255, 255, 0.8)",
  blackColor: "#161616",
  grayColor: "#9F9C9B",
  cardBGColor: "#B2D5FF",
  grayTransColor: "#E0E1E3",
  lightGrayColor: "#f3f3f3",
  defaultIconColor: "#161616",

  // Semantic Colors
  dangerColor: "#AD1B20",
  warningColor: "#FAC63B",
  successColor: "#63A164",

  // Text colors
  mainTextColor: "#3F3F3F",
  dangerTextColor: "#AD1B20",
  successTextColor: "#D6AA68",
  menuTextColor: "#FFFFFF",
  menuTextActiveColor: "#D6AA68",
  subMenuTextColor: "#7B7B7B",
  subMenuTextActiveColor: "#D6AA68",

  // BG colors
  mainBgColor: "#D6AA68",
  menuBgColor: "#7B6038",
  menuBgActiveColor: "#5F2424",
  subMenuBgColor: "#FFFFFF",
  subMenuBgActiveColor: "#E4CFCF",

  // Button colors
  mainBtnColor: "#D6AA68",
  cancelBtnColor: "#9F9C9B",
  mainBtnTextColor: "#FFFFFF",
  cancelBtnTextColor: "#3F3F3F",

  // Table colors
  tableHeadBgColor: "#D6AA68",
  tableHeadTextColor: "#FFFFFF",
  subTableHeadBgColor: "#9F9C9B",
  tableTextColor:"#FFFFFF",

  // Font weights
  normalWeight: 400,
  boldWeight: 700,
};
