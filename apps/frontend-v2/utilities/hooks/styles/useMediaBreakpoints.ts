// import { create, useStore } from "zustand";
// import { MediaScreens } from "types/styles/media-breakpoints";
// import { useEffect, useState } from "react";

// export type UseMediaBreakpointsProps = {
//   [value in MediaScreens]: any;
// };

// export interface useMediaBreakpointsStore {
//   proprety: any;
//   setProprety: (_proprety: any) => void;
// }

// /**
//  * @notice
//  * A custom hook to use media breakpoints,
//  * receives an object that maps any amount of MediaScreens sizes to some propretry,
//  * has a useEffect that listens for window sizing change, and when it changes,
//  * we set a state corresponding to the proprety set to the matching breakpoint,
//  * which we return.
//  * @param propreties @
//  */
// export const useMediaBreakpoints = (_propreties:{
//     [key in MediaScreens]: any
// }) => {
//   // We initiate the state
//   const [proprety, setProprety] = useState();

//   // We sort the propreties in a state for ease of iteration
//   const [propreties, setPropreties] = useState(Object.entries(_propreties).sort((a, b) => a[0] - b[0]))

//   // A useEffect listening for window size change
//   useEffect(() => {

//     // Handler for the resize
//     const resizeHandler = () => {
//         for (const [size, proprety] of Object.entries(propreties)) {
//             if (window.innerWidth > size)
//         }
//     }
//     window.addEventListener('resize')
//     return () => window.removeEventListener('resize')
//   }, [])
// }; 



// // The actual store hook
// const useMediaBreakpointsStore = create<useMediaBreakpointsStore>((set) => ({
//   proprety: "",
//   setProprety: (_proprety: any) =>
//     set((state) => {
//       return {
//         proprety: _proprety,
//       };
//     }),
// }));

export {}