import { IS_MAINNET } from "./stage"

const { REACT_APP_INFURA_PROJECT_ID } = process.env

interface NetworkConfig {
    name: string
    nativeTokenSymbol: string
    rpcUrl: string
    etherscanUrl: string
    thegraphEndpoint: string
    thegraphSchemaType: "" | "thegraph" | "subquery"
}

// TODO: set thegraphEndpoint

export const networkConfigs: { [key: string]: NetworkConfig } = IS_MAINNET
    ? {
          1: {
              name: "Ethereum",
              nativeTokenSymbol: "ETH",
              rpcUrl: `wss://mainnet.infura.io/ws/v3/${REACT_APP_INFURA_PROJECT_ID}`,
              etherscanUrl: "https://etherscan.io/",
              thegraphEndpoint: "",
              thegraphSchemaType: "",
          },
          592: {
              name: "Astar",
              nativeTokenSymbol: "ASTR",
              rpcUrl: `wss://rpc.astar.network`,
              etherscanUrl: "https://blockscout.com/astar/",
              thegraphEndpoint: "",
              thegraphSchemaType: "",
          },
      }
    : {
          4: {
              name: "Rinkeby",
              nativeTokenSymbol: "ETH",
              rpcUrl: `wss://rinkeby.infura.io/ws/v3/${REACT_APP_INFURA_PROJECT_ID}`,
              etherscanUrl: "https://rinkeby.etherscan.io/",
              thegraphEndpoint: "",
              thegraphSchemaType: "",
          },
          69: {
              name: "Optimism Kovan",
              nativeTokenSymbol: "ETH",
              rpcUrl: "https://kovan.optimism.io",
              etherscanUrl: "https://kovan-optimistic.etherscan.io/",
              thegraphEndpoint: "",
              thegraphSchemaType: "",
          },
          81: {
              name: "Shibuya",
              nativeTokenSymbol: "SBY",
              rpcUrl: `wss://rpc.shibuya.astar.network`,
              etherscanUrl: "https://blockscout.com/shibuya/",
              thegraphEndpoint: "https://api.subquery.network/sq/perpdex/shibuya_test2",
              thegraphSchemaType: "subquery",
          },
          280: {
              name: "zkSync 2 testnet",
              nativeTokenSymbol: "ETH",
              rpcUrl: "wss://zksync2-testnet.zksync.dev/ws",
              etherscanUrl: "https://zksync2-testnet.zkscan.io/",
              thegraphEndpoint: "https://api.thegraph.com/subgraphs/name/perpdex/perpdex-v1-zksync2-testnet",
              thegraphSchemaType: "thegraph",
          },
          80001: {
              name: "Mumbai",
              nativeTokenSymbol: "MATIC",
              rpcUrl: "https://rpc-mumbai.maticvigil.com",
              etherscanUrl: "https://mumbai.polygonscan.com/",
              thegraphEndpoint: "",
              thegraphSchemaType: "",
          },
          421611: {
              name: "Arbitrum Rinkeby",
              nativeTokenSymbol: "ETH",
              rpcUrl: "https://rinkeby.arbitrum.io/rpc",
              etherscanUrl: "https://testnet.arbiscan.io/",
              thegraphEndpoint: "",
              thegraphSchemaType: "",
          },
      }
