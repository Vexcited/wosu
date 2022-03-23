import type { Request, Response } from "express";
type ExpressRoute = (req: Request, res: Response) => Promise<void>;

export const get_matchs: ExpressRoute = async (req, res) => {
  res.status(200).json({
    success: true,
    matchs: []
  });
};