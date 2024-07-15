import { CommonModel } from "../models";

const getByReportId = async (reportId: string) => {
    return await CommonModel.findOne({ reportId }).select("-__v").exec();
};

export default { getByReportId };
