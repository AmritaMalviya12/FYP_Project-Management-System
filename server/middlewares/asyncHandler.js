// export const asyncHandler = (theFunction) => (req,res,next) => {
//     Promise.resolve(theFunction(req,res,next)).catch(next); //send it to the errorhandler middleware
// };

// export const asyncHandler = (theFunc) => {
//   return (req, res, next) => {
//     Promise.resolve(theFunc(req, res, next))
//       .catch(next);
//   };
// };

export const asyncHandler = (fn) =>
  (req, res, next) => {  //this is middleware 
    Promise.resolve(fn(req, res, next))
      .catch((err) => next(err));
  };