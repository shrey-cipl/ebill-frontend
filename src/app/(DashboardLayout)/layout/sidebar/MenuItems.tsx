import {
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
} from "@tabler/icons-react"
import PageviewIcon from "@mui/icons-material/Pageview"
import EditNoteIcon from "@mui/icons-material/EditNote"
import { uniqueId } from "lodash"
import SummarizeIcon from "@mui/icons-material/Summarize"
import AddHomeWorkIcon from "@mui/icons-material/AddHomeWork"
import PendingActionsIcon from "@mui/icons-material/PendingActions"
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted"
import AssessmentIcon from "@mui/icons-material/Assessment"
import RotateLeftIcon from "@mui/icons-material/RotateLeft"
import EventNoteIcon from "@mui/icons-material/EventNote"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import EventIcon from "@mui/icons-material/Event"
import StarBorderPurple500Icon from "@mui/icons-material/StarBorderPurple500"
import GroupIcon from "@mui/icons-material/Group"
const Menuitems: any = {
  "Joint Secretary Admin": [
    {
      navlabel: true,
      subheader: "Home",
    },

    {
      id: uniqueId(),
      title: "Dashboard",
      icon: IconLayoutDashboard,
      href: "/",
      present: "no",
    },
    {
      id: uniqueId(),
      title: "Bills",
      icon: EditNoteIcon,
      href: "/Bills",
      present: "yes",
    },
    {
      id: uniqueId(),
      title: "Ex Chairman & Members",
      icon: StarBorderPurple500Icon,
      href: "/Formers",
      present: "yes",
    },
    {
      id: uniqueId(),
      title: "General Report",
      icon: EventNoteIcon,
      href: "/GeneralReport",
      present: "yes",
    },

    {
      id: uniqueId(),
      title: "Pendency  Report",
      icon: PendingActionsIcon,
      href: "/PendencyReport",
      present: "yes",
    },
    {
      id: uniqueId(),
      title: "Lists of All Bills",
      icon: FormatListBulletedIcon,
      href: "/ListOfAllBills",
      present: "no",
    },
    {
      id: uniqueId(),
      title: "Reset Bill Status",
      icon: RotateLeftIcon,
      href: "/ResetBillStatus",
      present: "no",
    },
    {
      id: uniqueId(),
      title: "Reports",
      icon: EditNoteIcon,
      href: "/Reports",
      present: "yes",
    },

    {
      id: uniqueId(),
      title: "Date Wise Report",
      icon: CalendarMonthIcon,
      href: "/DateWiseReport",
      present: "no",
    },
    {
      id: uniqueId(),
      title: "Montly Report",
      icon: EventIcon,
      href: "/MonthlyWiseReport",
      present: "no",
    },
    {
      id: uniqueId(),
      title: "Yearly Report",
      icon: AccessTimeIcon,
      href: "/YearlyWiseReport",
      present: "no",
    },
    {
      id: uniqueId(),
      title: "Users",
      icon: GroupIcon,
      href: "/Users",
      present: "yes",
    },
  ],
  "Asst. Section Officer Admin I": [
    {
      navlabel: true,
      subheader: "Home",
    },

    {
      id: uniqueId(),
      title: "Dashboard",
      icon: IconLayoutDashboard,
      href: "/",
      present: "no",
    },
    {
      id: uniqueId(),
      title: "Bills",
      icon: EditNoteIcon,
      href: "/Bills",
      present: "yes",
    },
    {
      id: uniqueId(),
      title: "Report",
      icon: PageviewIcon,
      href: "/Report",
      present: "no",
    },

    {
      id: uniqueId(),
      title: "Montly Report",
      icon: EventIcon,
      href: "/MonthlyWiseReport",
      present: "no",
    },
    {
      id: uniqueId(),
      title: "Yearly Report",
      icon: AccessTimeIcon,
      href: "/YearlyWiseReport",
      present: "no",
    },
  ],
  "Chairman Office": [
    {
      navlabel: true,
      subheader: "Home",
    },

    {
      id: uniqueId(),
      title: "Dashboard",
      icon: IconLayoutDashboard,
      href: "/",
      present: "no",
    },
    {
      id: uniqueId(),
      title: "Ex Chairman & Members",
      icon: StarBorderPurple500Icon,
      href: "/Formers",
      present: "yes",
    },
    {
      id: uniqueId(),
      title: "General Report",
      icon: EventNoteIcon,
      href: "/GeneralReport",
      present: "yes",
    },

    {
      id: uniqueId(),
      title: "Pendency Report",
      icon: PageviewIcon,
      href: "/PendencyReport",
      present: "yes",
    },
    {
      id: uniqueId(),
      title: "Lists of All Bills",
      icon: FormatListBulletedIcon,
      href: "/ListOfAllBills",
      present: "no",
    },
    {
      id: uniqueId(),
      title: "Reports",
      icon: EditNoteIcon,
      href: "/Reports",
      present: "yes",
    },

    {
      id: uniqueId(),
      title: "Date Wise Report",
      icon: CalendarMonthIcon,
      href: "/DateWiseReport",
      present: "no",
    },
    {
      id: uniqueId(),
      title: "Montly Report",
      icon: EventIcon,
      href: "/MonthlyWiseReport",
      present: "no",
    },
    {
      id: uniqueId(),
      title: "Yearly Report",
      icon: AccessTimeIcon,
      href: "/YearlyWiseReport",
      present: "no",
    },
  ],
  "System Admin": [
    {
      navlabel: true,
      subheader: "Home",
    },

    {
      id: uniqueId(),
      title: "Dashboard",
      icon: IconLayoutDashboard,
      href: "/",
      present: "no",
    },
    {
      id: uniqueId(),
      title: "Bills",
      icon: EditNoteIcon,
      href: "/Bills",
      present: "yes",
    },
    {
      id: uniqueId(),
      title: "Ex Chairman & Members",
      icon: StarBorderPurple500Icon,
      href: "/Formers",
      present: "yes",
    },

    {
      id: uniqueId(),
      title: "Users",
      icon: GroupIcon,
      href: "/Users",
      present: "yes",
    },

    {
      id: uniqueId(),
      title: "Date Wise Report",
      icon: CalendarMonthIcon,
      href: "/DateWiseReport",
      present: "no",
    },
    {
      id: uniqueId(),
      title: "Montly Report",
      icon: EventIcon,
      href: "/MonthlyWiseReport",
      present: "no",
    },
    {
      id: uniqueId(),
      title: "Yearly Report",
      icon: AccessTimeIcon,
      href: "/YearlyWiseReport",
      present: "no",
    },
  ],
  "Accounts I": [
    {
      navlabel: true,
      subheader: "Home",
    },

    {
      id: uniqueId(),
      title: "Dashboard",
      icon: IconLayoutDashboard,
      href: "/",
      present: "no",
    },
    {
      id: uniqueId(),
      title: "Reports",
      icon: EditNoteIcon,
      href: "/Reports",
      present: "yes",
    },
    {
      id: uniqueId(),
      title: "Date Wise Report",
      icon: CalendarMonthIcon,
      href: "/DateWiseReport",
      present: "no",
    },
    {
      id: uniqueId(),
      title: "Montly Report",
      icon: EventIcon,
      href: "/MonthlyWiseReport",
      present: "no",
    },
    {
      id: uniqueId(),
      title: "Yearly Report",
      icon: AssessmentIcon,
      href: "/YearlyWiseReport",
      present: "no",
    },
  ],
}

export default Menuitems
