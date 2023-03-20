import { address } from "../../types";
import { DBStrategy } from "../../types/db";
import { YCClassifications } from "../context/context";
import { YCNetwork } from "../network/network";
import { YCStep } from "../step/step";
import { YCToken } from "../token/token";
import { YCUser } from "../user/user";

export class YCStrategy {
  // =================
  //      FIELDS
  // =================
  address: address;
  title: string;
  depositToken: YCToken | null;
  creator: YCUser | null = null;
  steps: YCStep[];
  verified: boolean;
  network: YCNetwork | null;
  tvl: number;

  // =================
  //   CONSTRUCTOR
  // =================
  constructor(_strategy: DBStrategy, _context: YCClassifications) {
    this.address = _strategy.address;
    this.title = _strategy.title;
    this.depositToken = _context.getToken(_strategy.deposit_token_id) || null;
    this.creator = _context.getUser(_strategy.creator_id) || null;
    this.steps = _strategy.steps.map((step) => new YCStep(step, _context));
    this.verified = _strategy.verified;
    this.network = _context.getNetwork(_strategy.chain_id);
    this.tvl = Math.floor(Math.random() * 100000);
  }
}
