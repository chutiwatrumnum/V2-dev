import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
// import { whiteLabel } from "../../../configs/theme";
import { socket } from "../../../configs/socket";
import { getUnitQuery } from "../../../utils/queries";

import {
  getServiceChatListQuery,
  getOptionsChatListQuery,
} from "../../../utils/queries/serviceQueries";

import Header from "../../../components/templates/Header";
import ServiceChatBoxContainer from "../components/ServiceChatBoxContainer";
import ServiceChatList from "../components/ServiceChatList";
import { AdjustmentIcon } from "../../../assets/icons/Icons";
import { Row, Col, Dropdown, Button, Menu, Spin, Select, Tabs } from "antd";

import { ServiceChatListDataType } from "../../../utils/interfaces/serviceInterface";
import type { TabsProps } from "antd";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "../styles/serviceChat.css";

const ServiceChat = () => {
  // Variables
  const dispatch = useDispatch<Dispatch>();
  const { chatListSortBy } = useSelector((state: RootState) => state.chat);
  const { status } = useSelector((state: RootState) => state.serviceCenter);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [currentChat, setCurrentChat] = useState();
  // const [chatListSortBy, setChatListSortBy] = useState("time");

  // API
  const {
    data: serviceChatListData,
    isLoading: isServiceChatListLoading,
    refetch: refetchServiceChatList,
  } = getServiceChatListQuery({
    sortBy: chatListSortBy,
    status: status,
  });

  const { data: chatListOptions, isLoading: isChatListOptionsLoading } =
    getOptionsChatListQuery();

  // Functions

  const handleServiceSelected = async (value: string, option: any) => {
    // console.log(value);
    console.log(option);
    let payload = {
      serviceId: option.serviceId,
      serviceType: option.serviceType,
      roomAddress: option.roomAddress,
      userId: option.userId,
    };
    onServiceSelected(payload);
  };

  const handleMenuClick = (e: any) => {
    dispatch.chat.updateSortByData(e.key);
    // setChatListSortBy(e.key);
  };

  const onServiceSelected = (item: any) => {
    setCurrentChat(item);
  };

  const onUserListSelected = async (
    item: ServiceChatListDataType,
    index: number
  ) => {
    let seenData = serviceChatListData;
    // console.log(item);

    onServiceSelected(item);
    setActiveIndex(index);
    if (seenData) seenData[index].seen = true;
  };

  const onTabsChange = (key: string) => {
    let payload = undefined;
    switch (key) {
      case "all":
        payload = undefined;
        break;
      case "pending":
        payload = "pending";
        break;
      case "repairing":
        payload = "repairing";
        break;
      case "success":
        payload = "success";
        break;

      default:
        break;
    }

    dispatch.serviceCenter.updateStatusData(payload);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="time">Time Received</Menu.Item>
      <Menu.Item key="unread">Unread Messages</Menu.Item>
    </Menu>
  );

  const tabItems: TabsProps["items"] = [
    {
      key: "all",
      label: "All",
    },
    {
      key: "pending",
      label: "Pending",
    },
    {
      key: "repairing",
      label: "Repairing",
    },
    {
      key: "success",
      label: "Success",
    },
  ];

  // Actions
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket.IO Connection Opened");
    });
    socket.on("chat-list", () => {
      refetchServiceChatList();
    });
    socket.on("connect_error", (error) => {
      console.error("Connection Error:", error);
    });
    socket.on("reconnect_attempt", (attempt) => {
      console.log(`Reconnect attempt ${attempt}`);
    });
    socket.on("disconnect", (reason) => {
      console.log("Socket.IO Connection Closed: Reason is =>", reason);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <Header title="Messages" />
      <Tabs defaultActiveKey="all" items={tabItems} onChange={onTabsChange} />
      <Row className="chatRoomContainer">
        <Col span={8} className="leftSideChatContainer">
          <Row className="filterContainer_CR">
            <Col span={20}>
              <Row justify={"space-between"} align={"middle"}>
                <Select
                  size="large"
                  placeholder="Select a by service"
                  style={{ width: "100%" }}
                  onChange={handleServiceSelected}
                  options={chatListOptions}
                  fieldNames={{
                    value: "serviceId",
                    // label: "label",
                  }}
                  loading={isChatListOptionsLoading}
                  filterOption={(input, option) =>
                    (option?.roomAddress ?? "").includes(input)
                  }
                  showSearch
                />
              </Row>
            </Col>
            <Col style={{ display: "flex", justifyContent: "end" }} span={4}>
              <Dropdown overlay={menu} trigger={["click"]}>
                <Button
                  size="large"
                  shape="circle"
                  className="adjustButton"
                  icon={<AdjustmentIcon className="adjustIcon" />}
                />
              </Dropdown>
            </Col>
          </Row>
          <Col className="userListContainer">
            {isServiceChatListLoading ? (
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Spin />
              </div>
            ) : (
              serviceChatListData?.map((item, index) => {
                return (
                  <ServiceChatList
                    key={index}
                    activeIndex={activeIndex}
                    index={index}
                    item={item}
                    onUserListSelected={onUserListSelected}
                  />
                );
              })
            )}
          </Col>
          <Row className="userListBottomLine">
            <div className="horizontal-line" />
            <p className="centered-text">It is all, nothing more.</p>
            <div className="horizontal-line" />
          </Row>
        </Col>
        <Col span={16} style={{ height: "100%" }}>
          <div style={{ position: "relative", height: "100%" }}>
            <ServiceChatBoxContainer chatData={currentChat} />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ServiceChat;
