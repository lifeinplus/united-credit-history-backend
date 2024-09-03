import { LoanModel } from "../models";
import DelinquencyService from "./DelinquencyService";
import FlcService from "./FlcService";
import PaymentHistoryService from "./PaymentHistoryService";

const getByReportId = async (reportId: string) => {
    return await LoanModel.find({ reportId }).select("-__v").exec();
};

const getFullByReportId = async (reportId: string) => {
    const loans = await LoanModel.find({ reportId })
        .lean()
        .select("-__v")
        .exec();

    const loanIds = loans.map((loan) => loan._id);
    const delinquencies = await DelinquencyService.getByLoanIds(loanIds);
    const flcs = await FlcService.getByLoanIds(loanIds);
    const paymentHistories = await PaymentHistoryService.getByLoanIds(loanIds);

    const dateFormat = new Intl.DateTimeFormat("ru", {
        month: "numeric",
        year: "numeric",
        timeZone: "Europe/Moscow",
    });

    return loans.map((loan) => {
        const delinquency = delinquencies.find((item) =>
            loan._id.equals(item.loanId)
        );

        const flc = flcs.find((item) => loan._id.equals(item.loanId));

        const filteredHistory = paymentHistories.filter((item) =>
            loan._id.equals(item.loanId)
        );

        const firstPaymentDate = filteredHistory.reduce((result, { date }) => {
            return result > date ? date : result;
        }, filteredHistory[0]?.date);

        const reducedHistory = filteredHistory.reduce((result, item) => {
            const milliseconds = Date.parse(item.date);
            const name = dateFormat.format(milliseconds) as keyof typeof loan;
            return { ...result, [name]: item.status };
        }, {});

        const historyLoan = { ...loan, firstPaymentDate, ...reducedHistory };

        return { ...historyLoan, ...delinquency, ...flc };
    });
};

export default { getByReportId, getFullByReportId };
