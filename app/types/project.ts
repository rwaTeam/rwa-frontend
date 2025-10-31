export interface Project {
  id: string
  name: string
  location: string
  cropType: string
  image: string
  expectedROI: number
  tokenizedShare: string
  status: '開放中' | '已募資' | '即將推出'
  contractAddress: string
  insuranceCoverage: boolean
  insuranceProvider?: string
}

// API Response Type
export interface ApiProject {
  _id: string
  title: string
  imageURL: string
  region: string
  annual_yield_rate: string
  contract_address: string
  description: string
  total_nft: number
  nft_price: number
  insurance_company: string
  status: string
  crop_name: string
}

// 合約鏈上資料
export interface ContractData {
  balance: string  // ETH 餘額
  depositAmount?: string  // 存款金額（如果有）
  transactionCount: number  // 交易數量
  lastTransactionHash?: string  // 最後一筆交易哈希
  lastTransactionTime?: number  // 最後一筆交易時間
}

// 專案鏈上數據（從 getProjectData 返回）
export interface ProjectOnChainData {
  name: string
  symbol: string
  farmer: string
  totalNFTs: number
  nftPrice: string  // ETH
  totalSupply: number
  buildCost: string  // ETH
  annualIncome: string  // ETH
  investorShare: number
  interestRate: number
  premiumRate: number
  status: number
  progress: number  // 百分比
}

// 投資人持有的專案數據（整合 API 數據和鏈上數據）
export interface InvestorProject extends ApiProject {
  // 鏈上數據
  nftBalance: number  // 持有的 NFT 數量
  claimableRewards: string  // 可提領收益（ETH）
  projectProgress: number  // 項目進度（百分比）
  investmentAmount: string  // 投資金額（ETH）
  onChainData?: ProjectOnChainData  // 完整的鏈上數據
}

// 投資標的卡片顯示數據
export interface InvestmentCardData {
  id: string
  projectName: string
  projectImage: string
  contractAddress: string
  investmentAmount: string  // ETH
  claimableRewards: string  // ETH
  expectedROI: number  // 百分比
  projectProgress: number  // 百分比
  status: 'active' | 'completed' | 'pending'
  investDate: string
  expectedReturnDate: string
  nftBalance: number  // 持有 NFT 數量
}

