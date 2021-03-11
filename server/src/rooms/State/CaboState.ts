import { Schema, type,ArraySchema, } from "@colyseus/schema";
import { Card } from "../../../lib/Card";
import { CardPack } from "../../../lib/CardPack";
import { Player } from "../../../lib/Player"

export class CaboState extends Schema {
  
  @type("string")
  currentTurn:string = "";

  @type([Player])
  players:ArraySchema<Player>=new ArraySchema<Player>();

  @type("number")
  num_of_players:number;

  @type([Card])
  discard_pile:ArraySchema<string>=new ArraySchema<string>();
  
  @type(CardPack)
  pack:CardPack=new CardPack();

  constructor(numOfPlayers:number){
    super();
    this.num_of_players=numOfPlayers;
  }
}