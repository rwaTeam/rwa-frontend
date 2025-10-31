// 智能合約配置
export const CONTRACT_CONFIG = {
  // 合約地址
  ADDRESS: '0xbAdF2c3B802B139A89D259e9F62255e92FdB477B',
  
  // Sepolia 測試網配置
  CHAIN_ID: 11155111,
  CHAIN_NAME: 'Sepolia',
  RPC_URL: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
  BLOCK_EXPLORER: 'https://sepolia.etherscan.io',
  
  // 原生代幣
  NATIVE_CURRENCY: {
    name: 'Sepolia ETH',
    symbol: 'ETH',
    decimals: 18,
  },
}

// Sepolia 網路參數（用於添加/切換網路）
export const SEPOLIA_NETWORK_PARAMS = {
  chainId: `0x${CONTRACT_CONFIG.CHAIN_ID.toString(16)}`, // 11155111 -> 0xaa36a7
  chainName: CONTRACT_CONFIG.CHAIN_NAME,
  nativeCurrency: CONTRACT_CONFIG.NATIVE_CURRENCY,
  rpcUrls: [CONTRACT_CONFIG.RPC_URL],
  blockExplorerUrls: [CONTRACT_CONFIG.BLOCK_EXPLORER],
}

// 格式化交易哈希連結
export function getTxUrl(txHash: string): string {
  return `${CONTRACT_CONFIG.BLOCK_EXPLORER}/tx/${txHash}`
}

// 格式化地址連結
export function getAddressUrl(address: string): string {
  return `${CONTRACT_CONFIG.BLOCK_EXPLORER}/address/${address}`
}

// 縮短地址顯示
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return ''
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`
}

