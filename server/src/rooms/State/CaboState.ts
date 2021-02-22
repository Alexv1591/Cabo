import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

import { CardPack } from "../../../lib/CardPack"
import { CardInterface } from "../../../lib/Card"

export class CaboState extends Schema {
  
  @type("string")
  currentTurn:string = "";

  @type({map: Player})
  players:MapSchema<Player>=new MapSchema<Player>();

  @type("number")
  numOfPlayer:number;

  @type([CardInterface])
  discard_pile:ArraySchema<CardInterface> =new ArraySchema<CardInterface>();
  
  @type(CardPack)
  pack:CardPack=new CardPack();


}