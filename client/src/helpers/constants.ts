"use client";

// Components
import { HomeIcon, MarketPlace_icon } from "@/components/icons/iconPack";

// Icons pack
import {
  Claim_Icon,
  Ticket_icon,
  List_Icon,
} from "@/components/icons/iconPack";

export const PageNavigtionList = [
  { key: "/", title: "Home", icon: HomeIcon, permission: ["*"] },
  {
    key: "/insurance",
    title: "Insurance Claims",
    icon: Claim_Icon,
    permission: ["VEHICLE_OWNER", "INSURANCE"],
  },
  {
    key: "/tickets",
    title: "Traffic Tickets",
    icon: Ticket_icon,
    permission: ["VEHICLE_OWNER"],
  },
  {
    key: "/marketplace",
    title: "Market Place",
    icon: MarketPlace_icon,
    permission: ["VEHICLE_OWNER"],
  },
  {
    key: "/vehicles",
    title: "Vehicles List",
    icon: List_Icon,
    permission: ["LTA"],
  },
];

export const UserAccountTypes = {
  VEHICLE_OWNER: "Vehicle Owner",
  LTA: "Land and Transport Authority",
  INSURANCE: "Insurance",
  SPF: "Singapore Police Force",
};
