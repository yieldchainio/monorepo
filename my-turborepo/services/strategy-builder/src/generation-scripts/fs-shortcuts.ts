import fs from "fs";

export const writeToFile = async (_fileName: any, _content: any) => {
  await fs.writeFileSync(_fileName, _content);
};
export const appendToFile = async (_fileName: any, _content: any) => {
  await fs.appendFileSync(_fileName, _content);
};
export const appendNewLineShortcut = async (file_name: any, _content: any) => {
  await appendToFile(file_name, `\n${_content}`);
};
// export const appendNewLineInterContract = async (_content: any) => {
//   // @ts-expect-error TS(2552): Cannot find name 'file_name'. Did you mean '__file... Remove this comment to see the full error message
//   await appendToFile(file_name, `\n    ${_content}`);
// };
// export const appendNewLineInterFunction = async (_content: any) => {
//   // @ts-expect-error TS(2552): Cannot find name 'file_name'. Did you mean '__file... Remove this comment to see the full error message
//   await appendToFile(file_name, `\n        ${_content}`);
// };
// export const appendNewLineInterFunction2x = async (_content: any) => {
//   // @ts-expect-error TS(2552): Cannot find name 'file_name'. Did you mean '__file... Remove this comment to see the full error message
//   await appendToFile(file_name, `\n            ${_content}`);
// };
// export const appendNewLineInterFunction3x = async (_content: any) => {
//   // @ts-expect-error TS(2552): Cannot find name 'file_name'. Did you mean '__file... Remove this comment to see the full error message
//   await appendToFile(file_name, `\n                ${_content}`);
// };
