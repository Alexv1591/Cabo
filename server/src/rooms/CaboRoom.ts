import { Room, Client } from "colyseus";
import { Card } from "../../lib/Card";
import { Player } from "../../lib/Player";
import { CaboState } from "./State/CaboState";
import { BotPlayer } from "../../lib/BotPlayer";
import { UserPlayer } from "../../lib/UserPlayer";

export class CaboRoom extends Room {
  private currentTurnIndex: number;
  private cabo_caller: string;
  private readyPlayers: number = 0;
  private last_round: boolean = false;
  constructor() {
    super();
  }
  onCreate(options: any) {
    this.setState(new CaboState(options.AI));
    this.maxClients = options.players;
    for (let i = 0; i < options.AI; i++)
      this.state.players.push(new BotPlayer(this));
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

    this.onMessage("ready", async (client, message) => {
      this.readyPlayers++;
      if (this.readyPlayers === this.maxClients) {
        this.broadcast("everybody-ready", {});
        this.initPlayerTurn();
      }
    })

    this.onMessage("nextTurn", (client, message) => {
      this.nextTurn();
    });

    this.onMessage("to_discard", (client, message) => {
      this.toDiscard(this.getPlayerById(client.sessionId), Card.CardFromPathFactory(message.card))
    });

    this.onMessage("draw-card", (client, message) => {
      this.drawCard(this.getPlayerById(client.sessionId))
      if (this.state.pack.empty)
        this.broadcast("empty-pack",);
    });

    this.onMessage("get-card", (client, message) => {
      this.getCard(this.getPlayerById(client.sessionId), message);
    });

    this.onMessage("take-from-deck", (client, message) => {
      this.takeFromDeck(this.getPlayerById(client.sessionId), Card.CardFromPathFactory(message.card), message.index);
    });

    this.onMessage("take-from-discard", (client, message) => {
      this.takeFromDiscard(this.getPlayerById(client.sessionId), message.index);
    });

    this.onMessage("swap-two-cards", (client, message) => { //message template => {players:[**player1 id**,**player2 id**],cards:[**card index for player1**,**card index for player2**]}
      this.swapTwoCards(this.getPlayerById(client.sessionId), message);
    });

    this.onMessage("cabo", (client, message) => {
      this.cabo(client.sessionId);
    });

    this.onMessage("chat-message", (client, message) => {
      this.broadcast("chat-message", { player: client.sessionId, message: message });
    });

  }
  private gameOver(): boolean {
    return this.last_round && this.getCurrentTurnId() === this.cabo_caller;
  }
  public cabo(cabo_caller_id: string) {
    this.last_round = true;
    this.cabo_caller = cabo_caller_id;
    this.broadcast("cabo", { player: cabo_caller_id });
  }

  private calculateWinner() {
    let scores = this.state.players.map((player: Player) => player.getPoints());
    let winnerIndex = scores.indexOf(Math.min(...scores));
    return this.state.players[winnerIndex].id;
  }

  private notifyPlayersAboutResult(winnerId: string) {
    let winner = this.getPlayerById(winnerId);
    this.state.players.forEach((player: Player) => {
      if (player instanceof UserPlayer) {
        player.client.send("my-end-point", player.getPoints());
        player.client.send("winner", winnerId);
      }
    });
  }

  private getPlayerById(id: string) {
    let player = this.state.players.find((player: any) => { return id === player.id; });
    if (typeof player === "undefined")
      throw new Error(id + " is not a player in this game");

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
    this.currentTurnIndex = CaboRoom.getRandomInt(this.state.num_of_players);//Randomly chose the first player
    this.broadcast('game-start',);//TODO: send to card from the hand for every player
  }

  private initPlayerTurn() {
    this.state.currentTurn = this.getCurrentTurnId();
    setTimeout(() => {
      if (this.state.players[this.currentTurnIndex] instanceof UserPlayer)
        this.state.players[this.currentTurnIndex].client.send("my-turn", { afterNextPatch: true });
      else
        this.state.players[this.currentTurnIndex].BotTurn();
    }, 3000);

  }

  private sendPlayers() {
    let playersId = this.state.players.map((value: any) => value.id);
    for (let player of this.state.players.values()) {
      if (player instanceof UserPlayer)
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

  public static getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  //Methods for player actions and messages

  public async nextTurn() {
    this.currentTurnIndex = ((this.currentTurnIndex + 1) % this.state.num_of_players);
    if (this.gameOver()) {
      this.broadcast("GameOver", {});
      let winner: string = this.calculateWinner();
      this.notifyPlayersAboutResult(winner);
    }
    else
      this.initPlayerTurn();
  }

  public async toDiscard(player: Player, card: Card) {
    this.state.discard_pile.push(card);
    console.log(card + " added to discard pile");//debug
    this.broadcast("discard-card", card.image, (player instanceof UserPlayer) ? { except: player.client, afterNextPatch: true } : {});
  }

  public async drawCard(player: Player) {
    let card = this.state.pack.draw();
    console.log(player.id + " draw " + card);
    if (player instanceof UserPlayer) {
      player.client.send("drawn-card", card.image);
      this.broadcast("player-draw-card", { id: player.id }, { except: player.client });//notify other players about the move
    } else
      this.broadcast("player-draw-card", { id: player.id });
    return card;
  }

  public async getCard(requester: Player, message: any) {
    let player: Player = this.getPlayerById(message.player);
    let card = player.getCard(message.index);
    if (requester instanceof UserPlayer) {
      requester.client.send("get-card", card.image);
      this.broadcast("card-clicked", message, { except: requester.client });
    } else
      this.broadcast("card-clicked", message);
    return card;
  }

  public async takeFromDeck(player: Player, replacementCard: Card, replaceIndex: number) {
    let discard = player.swapCard(replacementCard, replaceIndex);
    this.state.discard_pile.push(discard);
    console.log(player.id + " swap the card in index " + replaceIndex);//debug
    console.log(discard.toString() + " added to discard pile");//debug
    this.broadcast("player-take-from-deck", { player: player.id, index: replaceIndex, card: discard.image }, (player instanceof UserPlayer) ? { except: player.client, afterNextPatch: true } : {});//notify other players about the move
    this.getBots().filter((bot: BotPlayer) => bot.id != player.id).forEach((bot: BotPlayer) => { bot.notifyPlayerDiscardCard(player.id, replaceIndex); });
  }

  public async takeFromDiscard(player: Player, replaceIndex: number) {
    let new_card = this.state.discard_pile.pop();
    let discard = player.swapCard(new_card, replaceIndex);
    console.log(player.id + " take from discard " + player.getCard(replaceIndex));
    console.log(discard.toString() + " added to discard pile");
    this.broadcast("player-take-from-deck", discard.image, (player instanceof UserPlayer) ? { except: player.client } : {});//notify other players about the move
    this.getBots().filter((bot: BotPlayer) => bot.id != player.id).forEach((bot: BotPlayer) => { bot.notifyPlayerTakeFromDiscard(player.id, new_card, replaceIndex); });
  }

  public async swapTwoCards(requester: Player, message: any) {
    console.log("Room:swaps")
    let players = message.players.map((value: any) => this.getPlayerById(value));
    console.log("Room: befor->" + players[0] + " " + players[1]);
    let indexes = message.cards;
    //notify the bot so it could change it's known_cards
    this.getBots().forEach((bot: BotPlayer) => {
      bot.notfiyCardsSwap(message.players, indexes);
    });
    //swap cards
    let card = players[0].swapCard(players[1].getCard(indexes[1]), indexes[0]);
    players[1].swapCard(card, indexes[1]);
    console.log("Room: after->" + players[0] + " " + players[1]);
    this.broadcast("swap-two-cards", message, (requester instanceof UserPlayer) ? { except: requester.client } : {});//notify other players about the move

  }
  private getBots() {
    return this.state.players.filter((player: Player) => { return (player instanceof BotPlayer); });
  }

}
