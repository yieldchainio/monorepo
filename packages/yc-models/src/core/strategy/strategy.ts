import { address } from "../../types";
import { DBStrategy } from "../../types/db";
import { YCClassifications } from "../context/context";
import { YCStep } from "../step/step";
import { YCToken } from "../token/token";
import { YCUser } from "../user/user";

export class YCStrategy {
  // =================
  //      FIELDS
  // =================
  #address: address;
  #title: string;
  #depositToken: YCToken | null;
  #creator: YCUser | null;
  #steps: YCStep[];

  // =================
  //   CONSTRUCTOR
  // =================
  constructor(_strategy: DBStrategy, _context: YCClassifications) {
    console.log("New YC Strategy");
    this.#address = _strategy.address;
    this.#title = _strategy.title;
    this.#depositToken = _context.getToken(_strategy.deposit_token_id) || null;
    this.#creator = _context.getUser(_strategy.creator_id) || null;
    console.log("Strategy got creator:", !!this.#creator);
    this.#steps = _strategy.steps.map((step) => new YCStep(step, _context));
  }

  // =================
  //     METHODS
  // =================

  get creator(): YCUser | null {
    return this.#creator;
  }

  get steps(): YCStep[] {
    return this.#steps;
  }

  get address(): address {
    return this.#address;
  }

  get depositToken(): YCToken | null {
    return this.#depositToken;
  }

  get title(): string {
    return this.#title;
  }
}
