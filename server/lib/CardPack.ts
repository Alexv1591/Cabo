import { Schema } from "@colyseus/schema";
import {SUIT,RANK,CardInterface,Card,Joker} from "./Card"
export class CardPack extends Schema
{ 
    private deck:Array<CardInterface>;

    constructor()
    {
        super();
        this.deck = new Array<CardInterface>();
        this.createDeck();
        this.shuffle();
    }
    private createDeck() : void
    {
        for( let i= RANK.TWO; i<RANK.JOKER ; i++ )
        {
            Object.keys(SUIT).forEach(suit=>{
                this.deck.push(new Card(i,SUIT[suit as keyof typeof SUIT]));
            });
        }
        for(let i=0;i<2;i++){
            this.deck.push(new Joker());
        }
    }
    private shuffle()
    {
        for( let i=this.deck.length-1 ; i>0 ; i-- )
        {
            let j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
        return this.deck;
    }
    public draw()
    {
        return this.deck.shift();
    }
}