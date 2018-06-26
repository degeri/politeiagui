import React from "react";

const Message = ({
  type,
  header,
  body,
  children,
  height,
  className,
  onDismissClick
}) => {
  const mapTypeToIcon = {
    success: "✔",
    error: "✖",
    info: "ℹ︎"
  };
  const icon = mapTypeToIcon[type] ? mapTypeToIcon[type] : mapTypeToIcon.error;

  if(className) {
    className = " " + className;
  } else {
    className = "";
  }

  return (
    <div className={"message-ct message-" + type + className} style={{height: height}}>
      <div className="message-icon" style={{height, lineHeight: height}}>
        {icon}
      </div>
      <div className="message-text" style={{flexGrow: "1"}}>
        <div className="message-header">{header}</div>
        <div className="message-body">
          {body ? (body instanceof Error) ? body.message : body : null}
          {children ? children : null}
        </div>
      </div>
      {onDismissClick &&
        <span style={{padding: "10px"}}>
          <i
            style={{
              cursor: "pointer",
              fontSize: "18px"
            }}
            onClick={onDismissClick}
          >
              x
          </i>
        </span>
      }
    </div>
  );
};

export default Message;
