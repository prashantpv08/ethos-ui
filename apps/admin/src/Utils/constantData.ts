import Images from "./images";

export interface Navigation {
  name: string;
  path: Array<string>;
  icon: any;
  icon_active: any;
}
// export const s3Url = process.env.S3_URL || "";

export const navigation: Navigation[] = [
  {
    name: "Dashboard",
    path: ["/"],
    icon: Images.DASHBOARD,
    icon_active: Images.DASHBOARD_ACTIVE,
  },

  {
    name: "Organisation",
    path: ["/organisation", "/organisation-details"],
    icon: Images.PRODUCTION,
    icon_active: Images.PRODUCTION_ACTIVE,
  },

  {
    name: "Order Management",
    path: ["/orders"],
    icon: Images.ORDERS,
    icon_active: Images.ORDERS_ACTIVE,
  },
];

export const businessType = [
  "State-Owned Business",
  "Publicly-Listed Business",
  "Privately-Owned Business",
  "Charity",
  "Other",
];

export const max20CharsRegex = /^.{0,20}$/;
