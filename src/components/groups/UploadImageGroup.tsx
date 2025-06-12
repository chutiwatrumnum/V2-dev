import { useState, useEffect } from "react";
import { Upload, Typography, message } from "antd";

import UploadImage from "../../assets/icons/UploadImage.svg";
import UploadImageWhite from "../../assets/icons/UploadImageWhite.svg";

import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import type { UploadChangeParam } from "antd/es/upload";

const { Text } = Typography;

interface UploadImageGroupType {
  onChange: Function;
  image: string;
  disabled?: boolean;
}

const UploadImageGroup = ({
  onChange,
  image,
  disabled = false,
}: UploadImageGroupType) => {
  const [overSize, setOverSize] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  const beforeUpload = (file: RcFile) => {
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (!isLt2M) {
      message.error("Image must smaller than 1MB!");
      setOverSize(true);
    } else {
      setOverSize(false);
    }
    return isLt2M;
  };

  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    info.file.status = "done";
    getBase64(info.file.originFileObj as RcFile, (url) => {
      setImageUrl(url);
      onChange(url);
    });
  };

  useEffect(() => {
    setImageUrl(image);
  }, [image]);

  return (
    <>
      <Upload.Dragger
        name="uploadImage"
        maxCount={1}
        accept=".png, .jpg, .jpeg, .svg"
        beforeUpload={beforeUpload}
        onChange={handleChange}
        height={200}
        showUploadList={false}
        className="upload"
        style={{
          backgroundColor: "#fff",
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
        }}
        disabled={disabled}
      >
        <p>
          {imageUrl ? (
            <img src={UploadImageWhite} alt="announcementWhite" />
          ) : (
            <img src={UploadImage} alt="announcement" />
          )}
        </p>
        <Text style={{ color: imageUrl ? "#fff" : "#BFBFBF" }}>
          <p>Upload your photo</p>
        </Text>
        <Text style={{ color: imageUrl ? "#fff" : "#BFBFBF" }}>
          <p>{"*File size <1MB, 16:9 Ratio, *JPGs"}</p>
        </Text>
      </Upload.Dragger>

      <Text hidden={!overSize} type="danger">
        {"*File size < 1Mb , 16:9 Ratio, *JPGs"}
      </Text>
    </>
  );
};

export default UploadImageGroup;
