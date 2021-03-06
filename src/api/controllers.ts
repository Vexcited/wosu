import type { Request, Response } from "express";
type ExpressRoute = (req: Request, res: Response) => Promise<void>;

export const get_matchs: ExpressRoute = async (req, res) => {
  const filters = req.query;

  res.status(200).json({
    success: true,
    matchs: [],
    filters
  });
};
