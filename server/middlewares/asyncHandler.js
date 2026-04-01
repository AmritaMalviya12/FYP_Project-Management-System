// export const asyncHandler = (theFunction) => (req,res,next) => {
//     Promise.resolve(theFunction(req,res,next)).catch(next);
// };

// export const asyncHandler = (theFunc) => {
//   return (req, res, next) => {
//     Promise.resolve(theFunc(req, res, next))
//       .catch(next);
//   };
// };

export const asyncHandler = (fn) =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch((err) => next(err));
  };