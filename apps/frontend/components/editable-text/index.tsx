/**
 * An editable text component
 */

import CheckmarkIcon from "components/icons/checkmark";
import EditIcon from "components/icons/edit";
import SmallLoader from "components/loaders/small";
import WrappedText from "components/wrappers/text";
import { TextProps } from "components/wrappers/types";
import { FormEvent, useState } from "react";

export const EditableText = ({
  text,
  onConfirmChange,
  className,
  ...textProps
}: {
  text: string;
  onConfirmChange: (input: string) => Promise<void> | void;
} & Partial<TextProps>) => {
  const [newText, setNewText] = useState(text);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const confirmInput = async () => {
    setIsLoading(true);
    setIsEditing(false);
    await onConfirmChange(newText);
    setIsLoading(false);
  };

  return (
    <div className={"flex flex-row gap-2" + (className || "")}>
      {isEditing ? (
        <div className="flex flex-row w-[100%] max-w-[130px] whitespace-nowrap items-center justify-between gap-2">
          <WrappedText
            fontSize={22}
            fontStyle="light"
            className=" w-full border-[0.01px] border-transparent border-b-custom-textColor pr-[80px] text-clip"
            contentEditable="true"
            id="username_editor"
            onInput={(e: FormEvent<HTMLDivElement>) =>
              e.currentTarget.textContent &&
              setNewText(e.currentTarget.textContent)
            }
            truncate="truncate"
            {...textProps}
          >
            {text}
          </WrappedText>
          <div className="ml-0" onClick={confirmInput}>
            <CheckmarkIcon
              className="cursor-pointer hover:text-custom-lightHover transition duration-200 text-custom-textColor"
              iconClassname=""
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-row gap-4 items-center">
          <WrappedText
            fontSize={22}
            fontStyle="light"
            className="overflow-hidden max-w-[100px] truncate"
            {...textProps}
          >
            {text}
          </WrappedText>
          <div onClick={() => setIsEditing(!isEditing)}>
            {!isLoading ? (
              <EditIcon
                className="scale-[1.15] mt-1.5 cursor-pointer hover:scale-[1.2] transition duration-200 ease-in-out text-custom-textColor hover:text-custom-lightHover"
                iconClassname=""
              />
            ) : (
              <SmallLoader color="fill-[#ffffff]" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
