import { Card } from "./Card";
import { Heap } from "collections/heap"
export class Hand {
    private cards:Map<number,Card>;
    private freeKeys:Heap<number>;
    constructor() 
    {
        this.freeKeys=new Heap([...Array(10).keys()],null,(a,b)=> {return b-a;})
        this.cards=new Map<number,Card>()
    }

    public addCard(card:Card):void
    {
        this.cards.set(this.freeKeys.pop(),card);
    }

    public removeCard(key:number) : void
    {
        this.cards.delete(key);
        this.freeKeys.push(key);
    }

    public getCard(key:number) : Card
    {
        if(!this.cards.has(key))
            throw "This Hand don't have a card in index "+key;
        return this.cards[key];
    }

    public get val() :number {
        let sum=0;
        this.cards.forEach((value)=>{sum+=value.val;})
        return sum;
    }

    public getNumOfCards():number
    {
        return this.cards.size;
    }
    
}