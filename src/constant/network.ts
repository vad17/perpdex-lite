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

interface AddEthereumChainParameter {
    chainId: string // A 0x-prefixed hexadecimal string
    chainName: string
    nativeCurrency: {
        name: string
        symbol: string // 2-6 characters long
        decimals: 18
    }
    rpcUrls: string[]
    blockExplorerUrls?: string[]
    iconUrls?: string[] // Currently ignored.
}

export const networks: { [key: string]: AddEthereumChainParameter } = IS_MAINNET
    ? {
          1: {
              chainId: `0x${Number(1).toString(16)}`,
              chainName: "Ethereum",
              nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
              rpcUrls: [`wss://mainnet.infura.io/ws/v3/${REACT_APP_INFURA_PROJECT_ID}`],
              blockExplorerUrls: ["https://etherscan.io/"],
          },
          592: {
              chainId: `0x${Number(592).toString(16)}`,
              chainName: "Astar",
              nativeCurrency: { name: "Astar", symbol: "ASTR", decimals: 18 },
              rpcUrls: [`wss://rpc.astar.network`],
              blockExplorerUrls: ["https://blockscout.com/astar/"],
          },
      }
    : {
          4: {
              chainId: `0x${Number(4).toString(16)}`,
              chainName: "Ethereum Testnet Rinkeby",
              rpcUrls: [`wss://rinkeby.infura.io/ws/v3/${REACT_APP_INFURA_PROJECT_ID}`],
              nativeCurrency: { name: "Rinkeby Ether", symbol: "ETH", decimals: 18 },
              blockExplorerUrls: ["https://rinkeby.etherscan.io"],
          },
          81: {
              chainId: `0x${Number(81).toString(16)}`,
              chainName: "Shibuya",
              nativeCurrency: { name: "SHIBUYA", symbol: "SBY", decimals: 18 },
              rpcUrls: [`wss://rpc.shibuya.astar.network`],
              blockExplorerUrls: ["https://blockscout.com/shibuya/"],
          },
          280: {
              chainId: `0x${Number(280).toString(16)}`,
              chainName: "zkSync alpha testnet",
              rpcUrls: ["https://zksync2-testnet.zksync.dev"],
              nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
              blockExplorerUrls: ["https://zksync2-testnet.zkscan.io"],
          },
          80001: {
              chainId: `0x${Number(80001).toString(16)}`,
              chainName: "Polygon Testnet Mumbai",
              rpcUrls: [
                  "https://matic-mumbai.chainstacklabs.com",
                  "https://rpc-mumbai.maticvigil.com",
                  "https://matic-testnet-archive-rpc.bwarelabs.com",
              ],
              nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
              blockExplorerUrls: ["https://mumbai.polygonscan.com"],
          },
      }
