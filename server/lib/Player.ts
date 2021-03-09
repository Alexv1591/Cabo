import { Schema } from "@colyseus/schema";
import { Client } from "colyseus";

import { Hand } from "./Hand"
import { Card } from "./Card"

export class Player extends Schema{
    
    protected _id:string;
    protected _hand : Hand;

    constructor()
    {
        super();
        this._hand=new Hand();
    }
    public get id(){
        return this._id;
    } 

    public addCard(card:Card) : void{
        this._hand.addCard(card);
    }

    public removeCard(key:number): Card
    {
        let removedCard=this.getCard(key);
        this._hand.removeCard(key);
        return removedCard;
    }

    public swapCard(card:Card,index:number):Card
    {
        return this._hand.swapCard(card,index);
    }

    public getCard(key:number){
        return this._hand.getCard(key);
    }

    public getPoints() : number
    {
        return this._hand.val;
    }

    public toString() :string {
        return this.id+": "+this._hand.toString();
    }

}
