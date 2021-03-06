import { LobbyModel } from "../../models/LobbyModel";
import { Dispatch } from "redux";
import { loadLobbies } from "../../components/Lobby/redux/actions";
import { joinedGame, gameStarted } from "../../components/Game/redux/actions";
import { GameModel } from "../../models/GameModel";
import { ChosenCardModel } from "../../models/ChosenCardModel";

export function createNewGame(socket: SocketIOClient.Socket, game: LobbyModel, created: (game: GameModel) => any) {
    socket.emit('CREATE_NEW_GAME', game, (game: GameModel) =>{
        created(game);
    });
}

export function joinGame(socket: SocketIOClient.Socket, dispatch: Dispatch<any>, id: string, callback: (game: GameModel) => any) {
    socket.emit('JOIN_GAME', id, (game: GameModel) => {
        dispatch(joinedGame(game));
        callback(game);
    });
}

export function loadLobbyList(socket: SocketIOClient.Socket, dispatch: Dispatch<any>){
    socket.emit('LOAD_LOBBIES', (games: LobbyModel[]) => {
        dispatch(loadLobbies(games));
    });
}

export function startGame(socket: SocketIOClient.Socket, game: GameModel, dispatch: Dispatch<any>, callback: (game: GameModel) => any) {
    socket.emit('START_GAME', game._id, (game: GameModel) => {
        dispatch(gameStarted(game));
        callback(game);
    });
}

export function playCards(socket: SocketIOClient.Socket, gameId: string, cardIds: ChosenCardModel[], dispatch: Dispatch<any>){
    socket.emit('PLAY_CARDS', gameId, cardIds);
}

export function czarPickedCard(socket: SocketIOClient.Socket, gameId: string, cardId: string){
    socket.emit("CZAR_PICKED_CARD", gameId, cardId);
}