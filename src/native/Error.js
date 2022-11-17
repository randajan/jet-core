import jet from "../jet";

export default jet.define("Error", Error, {
    create:Error,
    rnd:(...a)=>new Error(jet.rnd.String(...a)),
    to:{
        Function:err=>_=>err
    }
});
