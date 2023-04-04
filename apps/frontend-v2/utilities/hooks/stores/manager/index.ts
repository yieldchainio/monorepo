// /**
//  * A generic stores instances manager hook
//  */

// import { create , StoreApi} from "zustand";
// import { MappedStoresManager } from "../types";
// import { persist, createJSONStorage } from 'zustand/middleware'

// export const useManager = <T extends Record<any, any>>(
//   id: string,
//   shouldPersist: boolean = true
// ) =>

//   create<MappedStoresManager<T>>(!shouldPersist ? (set, get) => ({
//     instances: new Map(),
//     addStore: (id?: string) =>
//       set((state) => {
//         const newInstances = new Map(get().instances);
//         const oldInstance = newInstances.get(id);
//         newInstances.set(id, oldInstance || )
//         return { instances: newInstances };
//       }),
//       removeStore: (id: string) => set((state) => ({
//         instances: get().instances.delete(id)
//       }))
//   }) : persist({

//   }));
export {};
