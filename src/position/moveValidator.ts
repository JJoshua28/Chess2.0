import { createNewColumnId, createNewRowId, getColumnIndexArray, getRowIndexArray, separateId } from "../helperFunctions/helperFunction";
import { getPlayersPiecePositions, player1, player2 } from "../players/players";
import { BoardPosition, ColumnIndexsArrayType, RowIndexsArrayType, TileIdsType } from "../types/boardTypes";
import { MovementType, PlayerIdType } from "../types/pieceTypes";

export function isAValidMove (playerId: PlayerIdType, boardPosition: BoardPosition): boolean {
    const tileId: TileIdsType = `${boardPosition.columnId}${boardPosition.rowId}`
    const currentPiecePosition = getPlayersPiecePositions(playerId);
    let validMove = !currentPiecePosition.includes(tileId);
    return validMove;
}

export class MoveValidator {
    playerId: PlayerIdType;
    currentPosition: BoardPosition;
    boardPosition: BoardPosition;
    movementType: MovementType;
    constructor(id: PlayerIdType, curentPosition: BoardPosition, boardPosition: BoardPosition, moveset: MovementType) {
        this.playerId = id;
        this.currentPosition = curentPosition;
        this.boardPosition = boardPosition;
        this.movementType = moveset
    }
    canMoveLeft() {
        const oppositionId = player1.id === this.playerId? player2.id : player1.id;
        const oppositionPiecePosition = getPlayersPiecePositions(oppositionId);
        const columnIndexArray: ColumnIndexsArrayType = getColumnIndexArray();
        const piecesOnTheSameRow = oppositionPiecePosition.filter(piece => {
            const {rowId} = separateId(piece);
            return rowId === this.boardPosition.rowId
        }).filter(piece => {
            const {columnId} = separateId(piece);
            const indexOfColumnId = columnIndexArray.indexOf(columnId)
            const indexOfCurrentPositionColumnId = columnIndexArray.indexOf(this.currentPosition.columnId)
            return  indexOfColumnId < indexOfCurrentPositionColumnId;
        })
        return piecesOnTheSameRow;
    }
    canMoveRight() {
        const oppositionId = player1.id === this.playerId? player2.id : player1.id;
        const oppositionPiecePosition = getPlayersPiecePositions(oppositionId);
        const columnIndexArray: ColumnIndexsArrayType = getColumnIndexArray();
        const piecesOnTheSameRow = oppositionPiecePosition.filter(piece => {
            const {rowId} = separateId(piece);
            return rowId === this.boardPosition.rowId
        }).filter(piece => {
            const {columnId} = separateId(piece);
            const indexOfColumnId = columnIndexArray.indexOf(columnId)
            const indexOfCurrentPositionColumnId = columnIndexArray.indexOf(this.currentPosition.columnId)
            return  indexOfColumnId > indexOfCurrentPositionColumnId;
        })
        return piecesOnTheSameRow;
    }
    canMoveDown() {
        const oppositionId = player1.id === this.playerId? player2.id : player1.id;
        const oppositionPiecePosition = getPlayersPiecePositions(oppositionId);
        const rowIndexArray: RowIndexsArrayType = getRowIndexArray();
        const piecesOnTheSameColumn = oppositionPiecePosition.filter(piece => {
            const {columnId} = separateId(piece);
            return columnId === this.boardPosition.columnId
        }).filter(piece => {
            const {rowId} = separateId(piece);
            const indexOfRowId = rowIndexArray.indexOf(rowId)
            const indexOfCurrentPositionRowId = rowIndexArray.indexOf(this.currentPosition.rowId)
            return  indexOfRowId > indexOfCurrentPositionRowId;
        })
        console.log(piecesOnTheSameColumn)
        return piecesOnTheSameColumn;
    }
    canMoveUp() {
        const oppositionId = player1.id === this.playerId? player2.id : player1.id;
        const oppositionPiecePosition = getPlayersPiecePositions(oppositionId);
        const rowIndexArray: RowIndexsArrayType = getRowIndexArray();
        const piecesOnTheSameColumn = oppositionPiecePosition.filter(piece => {
            const {columnId} = separateId(piece);
            return columnId === this.boardPosition.columnId
        }).filter(piece => {
            const {rowId} = separateId(piece);
            const indexOfRowId = rowIndexArray.indexOf(rowId)
            const indexOfCurrentPositionRowId = rowIndexArray.indexOf(this.currentPosition.rowId)
            return  indexOfRowId < indexOfCurrentPositionRowId;
        })
        console.log(piecesOnTheSameColumn)
        return piecesOnTheSameColumn;
    }
    canMoveDownRight() {
        const oppositionId = player1.id === this.playerId? player2.id : player1.id;
        const oppositionPiecePosition = getPlayersPiecePositions(oppositionId);
        const previousColumnId = createNewColumnId(this.boardPosition.columnId, false);
        const previousRowId = createNewRowId(this.boardPosition.rowId, true);
        const piecesOnThePreviousPosition = oppositionPiecePosition.filter(piece => {
            const {columnId, rowId} = separateId(piece);
            return columnId === previousColumnId && rowId === previousRowId; 
        })
        return piecesOnThePreviousPosition;
    }
    canMoveDownLeft() {
        const oppositionId = player1.id === this.playerId? player2.id : player1.id;
        const oppositionPiecePosition = getPlayersPiecePositions(oppositionId);
        const previousColumnId = createNewColumnId(this.boardPosition.columnId, true);
        const previousRowId = createNewRowId(this.boardPosition.rowId, true);
        if(previousColumnId && previousRowId)console.log(previousColumnId + previousRowId)
        const piecesOnThePreviousPosition = oppositionPiecePosition.filter(piece => {
            const {columnId, rowId} = separateId(piece);
            return columnId === previousColumnId && rowId === previousRowId; 
        })
        console.log(piecesOnThePreviousPosition)
        return piecesOnThePreviousPosition;
    }
    canMoveUpRight() {
        const oppositionId = player1.id === this.playerId? player2.id : player1.id;
        const oppositionPiecePosition = getPlayersPiecePositions(oppositionId);
        const previousColumnId = createNewColumnId(this.boardPosition.columnId, false);
        const previousRowId = createNewRowId(this.boardPosition.rowId, false);
        const piecesOnThePreviousPosition = oppositionPiecePosition.filter(piece => {
            const {columnId, rowId} = separateId(piece);
            return columnId === previousColumnId && rowId === previousRowId; 
        })
        return piecesOnThePreviousPosition;
    }
    canMoveUpLeft() {
        const oppositionId = player1.id === this.playerId? player2.id : player1.id;
        const oppositionPiecePosition = getPlayersPiecePositions(oppositionId);
        const previousColumnId = createNewColumnId(this.boardPosition.columnId, true);
        const previousRowId = createNewRowId(this.boardPosition.rowId, false);
        const piecesOnThePreviousPosition = oppositionPiecePosition.filter(piece => {
            const {columnId, rowId} = separateId(piece);
            return columnId === previousColumnId && rowId === previousRowId; 
        })
        return piecesOnThePreviousPosition;
    }
    validateMove() {
        let validMove: boolean = isAValidMove(this.playerId, this.boardPosition);
        if(!validMove) return validMove;
        const columnIndexArray: ColumnIndexsArrayType = getColumnIndexArray();
        const rowIndexArray: RowIndexsArrayType = getRowIndexArray();
        switch(this.movementType) {
            case "right":
                this.canMoveRight().forEach(tileID => {
                    const {columnId} = separateId(tileID);
                    const indexOfPieceColumnId = columnIndexArray.indexOf(columnId);
                    const indexOfPotentialColumnId = columnIndexArray.indexOf(this.boardPosition.columnId);
                    if(indexOfPieceColumnId < indexOfPotentialColumnId) validMove = false;
                })
                break;
            case "left":
                this.canMoveLeft().forEach(tileID => {
                    const {columnId} = separateId(tileID);
                    const indexOfPieceColumnId = columnIndexArray.indexOf(columnId);
                    const indexOfPotentialColumnId = columnIndexArray.indexOf(this.boardPosition.columnId);
                    if(indexOfPieceColumnId > indexOfPotentialColumnId) validMove = false;
                })
                break;
            case "down": 
                this.canMoveDown().forEach(tileID => {
                    const {rowId} = separateId(tileID);
                    const indexOfPieceRowId = rowIndexArray.indexOf(rowId);
                    const indexOfPotentialRowId = rowIndexArray.indexOf(this.boardPosition.rowId);
                    if(indexOfPieceRowId < indexOfPotentialRowId) validMove = false;
                })
                break;
            case "up": 
                this.canMoveUp().forEach(tileID => {
                    const {rowId} = separateId(tileID);
                    const indexOfPieceRowId = rowIndexArray.indexOf(rowId);
                    const indexOfPotentialRowId = rowIndexArray.indexOf(this.boardPosition.rowId);
                    if(indexOfPieceRowId > indexOfPotentialRowId) validMove = false;
                })
                break;
            case "downRight": 
                if(this.canMoveDownRight().length > 0) validMove = false;
                break;
            case "downLeft": 
                if(this.canMoveDownLeft().length > 0) validMove = false;
                break;
            case "upRight": 
                if(this.canMoveUpRight().length > 0) validMove = false;
                break;
            case "upLeft": 
                if(this.canMoveUpLeft().length > 0) validMove = false;
                break;
        }
        return validMove;
    }
}