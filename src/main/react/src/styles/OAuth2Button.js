// OAuth2Button.js

const OAuth2Button = ({ onClick, href, children, style = {} }) => {
  const defaultStyle = {
    display: "inline-block",
    background: "none",
    width: "75px",
    textAlign: "center",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    boxSizing: "border-box",
  };

  const combinedStyle = {
    ...defaultStyle,
    ...(style ? style : {}),
  };

  // 링크와 버튼을 구분하여 반환
  if (href) {
    return (
      <a
        href={href}
        style={combinedStyle}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      style={combinedStyle}
    >
      {children}
    </button>
  );
};

export default OAuth2Button;
