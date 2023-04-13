/**
 * Constants / Utils for the Strategy Creation Layout
 */

// The config routes, in order
export const configRoutes: {
  route: string;
  progressStep: { image: string; label: string };
}[] = [
  {
    route: "/title",
    progressStep: {
      image: "",
      label: "Choose Title",
    },
  },
  {
    route: "/network",
    progressStep: {
      image: "",
      label: "Choose Network",
    },
  },
  {
    route: "/token",
    progressStep: {
      image: "",
      label: "Choose Token",
    },
  },
  {
    route: "/privacy",
    progressStep: {
      image: "",
      label: "Choose Privacy",
    },
  },

  {
    route: "/base",
    progressStep: {
      image: "",
      label: "Assemble Base Steps",
    },
  },
  {
    route: "/steps",
    progressStep: {
      image: "",
      label: "Build Steps",
    },
  },
];
