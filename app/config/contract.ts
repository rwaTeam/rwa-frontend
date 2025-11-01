// 智能合約配置
export const CONTRACT_CONFIG = {
  // BankFactory 合約地址（用於創建和管理專案）
  BANK_FACTORY_ADDRESS: '0xF9E2af07AB6d42E8Ac9d64f34C5Ac472Fc30F2bc',
  
  // TWDT 代幣地址（用於支付或獎勵）
  TWDT_TOKEN_ADDRESS: '0x30f97ba99AfE8db807aaCdC9d8513FDfD2507738',

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

