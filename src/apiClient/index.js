export * from "./semester";
export * from "./chapter";

export const dummyRequest = (success) => {
  return new Promise((resolve, reject) =>
    setTimeout(
      () => (success ? resolve() : reject("Something went wrong.")),
      2000
    )
  );
};

export const errCallback = (cb) => (err) => {
  if (cb) cb("Something went wrong.");
  console.error(err);
};
