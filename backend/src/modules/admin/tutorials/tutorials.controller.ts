import { Request, Response } from "express";
import * as service from "./tutorials.service";

export const createTutorial = async (req: Request, res: Response) => {
  try {
    const body = req.body;
     const files = req.files as Express.Multer.File[];
     
    const result = await service.createTutorialService(body, files);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Upload failed" });
  }
};

export const getAllTutorials = async (req: Request, res: Response) => {
  try {
    const result = await service.getAllTutorialsService(req.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve tutorials" });
  }
};

export const updateTutorialController = async (
  req: Request,
  res: Response
) => {
  console.log("Tutorial update body: ", req.body);
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid tutorial id",
      });
    }

    const files = req.files as Express.Multer.File[] || [];

    const result = await service.updateTutorialService(
      id,
      req.body,
      files
    );

    return res.status(200).json(result);

  } catch (error: any) {

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update tutorial",
    });
  }
};

export const removeTutorialController = async (req: Request, res: Response) => {
 try {
    const result = await service.removeTutorialService(Number(req.params.id));
    return res.status(200).json(result);
    
  } catch (error) {
    res.status(500).json({ error: "Failed to remove tutorials" });
  }
}