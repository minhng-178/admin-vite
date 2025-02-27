import { Bot, SquareTerminal } from "lucide-react";

export const menu =  [
    {
      title: "App",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Analytics",
          url: "#",
        },
      ],
    },
    {
      title: "Management",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Users",
          url: "/users",
        },
        {
          title: "Services",
          url: "/services",
        },
        {
          title: "Transaction",
          url: "#",
        },
        {
          title: "Blogs",
          url: "/blogs",
        },
        {
          title: "Posts",
          url: "/posts",
        },
        {
          title: "Payment method",
          url: "#",
        },
        {
          title: "Work schedule",
          url: "/work-schedules",
        },
      ],
    },
  ]