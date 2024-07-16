import { FlcModel } from "../models";

export const getByLoanIds = async (loanIds?: string | string[]) => {
    return await FlcModel.find({ loanId: { $in: loanIds } })
        .lean()
        .select("-__v")
        .exec();
};

export default { getByLoanIds };
