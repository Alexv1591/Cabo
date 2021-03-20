import { Card, RANK } from "./Card";
import { Hand } from "./Hand";
import { Player } from "./Player"
import { CaboRoom } from "../src/rooms/CaboRoom"
import { FirstState, SecondState } from "./TurnStates"
import { CardPack } from "./CardPack";

class OpponentHand extends Hand {

    constructor() { super(); }

    public addOpponentCard(index: number, card: Card) {
        if (card != null) {
            this.cards.set(index, card);
        }
    }

    public getMinimumIndex() {
        let cardsArray = Array.from(this.cards.entries());
        let minmum = this.getMinimumValue();
        let minEntry = cardsArray.find((entry: any) => { return (entry[1]).val == minmum })
        return minEntry[0];
    }

    public getMinimumValue(): number {
        return Math.min.apply(null, Array.from(this.cards.values()).map((card) => card.val));
    }

    public countBetterVal(val: number)//count the number of better cards in the hand compere to the given value
    {
        let cards = Array.from(this.cards.values());
        return cards.filter((card: any) => { return val > card.val }).length;
    }

    public toString() {
        let str: string = '[ ';
        for (let entry of this.cards.entries())
            str += "<" + entry[0] + "," + entry[1] + "> ";
        return str + "]";
    }

    public countKnown(): number {
        return this.cards.size;
    }

    public knowAllCards(): boolean {
        //TODO: update the number of cards for each player
        return this.indexes.length === 4;
    }

}

export class BotPlayer extends Player {
    private static _bot_index = 0;
    private _players: Map<string, OpponentHand>;
    private my_known_cards: Array<number>;
    private drwanCard: Card;
    constructor(private room: CaboRoom) {
        super();
        super._id = "AI" + (++BotPlayer._bot_index);
        this._players = new Map<string, OpponentHand>();
        this.my_known_cards = new Array<number>();
    }
    public initBotData(players: string[]) {
        for (let player of players.slice(1))
            this._players.set(player, new OpponentHand());
        this.my_known_cards.push(...[0, 1]);
    }

    public lookAtMyCard(index: number) {
        if ((this._hand.size - 1) < index)
            throw new Error("this bot don't have a card in index " + index);
        if (!this.my_known_cards.includes(index))
            this.my_known_cards.push(index);
        this.room.broadcast("card-clicked", { player: this.id, index: index });
    }
    private getMaximumEntry() {
        let max = -3;//smaller then the minmum value of card
        let maxIndex = -1;
        for (let known of this.my_known_cards) {
            let card = this.getCard(known);
            maxIndex = (max < card.val) ? known : maxIndex;
            max = (max < card.val) ? card.val : max;
        }
        return [maxIndex, max];
    }

    public async BotTurn() {
        console.log("Bot-Turn\tdiscard: " + await this.getTopOfDiscard());
        //dumpster diveS
        if ((await this.drawOrDive()) === FirstState.DUMPSTER_DIVE)
            if (this.keepOrDiscard(await this.getTopOfDiscard()) === SecondState.KEEP) {
                this.drwanCard = await this.getTopOfDiscard();
                this.keepCard(FirstState.DUMPSTER_DIVE);
                setTimeout(() => this.room.nextTurn(), 1000);
                return;
            }
        //draw from deck

        this.drwanCard = await this.room.drawCard(this);
        switch (this.keepOrDiscard(this.drwanCard)) {
            case SecondState.KEEP:
                this.keepCard(FirstState.DRAW);
                break;
            case SecondState.DISCARD:
                await this.discardCard();
                console.log("Bot:End known-mine: " + this.my_known_cards);
                this._players.forEach((hand, key) => { console.log("Bot:" + key + " " + hand); });
                break;
        }
        setTimeout(() => { this.room.nextTurn(); }, 1000);
    }

    private async discardCard() {
        if (this.drwanCard.isActionCard())
            await this.actionCard();
        this.room.toDiscard(this, this.drwanCard);
    }

    private async actionCard() {
        switch (this.drwanCard.rank) {
            case RANK.SEVEN:
            case RANK.EIGHT:
                await this.lookAtMyCard(this.randomUnknownIndex());
                break;
            case RANK.NINE:
            case RANK.TEN:
                await this.lookAtRandomOponentCard();
                break;
            case RANK.JACK:
                await this.swapsCards();
                break;
            case RANK.QUEEN:
                if (!this.allCardsAreKnown())
                    await this.lookAtMyCard(this.randomUnknownIndex());
                else
                    await this.lookAtRandomOponentCard();
                await this.lookAtRandomOponentCard();
                await this.swapsCards();
                break;
        }
    }

    private async lookAtRandomOponentCard() {
        let message = await this.getRandomOponentUnknownIndex();
        if (typeof message === "undefined")
            return;
        let card = await this.room.getCard(this, message);
        this._players.get(message.player).addOpponentCard(message.index, card);
        this._players.forEach((hand, key) => { console.log("Bot:" + key + " " + hand); });
    }

    private swapsCards() {
        let playersEntry = Array.from(this._players.entries()).filter((entry) => { return (entry[1].getMinimumValue()) < (this.getMaximumEntry()[1]); })
        if (playersEntry.length === 0)
            return;//TODO: Random swap!
        let minVals = <number[]>playersEntry.map((entry) => { return entry[1].getMinimumValue(); });
        let player = playersEntry[minVals.indexOf(Math.min(...minVals))];
        this.room.swapTwoCards(this, { players: [this.id, player[0]], cards: [this.getMaximumEntry()[0], player[1].getMinimumIndex()] });
    }

    private async getRandomOponentUnknownIndex() {
        let unknownOpponents = Array.from(this._players.entries()).filter((entry) => !entry[1].knowAllCards());
        if (unknownOpponents.length === 0)
            return;
        let randomPlayerEntry = unknownOpponents[CaboRoom.getRandomInt(unknownOpponents.length)];
        let unknownCards = [...Array(4).keys()].filter((index) => { return !(randomPlayerEntry[1].indexes.includes(index)); });//TODO: update the number of cards for each player
        let randomIndex = unknownCards[CaboRoom.getRandomInt(unknownCards.length)];
        return { player: randomPlayerEntry[0], index: randomIndex };

    }

    private randomUnknownIndex() {
        if (this.allCardsAreKnown())
            return 0;
        let unknownCards = this._hand.indexes.filter((index) => { return !this.my_known_cards.includes(index) });
        return unknownCards[CaboRoom.getRandomInt(unknownCards.length)];

    }

    private async keepCard(drawOrDive: FirstState) {
        let max_entry = this.getMaximumEntry();
        let indexForNew;
        if (this.drwanCard.val < max_entry[1])
            indexForNew = max_entry[0];
        else
            indexForNew = this.randomUnknownIndex();
        if (drawOrDive === FirstState.DRAW) {
            await this.room.takeFromDeck(this, this.drwanCard, indexForNew);
        }
        else
            await this.room.takeFromDiscard(this, indexForNew);
        if (!this.my_known_cards.includes(indexForNew))
            this.my_known_cards.push(indexForNew);
    }

    private async drawOrDive() {
        if (this.room.state.discard_pile.length > 0 && await this.shouldDumpsterDive()) {
            console.log("Bot:dumpster dive");
            return FirstState.DUMPSTER_DIVE;
        }
        else {
            console.log("Bot:draw");
            return FirstState.DRAW;
        }
    }

    private keepOrDiscard(card: Card): SecondState {
        if (!card.isActionCard() && card.val < this.getMaximumEntry()[1])
            return SecondState.KEEP;
        else if (card.val <= 4 && this.shouldGamble(card))
            return SecondState.KEEP;
        else
            return SecondState.DISCARD;
    }

    private shouldGamble(card: Card): boolean {
        if (this.allCardsAreKnown())
            return false;
        let betterInDeck = CardPack.howManyHaveBetterVal(card.val);
        let knownBetter = this.countKnownBetter(card.val);
        return ((betterInDeck - knownBetter) / (this.cntUnknownCards())) < 0.2;
    }
    private allCardsAreKnown() {
        return this.my_known_cards.length === 4;
    }

    private async getTopOfDiscard() {
        return this.room.state.discard_pile[this.room.state.discard_pile.length - 1];
    }
    private async shouldDumpsterDive() {
        let top_discard = await this.getTopOfDiscard();
        if (top_discard.val > 4)
            return false;
        if (this.room.state.num_of_players > 3 && top_discard.val === 4)
            return false;
        return this.oddsForBetterInDeck(top_discard.val) < 0.2;
    }
    private oddsForBetterInDeck(val: number) {
        let betterInDeck = CardPack.howManyHaveBetterVal(val);
        let knownBetter = this.countKnownBetter(val);
        return ((betterInDeck - knownBetter) / this.room.state.pack.size);
    }

    private cntUnknownCards() {
        //TODO: update the number of cards for each player
        let cnt = this.room.state.pack.size;
        for (let hand of this._players.values())
            cnt += 4 - hand.countKnown();
        cnt += (this._hand.size - this.my_known_cards.length);
        return cnt;

    }

    private countKnownBetter(val: number)//count how many of known card are better the givan value
    {
        let cnt;
        cnt = this.room.state.discard_pile.filter((card: Card) => card.val < val).length;
        for (let playerHand of this._players.values())
            cnt += playerHand.countBetterVal(val);
        cnt += this.countMineVal(val);
        return cnt;
    }
    private countMineVal(val: number) {
        let cnt = 0;
        for (let known of this.my_known_cards)
            if (this.getCard(known).val < val)
                cnt++;
        return cnt;
    }

    public notifyPlayerTakeFromDiscard(playerId: string, card: Card, index: number) {
        this._players.get(playerId).addOpponentCard(index, card);
    }

    public notifyPlayerDiscardCard(playerId: string, index: number) {
        this._players.get(playerId).removeCard(index);
    }

    public notfiyCardsSwap(players: string[], indexes: number[]) {
        if (!players.includes(this.id))
            this.othersSwaps(players, indexes);
        else
            this.swapWithMe(players, indexes);
    }

    private swapWithMe(players: string[], indexes: number[]) {
        let myIndex = players.indexOf(this.id);
        let new_card = this._players.get(players[1 - myIndex]).removeCard(indexes[1 - myIndex]);
        if (this.my_known_cards.includes(indexes[myIndex])) {//if the bot know the card that the other player take from it
            this._players.get(players[1 - myIndex]).addOpponentCard(indexes[1 - myIndex], this.getCard(indexes[myIndex]));
        }
        if (!new_card)//if the bot don't know the card it recive from the other player
            this.my_known_cards = this.my_known_cards.filter((index: number) => index != indexes[myIndex]);
    }

    private othersSwaps(players: string[], indexes: number[]) {
        let card0 = this._players.get(players[0]).removeCard(indexes[0]);
        let card1 = this._players.get(players[1]).removeCard(indexes[1]);
        this._players.get(players[0]).addOpponentCard(indexes[0], card1);
        this._players.get(players[1]).addOpponentCard(indexes[1], card0);
    }




}