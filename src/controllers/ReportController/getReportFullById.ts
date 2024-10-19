import { Request, Response } from "express";

import Logging from "../../library/Logging";
import { ReportModel } from "../../models";
import CommonService from "../../services/CommonService";
import LoanService from "../../services/LoanService";
import PersonService from "../../services/PersonService";
import RequestCountService from "../../services/RequestCountService";

const getReportFullById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const report = await ReportModel.findById(id)
            .lean()
            .select("-__v")
            .exec();

        const commons = await CommonService.getByReportId(id);
        const loans = await LoanService.getFullByReportId(id);
        const requestCounts = await RequestCountService.getByReportId(id);
        const persons = await PersonService.getByReportId(id);

        const result = { ...report, commons, loans, requestCounts, persons };

        return report
            ? res.status(200).json(result)
            : res.status(404).json({ message: "Report not found" });
    } catch (error) {
        Logging.error(error);
        return res.status(500).json({ error });
    }
};

export default getReportFullById;
