import { Schema } from "@colyseus/schema";
import { Client } from "colyseus";

import { Hand } from "./Hand"
import { Card } from "./Card"

export class Player extends Schema{
    
    private hand : Hand;

    constructor(private serverClient: Client)
    {
        super();
        this.hand=new Hand();
    }

    public addCard(card:Card) : void{
        this.hand.addCard(card);
    }

    public removeCard(key:number): Card
    {
        let removedCard=this.getCard(key);
        this.hand.removeCard(key);
        return removedCard;
    }

    public getCard(key:number){
        return this.hand.getCard(key);
    }

    public getPoints() : number
    {
        return this.hand.val;
    }
}