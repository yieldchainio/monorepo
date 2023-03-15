import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import styles from "./css/lines.module.css";

export const RightLine = (props: any) => {
  const { width, height, top, left, percentage } = props;
  return (
    <div
      className={styles.rightLine}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        top: `${top}px`,
        left: `${left}px`,
      }}
    >
      <div
        className={styles.percentageBoxEditable}
        style={{ left: "calc(100% - 28px)" }}
      >
        <div className={styles.percentageText}>{percentage}%</div>
        <img src="/editicon.svg" alt="" className={styles.editIcon} />
      </div>
    </div>
  );
};

export const LeftLine = (props: any) => {
  const { width, height, top, left, percentage } = props;
  return (
    <div
      className={styles.leftLine}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        top: `${top}px`,
        left: `${left}px`,
      }}
    >
      <div className={styles.percentageBoxEditable}>
        <div className={styles.percentageText}>{percentage}%</div>
        <img src="/editicon.svg" alt="" className={styles.editIcon} />
      </div>
    </div>
  );
};

export const StraightLine = (props: any) => {
  const { height, top, left, percentage } = props;
  return (
    <div
      className={styles.straightLine}
      style={{ height: `${height}px`, top: `${top}px`, left: `${left}px` }}
    >
      <div className={styles.percentageBoxEditable}>
        <div className={styles.percentageText}>{percentage}%</div>
        <img src="/editicon.svg" alt="" className={styles.editIcon} />
      </div>
    </div>
  );
};

export const RightEdge = (props: any) => {
  const {
    x1,
    y1,
    x2,
    y2,
    percentage,
    placeholder,
    percentageModalHandler,
    parentId,
    childId,
  } = props;

  const percentageBoxRef = useRef<any>();
  return (
    <div
      className={styles.rightLine}
      style={{
        width: `${x2 - x1}px`,
        height: `${y2 - y1}px`,
        top: `${y1}px`,
        left: `${x1}px`,
        zIndex: `9999999`,
      }}
    >
      <div
        className={styles.percentageBoxEditable}
        ref={percentageBoxRef}
        onClick={() => {
          percentageModalHandler({
            parentId: parentId,
            childId: childId,
            percentage: percentage,
            top: percentageBoxRef.current.getBoundingClientRect().top,
            left: percentageBoxRef.current.getBoundingClientRect().left,
          });
          console.log(
            "Onclick: ",
            `top:  ${percentageBoxRef.current.offsetTop}, left: ${percentageBoxRef.current.offsetLeft},}`
          );
        }}
        style={{ left: "calc(100% - 28px)" }}
      >
        <div className={styles.percentageText}>{percentage}%</div>
        <img src="/editicon.svg" alt="" className={styles.editIcon} />
      </div>
    </div>
  );
};

export const LeftEdge = (props: any) => {
  const {
    x1,
    y1,
    x2,
    y2,
    percentage,
    placeholder,
    percentageModalHandler,
    parentId,
    childId,
  } = props;

  const percentageBoxRef = useRef<any>();
  return (
    <div
      className={styles.leftLine}
      style={{
        width: `${x1 - x2}px`,
        height: `${y2 - y1}px`,
        top: `${y1}px`,
        left: `${x2}px`,
        zIndex: `9999999`,
      }}
    >
      <div
        className={styles.percentageBoxEditable}
        ref={percentageBoxRef}
        onClick={() => {
          percentageModalHandler({
            parentId: parentId,
            childId: childId,
            percentage: percentage,
            top: percentageBoxRef.current.getBoundingClientRect().top,
            left: percentageBoxRef.current.getBoundingClientRect().left,
          });
          console.log(
            "Onclick: ",
            `top:  ${percentageBoxRef.current.offsetTop}, left: ${percentageBoxRef.current.offsetLeft},}`
          );
        }}
      >
        {" "}
        <div className={styles.percentageText}>{percentage}%</div>
        <img src="/editicon.svg" alt="" className={styles.editIcon} />
      </div>
    </div>
  );
};

export const StraightEdge = (props: any) => {
  const {
    x1,
    y1,
    x2,
    y2,
    percentage,
    placeholder,
    percentageModalHandler,
    parentId,
    childId,
  } = props;

  const percentageBoxRef = useRef<any>();

  return (
    <div
      className={styles.straightLine}
      style={{
        height: `${y2 - y1}px`,
        top: `${y1}px`,
        left: `${x1}px`,
        zIndex: `15`,
        borderLeft: placeholder ? "1px dashed #ffffff31" : "",
      }}
    >
      {!placeholder && (
        <div
          className={styles.percentageBoxEditable}
          ref={percentageBoxRef}
          onClick={() => {
            percentageModalHandler({
              parentId: parentId,
              childId: childId,
              percentage: percentage,
              top: percentageBoxRef.current.getBoundingClientRect().top,
              left: percentageBoxRef.current.getBoundingClientRect().left,
            });
            console.log(
              "Onclick: ",
              `top:  ${percentageBoxRef.current.offsetTop}, left: ${percentageBoxRef.current.offsetLeft},}`
            );
          }}
        >
          <div className={styles.percentageText}>{percentage}%</div>
          <img src="/editicon.svg" alt="" className={styles.editIcon} />
        </div>
      )}
    </div>
  );
};
