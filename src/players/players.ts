import { RowIds, TileIdsType } from "../types/boardTypes";
import { getColumnIndexArray} from "../helperFunctions/helperFunction";
import { ActivePieceKeys, ActivePieces, PieceTemplate, PlayerIdType } from "../types/pieceTypes";
import { player1ActivePieces, player2ActivePieces } from "../pieces/pieces";
import { PieceLocation, PlayerTemplate } from "../types/playersTypes";

export class Player {
    readonly id: PlayerIdType;
    activePieces:ActivePieces;
    isThereTurn: boolean;
    hasMoved: boolean = false;
    unavailablePieces: PieceTemplate[] = [];
    constructor(id:PlayerIdType, isThereTurn: boolean, activePieces: ActivePieces) {
        this.activePieces = activePieces;
        this.isThereTurn = isThereTurn;
        this.id = id;
    }
    setIsThereTurn(value: boolean) {
        this.isThereTurn = value;
    }
    getIsThereTurn(): boolean {
        return this.isThereTurn;
    }
    setUnavailablePieces(value: PieceTemplate) {
        this.unavailablePieces.push(value);
    }
    getUnavailablePieces(): PieceTemplate[] {
        return this.unavailablePieces;
    }
}

export const player1 = new Player(1, true, player1ActivePieces);

export const player2 = new Player(2, false, player2ActivePieces);

export function changeTurn (player: PlayerTemplate) {
    player.setIsThereTurn(!player.getIsThereTurn()); 
    player.id === 1? player2.setIsThereTurn(!player.getIsThereTurn()) : player1.setIsThereTurn(!player.getIsThereTurn());
    
}

export function displayPawns(player: PlayerTemplate) {
    return player.activePieces.pawns.map(pawn => {
        return pawn.getSymbol();
    }) 
}

export function displayPieces (player: PlayerTemplate) {
    const piecesToDisplay: PieceTemplate[] = [];
    const rowID: RowIds = player.id === 1? "8" : "1"; 
    for (const columnID of getColumnIndexArray()) {
        for (const pieces in player.activePieces){
            const pieceToDisplay: PieceTemplate | undefined = player.activePieces[pieces as keyof typeof player.activePieces].find(piece => piece.getCurrentPosition() === `${columnID}${rowID}` as TileIdsType)
            pieceToDisplay && piecesToDisplay.push(pieceToDisplay);
        }
    }
    return piecesToDisplay.map(piece => piece.getSymbol());
}

export function getPlayersPiecePositions(id: PlayerIdType): TileIdsType[] {
    const player = player1.id === id? player1 : player2;
    const allPositions: TileIdsType[] = []; 
    for (const pieces in player.activePieces) {
        const pieceArray =  player.activePieces[pieces as keyof typeof player.activePieces];
        pieceArray.forEach(piece => allPositions.push(piece.getCurrentPosition()))
    }
    return allPositions;
}

export function getOppositionPlayersPiecePosition(id: PlayerIdType): TileIdsType[] {
    const oppositionId = player1.id === id? player2.id : player1.id;
    return getPlayersPiecePositions(oppositionId);
}

export function hasNotSelectedAPiece(player: PlayerTemplate, tileId: TileIdsType): boolean {
    let hasNotPreviouslySelectedAPiece: boolean = true;
    for (const pieces in player.activePieces) {
        hasNotPreviouslySelectedAPiece = player.activePieces[pieces as keyof typeof player.activePieces]
        .every(piece => piece.getSelectedStatus() === false || piece.getCurrentPosition() === tileId);
        if(!hasNotPreviouslySelectedAPiece) return hasNotPreviouslySelectedAPiece; 
    }
    return hasNotPreviouslySelectedAPiece;
}

export function indexOfOppositionPieceOnTile(playerId: PlayerIdType, tileId: TileIdsType): PieceLocation | null {
    const oppositionPlayer = playerId === player1.id? player2 : player1;
    for (const pieces in oppositionPlayer.activePieces) {
        const pieceArray =  oppositionPlayer.activePieces[pieces as keyof typeof oppositionPlayer.activePieces];
        const pieceIndex = pieceArray.findIndex((piece) => piece.getCurrentPosition() === tileId); 
        if(pieceIndex >= 0) return {key: pieces as ActivePieceKeys, index: pieceIndex}
    }
    return null;
}

export function removeOppositionPiece(playerId: PlayerIdType, pieceLocation: PieceLocation) {
    const oppositionPlayer = player1.id === playerId? player2 : player1;
    const {key, index} = pieceLocation;
    const [removedPiece] = oppositionPlayer.activePieces[key].splice(index,1)
    oppositionPlayer.setUnavailablePieces(removedPiece);
}
