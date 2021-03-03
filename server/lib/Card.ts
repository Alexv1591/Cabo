import { Schema , type } from "@colyseus/schema";

export enum SUIT {
    HEART = 'HEART',
    DIAMOND = 'DIAMOND',
    CLUB = 'CLUB',
    SPADE = 'SPADE',
}
export enum RANK {
    ACE=1,
    TWO,
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
    JOKER
}

export class Card extends Schema{ // both NormalCard and Joker extends this class
    //@type("string")
    imagePath: string = "";
    protected static path_prefix="assets/Cards/";
    protected static path_postfix=".png";
    constructor(private _rank:RANK)
    { super()  }
    public get rank():RANK { return this._rank };
    
    public get val():number { return this.rank.valueOf(); }

    protected set img(imagePath:string){ this.imagePath=imagePath; }

    public get image(){ return this.imagePath; }
    
    public static CardFromPathFactory(path:string):Card
    {
        const card_regex=/^(CLUB|HEART|SPADE|DIAMOND)-([1-9][1-3]?)/;
        path=path.replace(this.path_prefix,"").replace(this.path_postfix,"");
        if(!card_regex.test(path) && path!=="JOKER-1")
            throw path + " is not legal card path";
        if(path=="JOKER-1")
            return new Joker();
        let suit=path.match(card_regex)[1],rank=parseInt(path.match(card_regex)[2]);
        switch(suit){
            case(SUIT.HEART):
                return new NormalCard(rank,SUIT.HEART);
            case(SUIT.CLUB):
                return new NormalCard(rank,SUIT.CLUB);
            case(SUIT.SPADE):
                return new NormalCard(rank,SUIT.SPADE);
            case(SUIT.DIAMOND):
                return new NormalCard(rank,SUIT.DIAMOND);
            default:
                throw "somthing went worng while trying to create a card";

        }
    }
}

export class NormalCard extends Card{
    constructor(card_number: RANK, private card_suit :SUIT) {
        super(card_number);
        if(this.rank===RANK.JOKER)
            throw "Joker is'nt a regular card. It has a class for its own"
        super.img = Card.path_prefix+card_suit+'-'+card_number+Card.path_postfix;
    }

    public get suit() :SUIT { return this.card_suit; }

    public get val():number{
        if(this.rank===RANK.KING && ( this.suit===SUIT.HEART || this.suit===SUIT.DIAMOND)) // black king
            return -2;
        return super.val;
        
    }

    public toString() {
        return this.rankNumToLetter() + this.suitToSymbol();
    }

    private rankNumToLetter() {
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
export class Joker extends Card{
    constructor()
    {
        super(RANK.JOKER);
        
        super.img =Card.path_prefix+ "JOKER-1"+Card.path_postfix;
    }

    public get val()
    {
        return -1;
    }

    public toString() {
        return "JOKER";
    }
}
