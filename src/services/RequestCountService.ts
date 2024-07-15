import { RequestCountModel } from "../models";

const getByReportId = async (reportId: string) => {
    return await RequestCountModel.findOne({ reportId }).select("-__v").exec();
};

export default { getByReportId };
