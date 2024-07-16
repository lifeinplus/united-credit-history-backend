import { PaymentHistoryModel } from "../models";

export const getByLoanIds = async (loanIds?: string | string[]) => {
    return await PaymentHistoryModel.find({ loanId: { $in: loanIds } })
        .lean()
        .select("-__v")
        .exec();
};

export default { getByLoanIds };
