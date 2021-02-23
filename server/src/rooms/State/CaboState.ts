import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

import { CardPack } from "../../../lib/CardPack"
import { Card } from "../../../lib/Card"
import { Player } from "../../../lib/Player"

export class CaboState extends Schema {
  
  @type("string")
  currentTurn:string = "";

  @type({map: Player})
  players:MapSchema<Player>=new MapSchema<Player>();

  @type("number")
  numOfPlayer:number;

  @type([Card])
  discard_pile:ArraySchema<Card> =new ArraySchema<Card>();
  
  @type(CardPack)
  pack:CardPack=new CardPack();


}