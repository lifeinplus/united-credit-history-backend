import { PersonModel } from "../models";

const getByReportId = async (reportId: string) => {
    return await PersonModel.find({ reportId }).select("-__v").exec();
};

export default { getByReportId };
