//high order function to handle async errors in express routes


// it wraps async route functions so any thrown error or rejected
//  promise is passed to your global error handler automatically.
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
    .catch((err) => next(err));


}




export { asyncHandler };




// using async and await appropach

// const asyncHandler = (fn)=>async (req,res,next)=>{
//     try{

//     await fn(req,res,next)

//     } catch(err){
//             res.status(err.code || 500).json({
//                 success : false,
//                 message : err.message || "Internal Server Error"
//             })

//     }

// }