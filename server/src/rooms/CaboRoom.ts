import { Room, Client } from "colyseus";
import { Card } from "../../lib/Card";
import { Player } from "../../lib/Player";
import { CaboState } from "./State/CaboState";
import { BotPlayer } from "../../lib/BotPlayer";
import { UserPlayer } from "../../lib/UserPlayer";

export class CaboRoom extends Room {
  private currentTurnIndex: number;
  private cabo_caller:string;
  private readyPlayers:number=0;
  private last_round:boolean=false;
  constructor() {
    super();
  }
  onCreate(options: any) {
    this.setState(new CaboState(options.AI));
    this.maxClients = options.players;
    this.state.players.push(new BotPlayer(this));
    //TODO: adds the AI players
    this.loadMassageListener();

  }

  onJoin(client: Client, options: any) {
    this.state.players.push(new UserPlayer(client));
    this.state.num_of_players++;
    console.log(client.id + " joined successfully to " + this.roomId);
    if (!this.hasReachedMaxClients())
      return;
    this.lock();
    this.initGame();

  }

  onLeave(client: Client, consented: boolean) {
  }

  onDispose() {
  }

  private async loadMassageListener() {
    
    this.onMessage("ready",async (client,message)=> {
      this.readyPlayers++;
      if(this.readyPlayers===this.maxClients)
        this.initPlayerTurn();
    })

    this.onMessage("nextTurn",(client, message) => {

    });

    this.onMessage("to_discard", (client, message) => {
      this.toDiscard(this.getPlayerById(client.sessionId),Card.CardFromPathFactory(message.card))
    });

    this.onMessage("draw-card", (client, message) => {
      this.drawCard(this.getPlayerById(client.sessionId));
      if(this.state.pack.empty)
        this.broadcast("empty-pack",);
    });

    this.onMessage("get-card", (client, message) => {
      this.getCard(this.getPlayerById(client.sessionId),message);
    });

    this.onMessage("take-from-deck", (client:any, message:any) => {
      this.takeFromDeck(this.getPlayerById(client.sessionId),Card.CardFromPathFactory(message.card),message.index);
    });

    this.onMessage("take-from-discard", (client, message) => {
      this.takeFromDiscard(this.getPlayerById(client.sessionId),message.index);
    });

    this.onMessage("swap-two-cards", (client, message) => { //message template => {players:[**player1 id**,**player2 id**],cards:[**card index for player1**,**card index for player2**]}
      let players = message.players.map((value: any) => this.getPlayerById(value));
      let indexes = message.cards;
      //swap cards
      let card = players[0].swapCard(players[1].getCard(indexes[1]), indexes[0]);
      players[1].swapCard(card, indexes[1]);
      this.broadcast("player-swap-two-cards", message, { except: client });//notify other players about the move
    });

    this.onMessage("cabo",(client,message)=>{
      this.cabo(client.sessionId);
    });

    this.onMessage("chat-message", (client, message) => {
      this.broadcast("chat-message", { player: client.sessionId, message: message });
    });

  }
  private gameOver():boolean{
    return this.last_round && this.getCurrentTurnId()===this.cabo_caller;
  }
  public cabo(cabo_caller_id:string){
    this.last_round=true;
    this.cabo_caller=cabo_caller_id;
    this.broadcast("cabo",{player:cabo_caller_id});
  }

  private calculateWinner(){
    let scores=this.state.players.map((player:Player)=>player.getPoints());
    let winnerIndex=scores.indexOf(Math.min(...scores));
    return this.state.players[winnerIndex].client.sessionId;
  }
  
  private notifyPlayersAboutResualt(winnerId:string){
    let winner=this.getPlayerById(winnerId);
    this.state.players.forEach((player:Player) => {
      if(player instanceof UserPlayer){
        player.client.send("my-end-point",{me:player.toString(),points:player.getPoints()});
        if(winnerId!=player.client.sessionId)
          player.client.send("winner",{winner:winner.toString(),points:winner.getPoints()});
        else
          player.client.send("you-win",{});
      }
    });
  }

  private getPlayerById(id: string) {
    let player = this.state.players.find((player: any) => { return id === player.id; });
    if (typeof player === "undefined")
      throw id + " is not a player in this game";
    return player;
  }

  private logDiscardPile() {
    let str = "[";
    this.state.discard_pile.forEach((card: Card) => { str += " " + card.toString(); });
    str += "]";
    console.log(str);
  }

  private initGame() {
    console.log("Start of the Game state:")
    for (let i = 0; i < 4; i++) {
      for (let player of this.state.players.values()) {
        player.addCard(this.state.pack.draw());
      }
    }

    for (let player of this.state.players) {
      console.log(player + "")
    }
    this.sendPlayers();
    this.currentTurnIndex = this.getRandomInt(this.state.num_of_players);//Randomly chose the first player
    this.broadcast('game-start',);//TODO: send to card from the hand for every player
  }

  private initPlayerTurn() {
    this.state.currentTurn = this.getCurrentTurnId();
    if(this.state.players[this.currentTurnIndex] instanceof UserPlayer)
     this.state.players[this.currentTurnIndex].client.send("my-turn", {});//,{ afterNextPatch : true }); 
    else
      this.state.players[this.currentTurnIndex].BotTurn(); 
  }

  private sendPlayers() {
    let playersId = this.state.players.map((value: any) => value.id);
    for (let player of this.state.players.values()) {
      if(player instanceof UserPlayer)
        player.client.send("players", playersId);
      else
        player.initBotData(playersId);
      let val = playersId.shift();
      playersId.push(val);
    }
  }

  private getCurrentTurnId(): string {
    return this.state.players[this.currentTurnIndex].id;
  }

  private getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  //Methods for player actions and messages
  
  public async nextTurn()
  {
    this.currentTurnIndex=((this.currentTurnIndex+1)%this.state.num_of_players);
    if(this.gameOver()){
      this.broadcast("GameOver", {});
      let winner:string=this.calculateWinner();
      this.notifyPlayersAboutResualt(winner);
    }
    else
      this.initPlayerTurn();
  }
  
  public async toDiscard(player:Player,card:Card){
    this.state.discard_pile.push(card);
    console.log(card + " added to discard pile");//debug
    this.broadcast("discard-card", card, ( player instanceof UserPlayer ) ? { except: player.client } : { });
  }

  public async drawCard(player:Player){
    let card = this.state.pack.draw();
    console.log(player.id + " draw " + card);
    if(player instanceof UserPlayer){
      player.client.send("drawn-card", card.image);
      this.broadcast("player-draw-card", { id: player.id }, { except: player.client });//notify other players about the move
    }else
      this.broadcast("player-draw-card", { id: player.id });
    return card;
  }

  public async getCard(requester:Player,message:any){
    let player: Player = this.getPlayerById(message.player);
    let card = player.getCard(message.index);
    if(requester instanceof UserPlayer){
      requester.client.send("get-card", card.image);
      this.broadcast("card-clicked", message, { except: requester.client });
    }else
      this.broadcast("card-clicked",message);
    return card;
  }

  public async takeFromDeck(player:Player,replacementCard:Card,replaceIndex:number){
    let discard = player.swapCard(replacementCard, replaceIndex);
    this.state.discard_pile.push(discard);
    console.log(player.id + " swap the card in index " + replaceIndex);//debug
    console.log(discard.toString() + " added to discard pile");//debug
    this.broadcast("player-take-from-deck", { player: player.id, index: replaceIndex, card:discard.image },(player instanceof UserPlayer) ? { except: player.client } : { });//notify other players about the move
  }

  public async takeFromDiscard(player:Player,replaceIndex:number){
    let discard = player.swapCard(this.state.discard_pile.pop(), replaceIndex);
    console.log(player.id + " take from discard " + player.getCard(replaceIndex));
    this.broadcast("player-take-from-deck", discard.image,(player instanceof UserPlayer) ? { except: player.client } : { });//notify other players about the move
  }


}
