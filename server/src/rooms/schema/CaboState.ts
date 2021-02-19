import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

export class CaboState extends Schema {

  @type({map: Player})
  players=new MapSchema<Player>();

  @type("number")
  numOfPlayer:number;

  @type("string")
  currentTurn = "";

  @type([Card])
  discard_pile=new ArraySchema<Card>();

}