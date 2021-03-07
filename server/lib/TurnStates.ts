export enum FirstState{
    DRAW="draw-from-deck",
    DUMPSTER_DIVE="draw-from-discard"
}

export enum SecondState{
    KEEP="keep-card",
    DISCARD="discard-card"
} 

export enum ActionCard{
    SELF_PEEK='peek-self',
    PEEK_OPPONENT='peek-opponent',
    SWAP_CARDS='swap-cards',
    ULTIMATE_POWER='ultimate-power',
    NONE='none'
}
export function getActionState(card_path:string):ActionCard{
    let match=card_path.match(/([1-9][0-3]?)/g)
    if (!match || match.length!=1) 
        throw card_path+" is not a valid action card";
    let card_val=match.map((value)=>parseInt(value))[0];
    switch(card_val){
        case 7:
        case 8:
            return ActionCard.SELF_PEEK;
        case 9:
        case 10:
            return ActionCard.PEEK_OPPONENT;
        case 11://Jack
            return ActionCard.SWAP_CARDS;
        case 12://QUEEN
            return ActionCard.ULTIMATE_POWER;
        default:
            return ActionCard.NONE;
    }
}