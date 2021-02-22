import { Schema } from "@colyseus/schema";

export enum SUIT {
    HEART = 'Heart',
    DIAMOND = 'Diamond',
    CLUB = 'Club',
    SPADE = 'Spade'
}
export enum RANK {
    TWO = 2,
    THREE,
    FOUR,
    FIVE,
    SIX,
    SEVEN,
    EIGHT,
    NINE,
    TEN,
    JACK,
    QUEEN,
    KING,
    ACE,
    JOKER,
}

export class CardInterface extends Schema { // both Card and Joker extends this class
    private imagePath: string = "";
    constructor(private _rank:RANK)
    { super()  }
    public get rank():RANK { return this._rank };
    
    public get val():number { return this.rank.valueOf(); }
}

export class Card extends CardInterface{
    constructor(card_number: RANK, private card_suit :SUIT) {
        super(card_number);
        if(this.rank===RANK.JOKER)
            throw "Joker is'nt a regular card. It has a class for its own"
        //super.imagePath = "cards/" + card_suit + (this.card_number>10)?transformPipNumToLetter(this.card_number):this.card_number + ".png";
    }

    public get suit() :SUIT { return this.card_suit; }

    public get val():number{
        if(this.rank===RANK.KING && ( this.suit===SUIT.HEART || this.suit===SUIT.DIAMOND)) // black king
            return -2;
        if(this.rank===RANK.ACE)
            return 1;
        return super.val;
        
    }

//    public get img() : string {return this.imagePath}

    public toString() {
        return this.rankNumToLetter() + this.suitToSymbol();
    }

    private rankNumToLetter() {
        let ret_val='';
        if(this.rank.valueOf()<=10)
            return this.rank.valueOf();
        switch (this.rank) {
            case RANK.JACK:
                return 'J';
            case RANK.QUEEN:
                return 'Q';
            case RANK.KING:
                return 'K';
            case RANK.ACE:
                return 'A';
            default:
                throw "the world is completely false (card number error)";
        }
    }
    
    private suitToSymbol() {
        switch (this.suit) {
            case SUIT.HEART:
                return "\u2665";
            case SUIT.DIAMOND:
                return "\u2666";
            case SUIT.CLUB:
                return "\u2663";
            case SUIT.SPADE:
                return "\u2660";
            default:
                return "?";
        }
    
    }
}
export class Joker extends CardInterface{
    constructor()
    {
        super(RANK.JOKER);
        //add img path
    }

    public get val()
    {
        return -1;
    }

    public toString() {
        return "JOKER";
    }

}
