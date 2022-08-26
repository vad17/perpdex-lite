export * from "./amm"
export * from "./number"
export * from "./position"
export * from "./stage"
export * from "./storage"
export * from "./wallet"

export const isTechnicalChart = !!(window as any).TradingView
export const positionTokenDisabled = !!Number(process.env.REACT_APP_POSITION_TOKEN_DISABLED)
