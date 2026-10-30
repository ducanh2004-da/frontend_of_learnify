import {
  memo,
  useRef,
  useState,
  useLayoutEffect,
  useMemo,
  useCallback,
} from "react";
import classnames from "classnames";
import { prepare, layout } from "@chenglou/pretext";
import Icon from "@/components/Icon";
import type { TMessageProps } from "./type";
import "./style.scss";

const FONT = "14px 'Google Sans Flex', system-ui, sans-serif";
const LINE_HEIGHT = 21;
const BUBBLE_PAD = 24;
const MAX_BUBBLE_RATIO = 0.7;
const MIN_BUBBLE_HEIGHT = 36;

const ChatMessage = (props: TMessageProps) => {
  const { message, className } = props;
  const { content, sender, timestamp, type, imageUrl } = message;
  const bodyRef = useRef<HTMLDivElement>(null);
  const [bubbleHeight, setBubbleHeight] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);

  const formattedTime = useMemo(
    () =>
      new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [timestamp]
  );

  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (!body) return;

    const list = body.closest(".chat-messages-list");
    if (!list) return;

    const maxWidth = list.clientWidth * MAX_BUBBLE_RATIO - BUBBLE_PAD;
    const prepared = prepare(content, FONT);
    const { height } = layout(prepared, Math.max(maxWidth, 50), LINE_HEIGHT);

    setBubbleHeight(Math.max(height + BUBBLE_PAD, MIN_BUBBLE_HEIGHT));
  }, [content]);

  const handleImageClick = useCallback(() => {
    if (type === "image") {
      setModalOpen(true);
      setZoom(1);
    }
  }, [type]);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setZoom(1);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.5, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.5, 0.5));
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((prev) => {
      const delta = e.deltaY > 0 ? -0.25 : 0.25;
      return Math.min(Math.max(prev + delta, 0.5), 5);
    });
  }, []);

  const handleDownload = useCallback(async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(imageUrl, "_blank");
    }
  }, [imageUrl]);

  const cls = classnames("chat-message", `chat-message--${sender}`, className);

  return (
    <div className={cls} id={`msg-${message.id}`} tabIndex={-1}>
      <div className="chat-message__avatar">
        <Icon name={sender === "teacher" ? "smart_toy" : "person"} />
      </div>
      <div
        className="chat-message__body"
        ref={bodyRef}
        style={bubbleHeight ? { minHeight: bubbleHeight } : undefined}
      >
        <div className="chat-message__bubble">
          {type === "image" && imageUrl ? (
            <img
              className="chat-message__image"
              src={imageUrl}
              alt={content}
              onClick={handleImageClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleImageClick()}
            />
          ) : (
            <p className="chat-message__text">{content}</p>
          )}
        </div>
        <span className="chat-message__time">{formattedTime}</span>
      </div>

      {modalOpen && imageUrl && (
        <div
          className="chat-message__modal-overlay"
          onClick={handleCloseModal}
          onWheel={handleWheel}
          data-lenis-prevent
        >
          <div className="chat-message__modal-toolbar">
            <button
              className="chat-message__modal-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleZoomOut();
              }}
              title="Zoom out"
            >
              <Icon name="zoom_out" />
            </button>
            <span className="chat-message__modal-zoom">
              {Math.round(zoom * 100)}%
            </span>
            <button
              className="chat-message__modal-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleZoomIn();
              }}
              title="Zoom in"
            >
              <Icon name="zoom_in" />
            </button>
            <button
              className="chat-message__modal-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              title="Download"
            >
              <Icon name="download" />
            </button>
            <button
              className="chat-message__modal-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleCloseModal();
              }}
              title="Close"
            >
              <Icon name="close" />
            </button>
          </div>
          <div
            className="chat-message__modal-image-wrapper"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt={content}
              className="chat-message__modal-image"
              style={{ transform: `scale(${zoom})` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ChatMessage);
