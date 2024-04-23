import jet from "../../defs";

jet.define("Error", Error, {
    create:Error,
    rnd:(...a)=>new Error(jet.rnd.String(...a)),
    to:{
        Function:err=>_=>err
    }
});
