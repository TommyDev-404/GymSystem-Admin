import { Request, Response } from "express";
import * as service from "./payment.service";


export const getMemberPaymentHistoryController = async (req: Request, res: Response) => {

  try {
    const member_id = Number(req.params.member_id);

    if (!member_id) {
      return res.status(400).json({
        message: "Member ID is required",
      });
    }

    const data = await service.getMemberPaymentHistoryService(
      member_id
    );

    return res.status(200).json(data);

  } catch(error:any){

    console.error(
      "Get member payment history controller error:",
      error
    );


    return res.status(500).json({
      success:false,
      message:"Failed to fetch payment history",
      error:error.message,
    });

  }

};