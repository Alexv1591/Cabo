import { Card } from "./Card";
var  Heap = require( "collections/heap");
export class Hand {
    protected cards:Map<number,Card>;
    private freeKeys:any;//Heap
    constructor() 
    {
        this.freeKeys=new Heap([...Array(8).keys()],null,(a:number,b:number)=> {return b-a;})
        this.cards=new Map<number,Card>()
    }
    public get indexes(){
        return Array.from(this.cards.keys());
    }
    public addCard(card:Card):void
    {
        this.cards.set(this.freeKeys.pop(),card);
    }
    public get size(){
        return this.cards.size;
    }
    public removeCard(key:number) : Card
    {
        let card:Card=null;
        if(this.cards.has(key)){
            card=this.getCard(key);
            this.cards.delete(key);
            this.freeKeys.push(key);
        }
        return card;   
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

    public toString() :string {
        let str:string="[";
        this.cards.forEach((value)=>{
            str+=value+ " ";
        });
        return str+']';
    }

    public swapCard(new_card:Card,key:number):Card{
        if(!this.cards.has(key))
            throw "This Hand don't have a card in index "+key;
        let swaped_card=this.getCard(key);
        this.cards.set(key,new_card);
        return swaped_card;
    }
    
}
