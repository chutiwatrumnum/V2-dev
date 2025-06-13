import { useState, useEffect, useRef } from "react";
import {
  ChatListDataType,
  ChatDataType,
  SendChatDataType,
} from "../../../stores/interfaces/Chat";
import {
  DownloadOutlined,
  SendOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { whiteLabel } from "../../../configs/theme";
import {
  Empty,
  Image,
  Row,
  Tag,
  Spin,
  message,
  Button,
  Input,
  Avatar,
  Card,
} from "antd";
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

import "../styles/chatRoom.css";
import "../styles/chatLibControl.css";

const ChatBoxContainer = ({ chatData }: { chatData?: ChatListDataType }) => {
  // Variables
  const dispatch = useDispatch<Dispatch>();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
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

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatDataById]);

  // Custom Message Components
  const MessageBubble = ({
    message,
    isOwner,
    timestamp,
  }: {
    message: ChatDataType;
    isOwner: boolean;
    timestamp: string;
  }) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: isOwner ? "flex-end" : "flex-start",
          marginBottom: "12px",
          padding: "0 16px",
        }}>
        <div
          style={{
            maxWidth: "70%",
            position: "relative",
          }}>
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "18px",
              backgroundColor: isOwner ? "#1890ff" : "#f0f0f0",
              color: isOwner ? "#fff" : "#000",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              wordBreak: "break-word",
            }}>
            {message.messageType === "text" && <div>{message.message}</div>}

            {message.messageType === "image" && (
              <div>
                {message.uploadUrl ? (
                  <Image
                    src={message.uploadUrl}
                    style={{
                      maxWidth: "200px",
                      maxHeight: "200px",
                      borderRadius: "8px",
                    }}
                    preview={{
                      mask: <div style={{ color: "#fff" }}>👁️ View</div>,
                    }}
                  />
                ) : (
                  <div style={{ color: isOwner ? "#fff" : "#999" }}>
                    Image not found
                  </div>
                )}
              </div>
            )}

            {message.messageType === "file" && (
              <div>
                {message.uploadUrl ? (
                  <a
                    href={message.uploadUrl}
                    download={message.message}
                    style={{
                      color: isOwner ? "#fff" : "#1890ff",
                      textDecoration: "none",
                    }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px",
                        backgroundColor: isOwner
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(24,144,255,0.1)",
                        borderRadius: "8px",
                        transition: "background-color 0.2s",
                      }}>
                      <DownloadOutlined />
                      <span>{message.fileName || "PDF File"}</span>
                    </div>
                  </a>
                ) : (
                  <div style={{ color: isOwner ? "#fff" : "#999" }}>
                    File not found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Message meta info */}
          <div
            style={{
              fontSize: "11px",
              color: "#999",
              marginTop: "4px",
              textAlign: isOwner ? "right" : "left",
              display: "flex",
              justifyContent: isOwner ? "flex-end" : "flex-start",
              alignItems: "center",
              gap: "4px",
            }}>
            <span>{timestamp}</span>
            {isOwner && message.seen && (
              <span style={{ color: "#52c41a" }}>✓</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const DateSeparator = ({ date }: { date: string }) => (
    <div
      style={{
        textAlign: "center",
        margin: "20px 0",
        position: "relative",
      }}>
      <div
        style={{
          display: "inline-block",
          padding: "6px 16px",
          backgroundColor: "#f0f0f0",
          borderRadius: "16px",
          fontSize: "12px",
          color: "#666",
          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        }}>
        {date}
      </div>
    </div>
  );

  // Functions
  const messageController = (message: ChatDataType) => {
    return (
      <MessageBubble
        key={message.id || Math.random()}
        message={message}
        isOwner={message.isMessageOwner}
        timestamp={dayjs(message.createdAt).format("HH:mm")}
      />
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
    if (isSending) return;

    let payload: SendChatDataType;
    setIsSending(true);

    try {
      let messagePayload = messageValue.replace(/&nbsp;/g, " ");
      if (chatData && messagePayload.trim() !== "") {
        payload = {
          type: "text",
          value: messagePayload,
          userId: chatData.userId,
        };
        await postMessageMutation.mutateAsync(payload);
      }

      if (chatData && base64 && fileType) {
        payload = {
          type: fileType,
          value: base64,
          userId: chatData.userId,
          fileName: file?.name,
        };
        await postMessageMutation.mutateAsync(payload);
      }

      resetMessageValue();
      updateChatData();
    } catch (error) {
      console.error("Error sending message:", error);
      message.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const formatDate = (date: string) => {
    return dayjs(date).format("DD/MMM/YYYY");
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
      setIsChatLimited(false);
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

      try {
        await loadMoreChatData();
        if (moreChatData?.length === 0) {
          setShouldFetch(false);
        } else {
          dispatch.chat.updateCurPageChatData(curPageChatData + 1);
          await queryClient.setQueryData(
            ["chatDataByID", chatData?.userId],
            (oldData: ChatDataType[]) => {
              if (moreChatData) return [...oldData, ...moreChatData];
              return oldData;
            }
          );
        }
      } catch (error) {
        console.error("Error loading more messages:", error);
      } finally {
        setIsMoreChatLoading(false);
      }
    }
  };

  // Handle scroll to detect when reaching top
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    if (scrollTop === 0) {
      onYReachStart();
    }
  };

  // Actions
  useEffect(() => {
    resetMessageValue();
    updateChatData();
    dispatch.chat.updateCurPageChatData(2);
    setIsFirstTime(true);
    setShouldFetch(true);
  }, [chatData]);

  const canSend =
    (messageValue.trim() !== "" && messageValue !== "<br>") || base64 !== null;

  return (
    <>
      {chatData ? (
        <div
          className="rightSideContainer"
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#fff",
            border: "1px solid #d9d9d9",
            borderRadius: "8px",
          }}>
          {/* Header */}
          <div
            className="chatBoxHeader"
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #f0f0f0",
              backgroundColor: "#fafafa",
              borderRadius: "8px 8px 0 0",
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Avatar
                style={{ backgroundColor: "#1890ff", flexShrink: 0 }}
                size="large">
                {chatData.firstName?.charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <div
                  className="titleChatName"
                  style={{
                    fontWeight: 600,
                    fontSize: "16px",
                    color: "#262626",
                  }}>
                  {`${chatData.firstName} ${chatData.lastName}`}
                </div>
                <div
                  style={{
                    color: "#8c8c8c",
                    fontSize: "12px",
                    marginTop: "2px",
                  }}>
                  {chatData.roomAddress}
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div
            ref={messagesContainerRef}
            style={{
              flex: 1,
              overflowY: "auto",
              backgroundColor: "#f9f9f9",
              position: "relative",
            }}
            onScroll={handleScroll}>
            {/* Loading more indicator */}
            {isMoreChatLoading && (
              <div
                style={{
                  textAlign: "center",
                  padding: "16px",
                  backgroundColor: "#fff",
                  margin: "8px 16px",
                  borderRadius: "8px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                }}>
                <Spin size="small" />
                <span style={{ marginLeft: "8px", color: "#666" }}>
                  Loading more messages...
                </span>
              </div>
            )}

            {isChatDataByIDLoading ? (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <Spin size="large" />
              </div>
            ) : chatDataById && chatDataById.length > 0 ? (
              <div style={{ paddingTop: "16px", paddingBottom: "16px" }}>
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
                        {showSeparator && (
                          <DateSeparator date={formatDate(item.createdAt)} />
                        )}
                        {messageController(item)}
                      </div>
                    );
                  })}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  color: "#999",
                }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>💬</div>
                <div>No messages yet. Start a conversation!</div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: "16px 20px",
              borderTop: "1px solid #f0f0f0",
              backgroundColor: "#fff",
              borderRadius: "0 0 8px 8px",
            }}>
            <div
              style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
              <input
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
                ref={fileInputRef}
              />

              <Button
                icon={<PaperClipOutlined />}
                onClick={handleButtonClick}
                style={{ flexShrink: 0 }}
                size="large"
                type="text"
              />

              <Input.TextArea
                value={messageValue}
                onChange={(e) => onTypeMessage(e.target.value)}
                placeholder="Type your message..."
                autoSize={{ minRows: 1, maxRows: 4 }}
                onPressEnter={(e) => {
                  if (!e.shiftKey && canSend && !isSending) {
                    e.preventDefault();
                    onSendMessage();
                  }
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const text = e.clipboardData.getData("text/plain");
                  setMessageValue(text);
                }}
                style={{
                  flex: 1,
                  borderRadius: "20px",
                  border: "1px solid #d9d9d9",
                }}
                count={{
                  show: messageValue.length > 150,
                  max: 200,
                }}
              />

              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={onSendMessage}
                disabled={!canSend || isSending}
                loading={isSending}
                style={{ flexShrink: 0 }}
                size="large"
                shape="circle"
              />
            </div>

            {/* File/Error Display */}
            {(file || error) && (
              <Row style={{ marginTop: "12px" }}>
                {file ? (
                  <Tag
                    closable
                    onClose={resetMessageValue}
                    color={whiteLabel.successColor}
                    style={{ margin: 0 }}>
                    📎 {file.name}
                  </Tag>
                ) : error ? (
                  <Tag color={whiteLabel.dangerColor} style={{ margin: 0 }}>
                    ❌ {error}
                  </Tag>
                ) : null}
              </Row>
            )}
          </div>
        </div>
      ) : (
        <div
          className="emptyContainer"
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Empty
            description="Select a chat to start messaging"
            imageStyle={{ height: 80 }}
          />
        </div>
      )}
    </>
  );
};

export default ChatBoxContainer;
