import { Request, Response } from "express";
import PersonModel from "../models/PersonModel";

export const getByReportId = (req: Request, res: Response) => {
    const { reportId } = req.params;

    return PersonModel.find({ reportId })
        .select("-__v")
        .then((persons) =>
            persons.length
                ? res.status(200).json(persons)
                : res.status(404).json({ message: "Persons not found" })
        )
        .catch((error) => res.status(500).json({ error }));
};
