import { useState, useEffect, useRef } from "react";
import {
  DownloadOutlined,
  SendOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { whiteLabel } from "../../../configs/theme";
import { Empty, Image, Row, Tag, Spin, message, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
import dayjs from "dayjs";
import { TrashIcon } from "../../../assets/icons/Icons";
import {
  getChatDataByIDQuery,
  getMoreChatDataByIDQuery,
} from "../../../utils/queries";
import { postMessageByJuristicMutation } from "../../../utils/mutations";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChatListDataType,
  ChatDataType,
  SendChatDataType,
} from "../../../stores/interfaces/Chat";

import "../styles/customChatBox.css";

const ChatBoxContainer = ({ chatData }: { chatData?: ChatListDataType }) => {
  // Variables
  const dispatch = useDispatch<Dispatch>();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const { curPageChatData } = useSelector((state: RootState) => state.chat);
  const [file, setFile] = useState<File | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "file" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [messageValue, setMessageValue] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [isMoreChatLoading, setIsMoreChatLoading] = useState(false);
  const [isChatLimited, setIsChatLimited] = useState(false);

  // API
  const {
    data: chatDataById,
    isLoading: isChatDataByIDLoading,
    refetch: updateChatData,
  } = getChatDataByIDQuery({ id: chatData?.userId ?? "" });

  const { data: moreChatData, refetch: loadMoreChatData } =
    getMoreChatDataByIDQuery({
      id: chatData?.userId ?? "",
      curPage: curPageChatData.toString(),
      shouldFetch: shouldFetch,
    });

  const postMessageMutation = postMessageByJuristicMutation();

  let lastDate = "";

  // Functions
  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  const handleScroll = async () => {
    if (messageListRef.current) {
      const { scrollTop } = messageListRef.current;
      if (scrollTop === 0) {
        await onYReachStart();
      }
    }
  };

  const renderMessage = (message: ChatDataType) => {
    const isOwner = message.isMessageOwner;
    const messageClass = isOwner ? "message-outgoing" : "message-incoming";

    let messageContent = null;

    switch (message.messageType) {
      case "text":
        messageContent = <div className="message-text">{message.message}</div>;
        break;

      case "image":
        messageContent = message.uploadUrl ? (
          <div className="message-image">
            <Image
              src={message.uploadUrl}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
              preview={true}
            />
          </div>
        ) : (
          <div className="message-text">Image not found</div>
        );
        break;

      case "file":
        messageContent = message.uploadUrl ? (
          <div className="message-file">
            <a href={message.uploadUrl} download={message.message}>
              <div className="file-download">
                <DownloadOutlined style={{ fontSize: 16 }} />
                <span style={{ marginLeft: 8 }}>
                  {message.fileName !== "" ? message.fileName : "PDF File"}
                </span>
              </div>
            </a>
          </div>
        ) : (
          <div className="message-text">File not found</div>
        );
        break;

      default:
        messageContent = <div className="message-text">{message.message}</div>;
    }

    return (
      <div key={message.messageId} className={`message ${messageClass}`}>
        <div className="message-content">
          {messageContent}
          <div className="message-meta">
            {message.seen && <span className="message-read">Read</span>}
            <span className="message-time">
              {dayjs(message.createdAt).format("HH:mm")}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderDateSeparator = (date: string) => {
    return (
      <div className="date-separator">
        <div className="date-separator-line"></div>
        <span className="date-separator-text">
          {dayjs(date).format("DD/MMM/YYYY")}
        </span>
        <div className="date-separator-line"></div>
      </div>
    );
  };

  const resetMessageValue = () => {
    setFile(null);
    setBase64(null);
    setFileType(null);
    setError(null);
    setMessageValue("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSendMessage = async () => {
    if (!chatData) return;

    let payload: SendChatDataType;
    setIsSending(true);

    const messagePayload = messageValue.replace(/&nbsp;/g, " ").trim();

    if (messagePayload !== "") {
      payload = {
        type: "text",
        value: messagePayload,
        userId: chatData.userId,
      };
      await postMessageMutation.mutateAsync(payload);
    }

    if (base64 && fileType) {
      payload = {
        type: fileType,
        value: base64,
        userId: chatData.userId,
        fileName: file?.name,
      };
      await postMessageMutation.mutateAsync(payload);
    }

    setIsSending(false);
    resetMessageValue();
    updateChatData();
    setTimeout(scrollToBottom, 100);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(null);
    setBase64(null);
    setMessageValue("");

    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      const fileSizeLimit = 3 * 1024 * 1024; // 3 MB
      const validFileTypes: any = {
        "image/jpeg": "image",
        "image/png": "image",
        "image/webp": "image",
        "application/pdf": "file",
      };

      if (!Object.keys(validFileTypes).includes(selectedFile.type)) {
        setError(
          "Invalid file type. Please select a JPG, PNG, WEBP image, or PDF."
        );
        setFile(null);
        setFileType(null);
      } else if (selectedFile.size > fileSizeLimit) {
        setError("File size exceeds the limit of 3 MB.");
        setFile(null);
        setFileType(null);
      } else {
        setError(null);
        setFile(selectedFile);
        setFileType(validFileTypes[selectedFile.type]);
        convertToBase64(selectedFile);
      }
    }
  };

  const convertToBase64 = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setBase64(reader.result as string);
      setMessageValue(" ");
    };
    reader.onerror = () => {
      setError("Error converting file to base64.");
    };
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const onTypeMessage = (val: string) => {
    if (val.length <= 200) {
      setMessageValue(val);
    } else if (!isChatLimited) {
      setIsChatLimited(true);
      message.info("Message should be less than 200 characters.");
    }
  };

  const onYReachStart = async () => {
    if (!shouldFetch && !isFirstTime) {
      console.log("no more chat data");
      return;
    }

    if (isMoreChatLoading) {
      return;
    }

    if (isFirstTime) {
      setIsFirstTime(false);
      setShouldFetch(true);
      return;
    }

    if (shouldFetch) {
      setIsMoreChatLoading(true);
      await loadMoreChatData();

      if (moreChatData?.length === 0) {
        setShouldFetch(false);
        setIsMoreChatLoading(false);
        return;
      }

      dispatch.chat.updateCurPageChatData(curPageChatData + 1);
      await queryClient.setQueryData(
        ["chatDataByID", chatData?.userId],
        (oldData: ChatDataType[]) => {
          if (moreChatData) return [...oldData, ...moreChatData];
        }
      );
      setIsMoreChatLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend()) {
        onSendMessage();
      }
    }
  };

  const canSend = () => {
    return (
      (messageValue !== "" && messageValue !== "<br>" && !isSending) ||
      (base64 !== null && !isSending)
    );
  };

  // Actions
  useEffect(() => {
    resetMessageValue();
    updateChatData();
    dispatch.chat.updateCurPageChatData(2);
    setIsFirstTime(true);
  }, [chatData]);

  useEffect(() => {
    scrollToBottom();
  }, [chatDataById]);

  return (
    <>
      {chatData ? (
        <div className="chat-container">
          <input
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
            ref={fileInputRef}
          />

          {/* Chat Header */}
          <div className="chat-header">
            <div className="chat-header-content">
              <h3 className="chat-title">
                {`${chatData?.firstName} ${chatData?.lastName} (${chatData?.roomAddress})`}
              </h3>
            </div>
          </div>

          {/* Messages List */}
          <div
            className="message-list"
            ref={messageListRef}
            onScroll={handleScroll}>
            {isMoreChatLoading && (
              <div className="loading-more">
                <Spin size="small" />
                <span>Loading more messages...</span>
              </div>
            )}

            {isChatDataByIDLoading ? (
              <div className="loading-container">
                <Spin />
              </div>
            ) : chatDataById ? (
              <>
                {chatDataById
                  .slice()
                  .reverse()
                  .map((item, index) => {
                    const messageDate = dayjs(item.createdAt).format(
                      "DD/MMM/YYYY"
                    );
                    const showSeparator = messageDate !== lastDate;
                    lastDate = messageDate;

                    return (
                      <div key={index}>
                        {showSeparator && renderDateSeparator(item.createdAt)}
                        {renderMessage(item)}
                      </div>
                    );
                  })}
              </>
            ) : null}
          </div>

          {/* File Preview */}
          {(file || error) && (
            <Row style={{ padding: "4px 16px" }}>
              {file ? (
                <Tag
                  className="file-tag"
                  onClick={() => resetMessageValue()}
                  color={whiteLabel.successColor}
                  style={{ cursor: "pointer" }}>
                  {file.name}
                  <TrashIcon
                    color={whiteLabel.whiteColor}
                    style={{ marginLeft: 4, width: 16, height: 16 }}
                  />
                </Tag>
              ) : error ? (
                <Tag color={whiteLabel.dangerColor}>{error}</Tag>
              ) : null}
            </Row>
          )}

          {/* Message Input */}
          <div className="message-input-container">
            <div className="message-input-wrapper">
              <Button
                type="text"
                icon={<PaperClipOutlined />}
                onClick={handleButtonClick}
                className="attachment-button"
              />

              <textarea
                ref={messageInputRef}
                className="message-textarea"
                placeholder="Type message here"
                value={messageValue}
                onChange={(e) => onTypeMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={1}
                onPaste={(e) => {
                  e.preventDefault();
                  const text = e.clipboardData.getData("text/plain");
                  setMessageValue(text);
                }}
              />

              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={onSendMessage}
                disabled={!canSend()}
                loading={isSending}
                className="send-button"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-container">
          <Empty />
        </div>
      )}
    </>
  );
};

export default ChatBoxContainer;
