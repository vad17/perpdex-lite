import { widget } from "../charting_library"

export * from "./amm"
export * from "./number"
export * from "./position"
export * from "./stage"
export * from "./storage"
export * from "./wallet"

export const isTechnicalChart = !!widget
export const positionTokenDisabled = !!Number(process.env.REACT_APP_POSITION_TOKEN_DISABLED)
