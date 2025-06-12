import { useState, useEffect } from "react";
import { Row, Col, Typography, Switch, Button } from "antd";
import Header from "../../../components/common/Header";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
import { whiteLabel } from "../../../configs/theme";
import {
  LimitPeopleIcon,
  MaxTimeIcon,
  EditIcon,
} from "../../../assets/icons/Icons";
import NoImg from "../../../assets/images/noImg.jpeg";
import ConfirmModal from "../../../components/common/ConfirmModalMenu";
import EditFacilityModal from "../components/EditFacilityModal";
import { ReservationListDataType } from "../../../stores/interfaces/Facilities";

import "../styles/ReserveFacility.css";

const { Title } = Typography;

const ReservedFacilities = () => {
  const dispatch = useDispatch<Dispatch>();
  const data = useSelector(
    (state: RootState) => state.facilities.reservationListData
  );
  const { accessibility } = useSelector((state: RootState) => state.common);
  const [refresh, setRefresh] = useState(true);
  const [editData, setEditData] = useState<ReservationListDataType>();
  const [editModalOpen, setEditModalOpen] = useState(false);

  // functions

  const fetchData = async () => {
    await dispatch.facilities.getReservationList();
  };

  const onSwitchChange = (checked: boolean, id: number) => {
    // console.log(`ID ${id} switch to ${checked}`);
    const payload = { id: id, lock: checked };
    ConfirmModal({
      title: `Are you sure you want to ${
        checked ? "lock" : "unlock"
      } this facility?`,
      okMessage: "Yes",
      cancelMessage: "Cancel",
      onOk: () => onLockOk(payload),
      onCancel: onLockCancel,
    });
  };

  const onLockOk = async (payload: { id: number; lock: boolean }) => {
    const result = await dispatch.facilities.updateLockStatus(payload);
    if (result) {
      dispatch.common.updateSuccessModalState({
        open: true,
        text: "Successfully change information",
      });
    }
    setRefresh(!refresh);
  };

  const onLockCancel = () => {
    console.log("cancel");
  };

  const onEdit = async (data: ReservationListDataType) => {
    // console.log(data);
    setEditData(data);
    setEditModalOpen(true);
  };

  const onEditSave = async (values: ReservationListDataType) => {
    const result = await dispatch.facilities.updateFacilities(values);
    dispatch.common.updateSuccessModalState({
      open: true,
      text: "Successfully change information",
    });
    if (result) {
    } else {
      dispatch.common.updateSuccessModalState({
        open: true,
        status: "error",
        text: "Something went wrong",
      });
    }
    refreshHandler();
  };

  const onEditCancel = () => {
    setEditModalOpen(false);
  };

  const refreshHandler = () => {
    setRefresh(!refresh);
  };

  // components

  const RoomCard = ({ data }: { data: ReservationListDataType }) => {
    return (
      <Col md={12} xl={8} style={{paddingTop:20}}>
        <div className="reservedCardContainer">
          <img className="reservedCardImage" src={data.imageUrl ?? NoImg} />
          <div className="reserveCardDetail">
            <div className="reserveCardDetailTop">
              <Row justify="space-between">
                <Title level={4} className="reserveCardDetailTitle">
                  {data?.name}
                </Title>
                <Button
                  icon={<EditIcon color={whiteLabel.subMenuTextColor} />}
                  type="text"
                  onClick={() => onEdit(data)}
                />
              </Row>
              <p className="reserveCardDetailSubName">{data?.subName}</p>
              <Row justify="space-between">
                <Row align="middle">
                  <LimitPeopleIcon className="reservedIcon" />
                  <span className="subTextColor reservedDetailTxt reservedLeftTxtSpace">
                    {data?.limitPeople} Persons
                  </span>
                </Row>
                <Row align="middle">
                  <MaxTimeIcon className="reservedIcon" />
                  <span className="subTextColor reservedLeftTxtSpace reservedDetailTxt">
                    {data?.maximumHourBooking} Hours
                  </span>
                </Row>
              </Row>
            </div>
            <div className="reserveCardDetailBottom">
              <Row justify="space-between" align="middle">
                <Row>
                  <Switch
                    disabled={
                      accessibility?.menu_facility_log.allowEdit
                        ? false
                        : true
                    }
                    checked={data?.locked}
                    onChange={() => onSwitchChange(!data.locked, data.id)}
                  />
                  <span
                    style={{
                      color: whiteLabel.subMenuTextColor,
                      marginLeft: 5,
                    }}
                  >
                    Click to {data?.locked ? "unlock" : "lock"}
                  </span>
                </Row>
                {data?.locked ? (
                  <span style={{ color: whiteLabel.dangerTextColor }}>
                    Unavailable
                  </span>
                ) : (
                  <span style={{ color: whiteLabel.successTextColor }}>
                    Available
                  </span>
                )}
              </Row>
            </div>
          </div>
        </div>
      </Col>
    );
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  return (
    <>
      <Header title="Our facilities" />
      <Row gutter={[16, 16]}>
        {data.map((item) => {
          return <RoomCard key={item.id} data={item} />;
        })}
      </Row>
      <EditFacilityModal
        visible={editModalOpen}
        data={editData}
        onSave={onEditSave}
        onExit={onEditCancel}
      />
    </>
  );
};

export default ReservedFacilities;
