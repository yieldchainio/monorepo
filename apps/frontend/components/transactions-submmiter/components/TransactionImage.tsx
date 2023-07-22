import { Loader } from "components/loaders/big";
import { BaseComponentProps } from "components/types";
import WrappedImage from "components/wrappers/image";
import { ImageSrc } from "components/wrappers/types";

export const TransactionImage = ({
  image,
  subImage,
  isLoading,
  style,
  className,
}: {
  image: ImageSrc;
  subImage?: ImageSrc;
  isLoading: boolean;
} & BaseComponentProps) => {
  console.log("Image, subimage, isLoading", image, subImage, isLoading);
  return (
    <div className={"relative" + " " + (className || "")} style={style}>
      <WrappedImage
        width={54}
        height={54}
        className="rounded-full"
        src={image}
      />
      {subImage && (
        <WrappedImage
          width={18}
          height={18}
          className="absolute top-[100%] left-[100%] translate-x-[-75%] translate-y-[-100%] rounded-full border-[1px] border-custom-bcomponentbg"
          src={subImage}
        />
      )}
      {isLoading && (
        <Loader
          style={{
            position: "absolute",
            height: "54px",
            width: "54px",
            top: "0px",
            scale: "123%",
          }}
        />
      )}
    </div>
  );
};
