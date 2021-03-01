import { Card } from "./Card";
var  Heap = require( "collections/heap");
export class Hand {
    private cards:Map<number,Card>;
    private freeKeys:any;//Heap
    constructor() 
    {
        this.freeKeys=new Heap([...Array(8).keys()],null,(a:number,b:number)=> {return b-a;})
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
        return this.cards.get(key);
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

    public toString() :string {
        let str:string="[";
        this.cards.forEach((value)=>{
            str+=value+ " ";
        });
        return str+']';
    }
    
}
