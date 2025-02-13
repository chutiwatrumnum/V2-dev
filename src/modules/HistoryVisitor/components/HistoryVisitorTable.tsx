import { Table} from "antd";
import type { ColumnsType, TablePaginationConfig, TableProps } from "antd/es/table";
import {
  HistoryVisitorDataType
} from "../../../stores/interfaces/historyVisitor";
interface NormalTableType {
  columns: ColumnsType<HistoryVisitorDataType>;
  data: HistoryVisitorDataType[];
  onchangeTable:TableProps<HistoryVisitorDataType>["onChange"];
  PaginationConfig:TablePaginationConfig;
  loading:boolean;
}

const HistoryVisitorTable = ({
  columns,
  data,
  PaginationConfig,
  loading
,onchangeTable}: NormalTableType) => {
  const scroll: { x?: number | string } = {
    x: "10vw",
  };
  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      scroll={scroll}
      onChange={onchangeTable}
     pagination={PaginationConfig}
    />
  );
};

export default HistoryVisitorTable;
