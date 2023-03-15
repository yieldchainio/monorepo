import React, { useEffect, useState } from "react";

export const LoadingScreen = (props: any) => {
  const [loading, setLoading] = useState(true);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 1)",
        position: "fixed",
        zIndex: 100000,
        left: "0px",
      }}
    >
      <img
        alt=""
        src="/loadingscreen.gif"
        style={{
          width: "300px",
          height: "300px",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
      ;
    </div>
  );
};
