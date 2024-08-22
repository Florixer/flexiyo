import React from "react";
import splashImage from "../../assets/media/img/splash.png";

const LoadingScreen = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <img
        src={splashImage}
        alt="Loading..."
        style={{ maxWidth: "100%", maxHeight: "100%" }}
      />
    </div>
  );
};

export default LoadingScreen;
