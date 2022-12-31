import { PieceTemplate } from "./pieceTypes";

export type PlayerTurnType = "White" | "Black"; 
export type AddNewPieceHandlerType = (value: PieceTemplate | null) => void;
export type ChangePlayerHandlerType = (value: number) => void;
export type UpdateCheckmateStatusHandlerType = () => void;
export interface EventHandlers {
    updateDisplayPieceMenuStatus: AddNewPieceHandlerType,
    changePlayer: ChangePlayerHandlerType,
    updateCheckmateStatus: UpdateCheckmateStatusHandlerType
}