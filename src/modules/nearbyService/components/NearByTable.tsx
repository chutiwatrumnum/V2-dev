import { Table } from "antd";

import type { ColumnsType } from "antd/es/table";
import { DataNearByTableDataType } from "../../../stores/interfaces/NearBy";

interface NormalTableType {
  columns: ColumnsType<DataNearByTableDataType>;
  data: DataNearByTableDataType[];
}

const AnnounceTable = ({ columns, data }: NormalTableType) => {
  return (
    <Table
      style={{ whiteSpace: "nowrap" }}
      columns={columns}
      dataSource={data}
      scroll={{ x: "100%" }}
      pagination={false}
    />
  );
};

export default AnnounceTable;
