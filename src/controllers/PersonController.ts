import { Request, Response } from "express";
import PersonService from "../services/PersonService";

export const getByReportId = async (req: Request, res: Response) => {
    const { reportId } = req.params;

    try {
        const persons = await PersonService.getByReportId(reportId);

        return persons.length
            ? res.status(200).json(persons)
            : res.status(404).json({ message: "Persons not found" });
    } catch (error) {
        return res.status(500).json({ error });
    }
};
