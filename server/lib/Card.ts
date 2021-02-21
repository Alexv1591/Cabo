enum SUIT {
    HEART = 'Heart',
    DIAMOND = 'Diamond',
    CLUB = 'Club',
    SPADE = 'Spade'
}
enum RANK {
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
    ACE
}

class Card {
    private imagePath: string = "";
    constructor(private card_number: RANK, private card_suit :SUIT) {
        //this.imagePath = "cards/" + card_suit + (this.card_number>10)?transformPipNumToLetter(this.card_number):this.card_number + ".png";
    }

    public get rank():RANK { return this.card_number };

    get suit() :SUIT { return this.card_suit; }

    toString() {
        return ((this.card_number > 10) ? transformPipNumToLetter(this.card_number) : this.card_number) + SuitToSymbol(this.card_suit);
    }
}
function transformPipNumToLetter(card_number) {
    switch (card_number) {
        case 11:
            card_number = 'J';
            break;
        case 12:
            card_number = 'Q';
            break;
        case 13:
            card_number = 'K';
            break;
        case 14:
            card_number = 'A';
            break;
        default:
            throw "the world is completely false (card number error)";
            break;
    }
    return card_number;
}

function SuitToSymbol(card_suit) {
    switch (card_suit) {
        case SUIT.HEART:
            return "\u2665";
        case SUIT.DIAMOND:
            return "\u2666";
        case SUIT.CLUB:
            return "\u2663";
        case SUIT.SPADE:
            return "\u2660"
        default:
            return "?"
    }

}

let card :Card = new Card(12,SUIT.HEART);
console.log(card);
