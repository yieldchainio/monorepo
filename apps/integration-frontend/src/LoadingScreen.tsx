import styles from "./css/maincss.module.css";
export const LoadingScreen = (props: any) => {
  let backgrounds: any = {
    normal: "black",
    dark: "rgb(30, 30, 30)",
    light: "white",
    dimmed: "rgba(0, 0, 0, 0.5)",
  };
  let style = {
    backgroundColor: backgrounds[props.background] || "black",
  };
  return (
    <div className={styles.loadingScreen} style={style}>
      <img
        src="/loadingpepe.gif"
        alt=""
        style={{
          width: "20%",
        }}
      />
    </div>
  );
};
