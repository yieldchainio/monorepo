import Divisor from "components/general/divisor-line";
import LinkIcon from "components/icons/link";
import WrappedText from "components/wrappers/text";
import { useRouter } from "next/navigation";
import { Children } from "react";

interface SectionProps {
  title?: string;
  titleLink?: string;
  id?: string;
  fields: Record<string, any>;
  children?: JSX.Element;
  showLines?: boolean;
  fontSize?: number;
  titlesClassname?: string;
  valuesClassname?: string;
  sectionsClassname?: string;
  divisorClassname?: string;
}
const Section = ({
  title,
  titleLink,
  fields,
  children,
  id = "SectionComponent",
  showLines = true,
  fontSize,
  titlesClassname,
  valuesClassname,
  sectionsClassname,
  divisorClassname = "",
}: SectionProps) => {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full">
        {title && (
          <div className="flex flex-row items-center gap-3 hover:scale-[1.02] hover:bg-custom-dimmed hover:bg-opacity-20 transition duration-200 ease-in-out cursor-pointer rounded-lg py-1 px-3">
            <WrappedText
              fontSize={18}
              fontStyle="light"
              onClick={() => (titleLink ? router.push(titleLink) : null)}
              className={titleLink ? "cursor-pointer" : ""}
            >
              {title}
            </WrappedText>
            {titleLink && (
              <LinkIcon
                iconClassname="text-custom-textColor"
                className="scale-[1.5]"
              />
            )}
          </div>
        )}
        {showLines && (
          <Divisor
            className={(title ? " mt-2 mb-5" : "") + " " + divisorClassname}
          />
        )}
        <div
          className={
            "flex w-full flex-col  " + " " + (sectionsClassname || " ")
          }
        >
          {Object.entries(fields).map((field: Record<string, any>, i) => {
            return (
              <div className="flex flex-row justify-between" key={i}>
                <WrappedText
                  fontSize={fontSize || 15}
                  fontStyle="[150]"
                  fontColor="custom-textColor"
                  className={
                    "text-opacity-[50%]" + " " + (titlesClassname || "")
                  }
                >
                  {field[0] + ":"}
                </WrappedText>
                <WrappedText
                  fontSize={fontSize || 17}
                  fontStyle="medium"
                  className={valuesClassname || ""}
                >
                  {field[1]}
                </WrappedText>
              </div>
            );
          })}
        </div>
        {children}
        {!Children.toArray(children).some((child: any) =>
          isSectionComponent(child)
        ) &&
          showLines && <Divisor className={" mb-2 mt-5" + divisorClassname} />}
      </div>
    </>
  );
};

function isSectionComponent(child: any): boolean {
  return child.key == ".$SectionComponent";
}

export default Section;
