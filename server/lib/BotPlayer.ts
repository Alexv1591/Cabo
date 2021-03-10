import { Card, RANK } from "./Card";
import { Hand } from "./Hand";
import { Player } from "./Player"
import { CaboRoom } from "../src/rooms/CaboRoom"
import {FirstState,SecondState} from "./TurnStates"
import { CardPack } from "./CardPack";

class OpponentHand extends Hand {

    constructor() { super(); }

    public addOpponrntCard(index: number, card: Card) {
        this.cards.set(index, card);
    }

    public getMinimumIndex() {
        let cardsArray = Array.from(this.cards.entries());
        let minmum = this.getMinimumValue();
        let minEntry = cardsArray.find((entry:any) => { return (entry[1]).val == minmum })
        return minEntry[0];
    }

    public getMinimumValue(): number {
        return Math.min.apply(null, Array.from(this.cards.values()).map((card) => card.val));
    }

    public countBetterVal(val:number)//count the number of butter cards in the hand compere to the given value
    {
        let cards=Array.from(this.cards.values());
        return cards.filter((card:any)=>{return val>card.val}).length;
    }
}

export class BotPlayer extends Player {
    private static _bot_index = 0;
    private _players: Map<string, OpponentHand>;
    private my_known_cards: Array<number>;
    private recentCard:Card;
    constructor(private room: CaboRoom) {
        super();
        super._id = "AI" + (++BotPlayer._bot_index);
        this._players=new Map<string,OpponentHand>();
        this.my_known_cards=new Array<number>();
    }
    public initBotData(players: string[]) {
        for (let player of players.slice(1))
            this._players.set(player, new OpponentHand());
        this.my_known_cards.push(...[0,1]);
    }

    public lookAtMyCard(index: number) {
        if ((super._hand.getNumOfCards() - 1) < index)
            throw new Error("this bot don't have a card in index " + index);
        this.my_known_cards.push(index);
        this.room.broadcast("card-clicked",{player:this.id,index:index});
    }
    private getMaximumEntry() {
        let max = -3;//smaller then the minmum value of card
        let maxIndex = -1;
        for (let known of this.my_known_cards) {
            let card = this.getCard(known);
            max = (max < card.val) ? card.val : max;
            maxIndex = (max < card.val) ? known : maxIndex;
        }
        return [maxIndex,max];
    }

    public async BotTurn() {
        console.log("Bot Turn");
        let firstState=await this.drawOrDive();
        console.log("AI:"+firstState);
        //this.recentCard=await this.drawOrDive();
        //let choice=this.keepOrDiscard();
        // switch(this.d){
        //     case SecondState.KEEP:
        //       this.keepCard();
        //       break;
        //     case SecondState.DISCARD:
        //         this.discardCard();
            
        // }
        this.room.nextTurn();
    }

    private async discardCard(){
        if(this.recentCard.isActionCard())
            this.actionCard();
        
    }

    private async actionCard(){
        switch(this.recentCard.rank){
            case RANK.SEVEN:
            case RANK.EIGHT:
                this.lookAtMyCard
                
        }
    }
     

    private randomUnknownIndex(){
        
    }

    private async keepCard(){
        let index=this.getMaximumEntry()[0]
        let discard=this.swapCard(this.recentCard,index);
        this.room.state.discard_pile.push(discard.image);
        this.room.broadcast("player-take-from-deck", { player: this.id, index: index, card:discard.image });
    }
    private async drawOrDive(){
        if(this.room.state.discard_pile.length>0 && await this.shouldDumpsterDive()){
            console.log("dumpster dive");
            return FirstState.DUMPSTER_DIVE;
        }
        else{
            console.log("draw");
            return FirstState.DRAW;
            // this.room.broadcast("player-draw-card",this.id);
            // return this.room.state.pack.draw();
        }
    }

    private keepOrDiscard():SecondState{
        //TODO: somthing smarter then that
        if(!this.recentCard.isActionCard() && this.recentCard.val<this.getMaximumEntry()[1])
            return SecondState.KEEP;
        // else if(this.shouldGamble())
        //     return SecondState.KEEP;
        else
            return SecondState.DISCARD;
    }
    private async getTopOfDiscard(){
        return this.room.state.discard_pile[this.room.state.discard_pile.length-1];
    }
    private async shouldDumpsterDive(){
        let top_discard=await this.getTopOfDiscard();
        if(top_discard.val>4)
            return false;
        if(this.room.state.num_of_players>3 && top_discard.val===4)
            return false;
        return this.oddsForBetterInDeck(top_discard.val)<0.2; 
    }
    private oddsForBetterInDeck(val:number){
        let betterInDeck=CardPack.howManyHaveButterVal(val);
        let knownButter=this.countKnownButter(val);
        return ((betterInDeck-knownButter)/this.room.state.pack.size);
    }

    private countKnownButter(val:number)//count how many of known card are butter the givan value
    {
        let cnt;
        cnt=this.room.state.discard_pile.filter((card:Card)=>card.val<val).length;
        for(let playerHand of this._players.values())
            cnt+=playerHand.countBetterVal(val);
        cnt+=this.countMineVal(val);
        return cnt;
    }
    private countMineVal(val:number){
        let cnt=0;
        for (let known of this.my_known_cards)
            if(this.getCard(known).val<val)
                cnt++;
        return cnt;
    }

}