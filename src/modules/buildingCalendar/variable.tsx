import ListView from "./components/ListView";
import MonthlyView from "./components/MonthlyView";
import dayjs from "dayjs";

import type { TabsProps } from "antd";

const tabItems: TabsProps["items"] = [
  {
    key: "1",
    label: `Monthly view`,
    children: <MonthlyView />,
  },
  {
    key: "2",
    label: `List view`,
    children: <ListView />,
  },
];

export { tabItems };
