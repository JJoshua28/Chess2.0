import { moveRookandKing, setNewPosition, updateSelectedTilesColour, updateTileColour, validPawnPromotion } from "../helperFunctions/helperFunction";
import { isACastlingMove } from "../pieces/pieces";
import { changeTurn, disablePlayerTurn, getOppositionPlayer, getPlayerById, getPlayersTurn, hasNotSelectedMulitplePieces, indexOfOppositionPieceOnTile, removeOppositionPiece } from "../players/players";
import { TileIdsType } from "../types/boardTypes";
import { AddNewPieceHandlerType, EventHandlers } from "../types/eventHandlersTypes";
import { PieceNames, PieceTemplate } from "../types/pieceTypes";

let selectedPiecePreviousTileColour: string;
let previousTileElement: HTMLDivElement; 

export function movePieceLocation (event: React.MouseEvent, eventHandlers: EventHandlers) {
    const {updateDisplayPieceMenuStatus, updateCheckmateStatus, changePlayer} = eventHandlers;
    const target= event.target as HTMLDivElement;
    const id = target.id as TileIdsType;
    let hasNowSelectedAPiece: boolean = false;
    const player = getPlayersTurn();
    if(player.getIsThereTurn()){
        for (const pieces in player.activePieces) {
            const choosenPiece = player.activePieces[pieces as keyof typeof player.activePieces].find(piece =>piece.getCurrentPosition() === id);
            if(choosenPiece && hasNotSelectedMulitplePieces(player, id)) {
                choosenPiece.setSelected(!choosenPiece.getSelectedStatus());
                if(choosenPiece.getSelectedStatus()) {
                    previousTileElement = target;
                } 
                const hasUpdatedTileColor = updateSelectedTilesColour(target, choosenPiece.getSelectedStatus(), selectedPiecePreviousTileColour)
                if(hasUpdatedTileColor) selectedPiecePreviousTileColour = hasUpdatedTileColor; 
                hasNowSelectedAPiece = true;
            }
        }  
        if(!hasNowSelectedAPiece) {
            let previouslySelectedPiece: PieceTemplate | undefined;
            for (const pieces in player.activePieces) {
                    previouslySelectedPiece = player.activePieces[pieces as keyof typeof player.activePieces].find((piece: PieceTemplate) => piece.getSelectedStatus() === true);
                    if(previouslySelectedPiece) break;
            }
            if (previouslySelectedPiece) {
                const isMovePossible = previouslySelectedPiece.getAvailableMoves().includes(id)
                if(isMovePossible) {
                    const isOppositionPieceOnTile = indexOfOppositionPieceOnTile(previouslySelectedPiece.playerId, id );
                    isOppositionPieceOnTile && removeOppositionPiece(previouslySelectedPiece.playerId, isOppositionPieceOnTile);
                    isACastlingMove(previouslySelectedPiece, id )? 
                        moveRookandKing(id , previouslySelectedPiece, target, previousTileElement) :
                        setNewPosition(previouslySelectedPiece,
                    target, previousTileElement);
                    updateTileColour(previousTileElement, selectedPiecePreviousTileColour)
                    const shouldPromotePawn = validPawnPromotion(previouslySelectedPiece);
                    if(!shouldPromotePawn){
                        changeTurn(player);
                        const nextPlayersTurn = getPlayersTurn(); 
                        changePlayer(nextPlayersTurn.id);
                    } 
                    if(shouldPromotePawn) {
                        disablePlayerTurn(player)
                        updateDisplayPieceMenuStatus(previouslySelectedPiece);
                    }
                }
            }
            false && updateCheckmateStatus();
        }
    }
}

export function addNewPieceHandler(piece: PieceTemplate | null, pieceName: PieceNames, updateDisplayPieceMenuStatus: AddNewPieceHandlerType) {
    if(piece) {
        const { playerId, currentColumnPosition, currentRowPosition} = piece;
        const pieceTileId = piece.getCurrentPosition();
        const player = getPlayerById(playerId);
        player.removePawn(pieceTileId);
        let newPiece: PieceTemplate | undefined; 
        switch(pieceName) {
            case PieceNames.QUEEN:
                newPiece = player.addNewQueen(currentColumnPosition, currentRowPosition)
                break;
            case PieceNames.ROOK:
                newPiece = player.addNewRook(currentColumnPosition, currentRowPosition)
                break;
            case PieceNames.BISHOP:
                newPiece = player.addNewBishop(currentColumnPosition, currentRowPosition)
                break;
            case PieceNames.KNIGHT:
                newPiece = player.addNewKnight(currentColumnPosition, currentRowPosition)
                break;
        }
        if(newPiece) {
            updateDisplayPieceMenuStatus(null);
            const tileToUpdate = document.getElementById(piece.getCurrentPosition());
            if(tileToUpdate) tileToUpdate.innerHTML = newPiece.getSymbol();
            const oppositionPlayer = getOppositionPlayer(playerId);
            oppositionPlayer.setIsThereTurn(!oppositionPlayer.getIsThereTurn())

        }
    }
}