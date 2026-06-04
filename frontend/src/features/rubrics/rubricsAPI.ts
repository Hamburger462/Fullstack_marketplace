import { baseApi } from "../../shared/api/baseApi";
// import { type Rubric } from "../../entities/rubric/model/types";

export const getAllRubrics = async () => {
    try{
        const response = await baseApi.get("/rubrics/");
        console.log(response);
        return response.data;
    }
    catch(err){
        console.error(err);
    }
}