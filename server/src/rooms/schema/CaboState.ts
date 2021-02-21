import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

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