import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
import { whiteLabel } from "../../../configs/theme";

import { Row, Button, Col, Spin, Empty } from "antd";
import Header from "../../../components/common/Header";
import PeopleCountingEditModal from "../components/PeopleCountingEditModal";
import { EditIcon, PeopleStatusIcon } from "../../../assets/icons/Icons";
import ConfirmModal from "../../../components/common/ConfirmModal2";
import SuccessModal from "../../../components/common/SuccessModal2";
import FailedModal from "../../../components/common/FailedModal";

import {
  PeopleCountingDataType,
  PeopleCountingFormDataType,
} from "../../../stores/interfaces/PeopleCounting";

import "../styles/peopleCounting.css";

const PeopleCountingMain = () => {
  // variables
  const dispatch = useDispatch<Dispatch>();
  const data = useSelector(
    (state: RootState) => state.peopleCounting.peopleCountingData
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<PeopleCountingDataType>();
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);

  // functions
  const fetchData = async () => {
    setLoading(true);
    await dispatch.peopleCounting.getPeopleCountingData();
    setLoading(false);
  };

  const onEdit = (data: PeopleCountingDataType) => {
    setEditData(data);
    setIsEditModalOpen(true);
  };

  const onEditOk = async (payload: PeopleCountingFormDataType) => {
    ConfirmModal({
      title: "Are you sure you want to edit this?",
      okMessage: "Yes",
      cancelMessage: "Cancel",
      onOk: async () => {
        setLoading(true);
        const edit = await dispatch.peopleCounting.editPeopleCountingData(
          payload
        );
        if (edit) {
          SuccessModal("Successfully edited");
          setIsEditModalOpen(false);
          setRefresh(!refresh);
        } else {
          FailedModal("Failed to edit data");
        }
        setLoading(false);
      },
      onCancel: () => {
        console.log("cancelled");
      },
    });
  };

  const onEditCancel = () => {
    setIsEditModalOpen(false);
  };

  const statusColorSelector = (status: string) => {
    let statusColor = "#fff";
    switch (status) {
      case "low":
        statusColor = whiteLabel.successColor;
        break;

      case "medium":
        statusColor = whiteLabel.warningColor;
        break;

      case "high":
        statusColor = whiteLabel.dangerColor;
        break;

      default:
        break;
    }
    return statusColor;
  };

  const capitalizer = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // components
  const RoomCard = ({ data }: { data: PeopleCountingDataType }) => {
    return (
      <Col xs={24} sm={12} md={8} lg={8} xl={8} className="cardContainer_PPC">
        <div className="imageContainer_PPC">
          <img
            className="cardImage_PPC"
            src={data.facility.imageUrl}
            alt={data.facility.name}
            loading="lazy"
          />
        </div>
        <div className="cardDetailContainer_PPC">
          <Row
            justify="space-between"
            align="middle"
            className="cardDetailTop_PPC">
            <span className="cardTitle_PPC" title={data.facility.name}>
              {data.facility.name}
            </span>
            <Button
              type="text"
              icon={<EditIcon />}
              onClick={() => onEdit(data)}
              aria-label="Edit"
            />
          </Row>
          <Row
            justify="center"
            align="middle"
            className="cardStatusBoxContainer_PPC"
            style={{ backgroundColor: statusColorSelector(data.status) }}>
            <PeopleStatusIcon
              color={whiteLabel.whiteColor}
              className="cardStatusIcon_PPC"
            />
            <span className="cardStatusText_PPC">
              {capitalizer(data.status)}
            </span>
          </Row>
        </div>
      </Col>
    );
  };

  // actions
  useEffect(() => {
    fetchData();
  }, [refresh]);

  return (
    <>
      <Header title="People Counting" />
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin size="large" />
        </div>
      ) : data.length > 0 ? (
        <Row gutter={[16, 16]}>
          {data.map((item, index) => (
            <RoomCard key={item.id || index} data={item} />
          ))}
        </Row>
      ) : (
        <Empty
          description="No people counting data available"
          style={{ margin: "40px 0" }}
        />
      )}
      <PeopleCountingEditModal
        isEditModalOpen={isEditModalOpen}
        onOk={onEditOk}
        onCancel={onEditCancel}
        data={editData}
      />
    </>
  );
};

export default PeopleCountingMain;
