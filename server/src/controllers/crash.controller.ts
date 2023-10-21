import GameHistoryModel from "../models/GameHistory";
import BetHistoryModel from "../models/BetHistory";

const crashController = {
  getMyBet: async (req: any, res: any) => {
    const result: any = await BetHistoryModel.find({
      address: req.user.user.address,
    })
      .sort({ time: -1 })
      .limit(10);
    res.send(result);
  },
  getHistory: async (req: any, res: any) => {
    const result: any = await GameHistoryModel.find()
      .sort({ time: -1 })
      .limit(10);
    res.send(result);
  },
  getTopPlayers: async (req: any, res: any) => {
    try {
      const { start, end } = req.body;
      const bets: any = await BetHistoryModel.find({
        chain: "betabone",
        time: { $gt: new Date(start), $lt: new Date(end) },
      });
      let wager: any = {};
      bets.map((bet: any) => {
        if (wager[bet.address]) wager[bet.address] += bet.betAmount;
        else wager[bet.address] = bet.betAmount;
      });
      let result = Object.keys(wager).map((key: string)=> ({address: key, wager: wager[key]}));
      res.send(wager);
    } catch (err) {
      res.
    }
  },
};

export default crashController;
