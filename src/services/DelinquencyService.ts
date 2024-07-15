import { DelinquencyModel } from "../models";

const getByLoanIds = async (loanIds?: string | string[]) => {
    return await DelinquencyModel.find({
        loanId: { $in: loanIds },
    })
        .lean()
        .select("-__v")
        .exec();
};

export default { getByLoanIds };
