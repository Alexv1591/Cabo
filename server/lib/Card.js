var SUIT;
(function (SUIT) {
    SUIT["HEART"] = "Heart";
    SUIT["DIAMOND"] = "Diamond";
    SUIT["CLUB"] = "Club";
    SUIT["SPADE"] = "Spade";
})(SUIT || (SUIT = {}));
var RANK;
(function (RANK) {
    RANK[RANK["TWO"] = 2] = "TWO";
    RANK[RANK["THREE"] = 3] = "THREE";
    RANK[RANK["FOUR"] = 4] = "FOUR";
    RANK[RANK["FIVE"] = 5] = "FIVE";
    RANK[RANK["SIX"] = 6] = "SIX";
    RANK[RANK["SEVEN"] = 7] = "SEVEN";
    RANK[RANK["EIGHT"] = 8] = "EIGHT";
    RANK[RANK["NINE"] = 9] = "NINE";
    RANK[RANK["TEN"] = 10] = "TEN";
    RANK[RANK["JACK"] = 11] = "JACK";
    RANK[RANK["QUEEN"] = 12] = "QUEEN";
    RANK[RANK["KING"] = 13] = "KING";
    RANK[RANK["ACE"] = 14] = "ACE";
})(RANK || (RANK = {}));
var Card = /** @class */ (function () {
    function Card(card_number, card_SUIT) {
        this.card_number = card_number;
        this.card_SUIT = card_SUIT;
        this.imagePath = "";
        this.imagePath = "cards/" + card_SUIT + card_number + ".png";
    }
    Object.defineProperty(Card.prototype, "RANK", {
        get: function () { return this.card_number; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(Card.prototype, "SUIT", {
        get: function () { return this.card_SUIT; },
        enumerable: false,
        configurable: true
    });
    Card.prototype.toString = function () {
        return ((this.card_number > 10) ? transformPipNumToLetter(this.card_number) : this.card_number) + SUITToSymbol(this.card_SUIT);
    };
    return Card;
}());
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
function SUITToSymbol(card_SUIT) {
    switch (card_SUIT) {
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
var card = new Card(12, SUIT.HEART);
console.log(card);
