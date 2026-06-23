import { Request, Response } from "express";
import * as service from "./members.service";

/* ---------------- CREATE MEMBER ---------------- */
export const createMemberController = async (
  req: Request,
  res: Response
) => {
  console.log("Data: ", req.body);
  try {
    const data = await service.createMember(req.body);
    
    return res.status(201).json(data);
  } catch (err: any) {
    return res.status(400).json({
      message: err.message || "Failed to create member",
    });
  }
};

/* ---------------- UPDATE MEMBER ---------------- */
export const updateMemberController = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await service.updateMember(
      Number(req.params.id),
      req.body
    );

    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(400).json({
      message: err.message || "Failed to update member",
    });
  }
};

/* ---------------- DELETE MEMBER ---------------- */
export const deleteMemberController = async (
  req: Request,
  res: Response
) => {
  try {
    await service.deleteMember(Number(req.params.id));

    return res.status(200).json({
      message: "Member deleted",
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message || "Failed to delete member",
    });
  }
};

/* ---------------- GET ALL MEMBERS ---------------- */
export const getMembersController = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await service.getMembers(req.query);
    return res.status(200).json(data);

  } catch (err: any) {
    return res.status(500).json({
      message: err.message || "Failed to fetch members",
    });
  }
};

/* ---------------- GET MEMBER BY ID ---------------- */
export const getMemberByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await service.getMemberById(
      Number(req.params.id)
    );

    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(404).json({
      message: err.message || "Member not found",
    });
  }
};

export const resendActivationController = async (
  req: Request,
  res: Response
) => {
  try {
    console.log(req.body);
    const { email } = req.body;
    console.log(email)

    const result = await service.resendActivationCode(email);

    res.json(result);
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Failed to resend activation code",
    });
  }
};