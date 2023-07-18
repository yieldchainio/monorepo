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
          width={8}
          height={8}
          className="absolute top-[80%] left-[80%] translate-x-[-100%] translate-y-[-100%]"
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
