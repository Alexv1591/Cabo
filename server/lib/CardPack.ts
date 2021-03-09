import { Schema , ArraySchema,type} from "@colyseus/schema";
import {SUIT,RANK,Card,NormalCard,Joker} from "./Card"
export class CardPack extends Schema
{ 
    @type([Card])
    deck:ArraySchema<Card> =new ArraySchema<Card>();

    constructor()
    {
        super();
        this.createDeck();
        this.shuffle();
    }
    private createDeck() : void
    {
        for( let i= RANK.ACE; i<RANK.JOKER ; i++ )
        {
            Object.keys(SUIT).forEach(suit=>{
                this.deck.push(new NormalCard(i,SUIT[suit as keyof typeof SUIT]));
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
    public get empty():boolean{
        return this.deck.length==0;
    }
}