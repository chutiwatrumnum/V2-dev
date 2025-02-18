import React, { useState, useEffect } from "react";
// import { Calendar, Event, dayjsLocalizer } from "react-big-calendar";
import "dayjs/locale/en-gb";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card, Breadcrumb, Row, Button, Col, Typography } from "antd";
import DetailRoomFacilities from "../components/DetailRoomFacilities";
// import "../../../components/style/header.css";
import { getFacilitiesList } from "../service/api/FacilitiesServiceAPI";
const { Text, Link } = Typography;
const title = "Our facilities";
// import "../styles/slide.css";
import "../styles/OurFacilities.css";
import { BreadcrumbType } from "../../documentForms/interface/Public";

const OurFacilities: React.FC = () => {
  const [itemList, setitemList] = useState<any>([]);
  const [detail, setdetail] = useState<boolean>(false);
  const [titleDetail, setTitleDetail] = useState<any>("");
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbType[]>([]);
  const [reRender, setreRender] = useState<boolean>(false);

  useEffect(() => {
    (async function () {
      const dataRoomList = await getFacilitiesList();
      if (dataRoomList.status) {
        // console.log(dataRoomList.data);
        setitemList(dataRoomList.data);
      }
      setBreadcrumb([
        {
          title: (
            <Link
              className="title"
              onClick={async () => {
                setreRender(!reRender);
                setdetail(false);
              }}>
              {title}
            </Link>
          ),
        },
      ]);
    })();
  }, [reRender]);

  const nextTocalendar = async ({ currentTarget }: any) => {
    itemList[currentTarget.value];
    const data = {
      id: itemList[currentTarget.value].value,
      name: itemList[currentTarget.value].label,
      imageId: itemList[currentTarget.value].imageId,
      validDateNumber: itemList[currentTarget.value].validDateNumber,
    };
    setBreadcrumb((prevState) => [
      ...prevState,
      {
        title: (
          <Link
            onClick={async () => {
              setBreadcrumb([
                {
                  title: (
                    <Link
                      className="title"
                      onClick={async () => {
                        setreRender(!reRender);
                        setdetail(false);
                      }}>
                      {title}
                    </Link>
                  ),
                },
              ]);
              await setdetail(false);
            }}
            className="title">
            {data.name}
          </Link>
        ),
      },
    ]);
    await setTitleDetail(data);
    await setdetail(true);
  };

  return (
    <>
      {/* <Header title={"Our facilities"} /> */}
      <div className="facility">
        <Breadcrumb
          style={{ fontWeight: "bold", display: "flex", alignItems: "center" }}
          className="heading"
          items={breadcrumb}
        />
      </div>

      {detail ? (
        <DetailRoomFacilities
          name={titleDetail?.name}
          id={titleDetail?.id}
          imageId={titleDetail?.imageId}
          validDateNumber={titleDetail?.validDateNumber}
          isOpen={detail}
          callBack={async (isOpen: boolean) => {
            setBreadcrumb([
              {
                title: (
                  <Link
                    className="title"
                    onClick={async () => {
                      await setdetail(false);
                    }}>
                    {title}
                  </Link>
                ),
              },
            ]);
            await setdetail(isOpen);
          }}
        />
      ) : (
        <Row style={{ paddingBottom: "5vh" }} gutter={[24, 16]}>
          {itemList.length > 0 && !detail
            ? itemList?.map((item: any, index: number) => {
                return (
                  <Col
                    span={6}
                    style={{
                      marginTop: 20,
                    }}>
                    <Card
                      hoverable
                      cover={<img alt="example" src={item?.imageId} />}
                      style={{ height: "100%", paddingBottom: 24 }}
                      className="ourFacilitiesCardContainer">
                      <div className="ourFacilitiesCardBodyContainer">
                        <div style={{ display: "flex", flex: 1 }}>
                          <h1>{item?.label}</h1>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flex: 1,
                            justifyContent: "flex-end",
                            alignItems: "flex-end",
                          }}>
                          <Button
                            shape="round"
                            value={index}
                            onClick={nextTocalendar}
                            type="primary">
                            Check availability
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </Col>
                );
              })
            : null}
        </Row>
      )}
    </>
  );
};

export default OurFacilities;
