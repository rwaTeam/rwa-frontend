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

// ===== 管理員功能相關類型 =====

// 專案狀態枚舉
export type ProjectStatus = 'pending' | 'approved' | 'rejected' | 'deployed'

// 待審核專案資料結構（從後端提交 API 返回）
export interface PendingProject {
  _id: string
  title: string
  crop_type: string
  location: string
  farmer_id: string  // 農夫錢包地址
  build_cost: number
  annual_income: number
  area: number
  expected_yield: number
  insurance_company?: string
  has_insurance: boolean
  description: string
  images?: string[]
  status: ProjectStatus
  created_at: string
  updated_at?: string
  // 可選的審核資訊
  reviewNote?: string
  reviewedAt?: string
  reviewedBy?: string
}

// 審核表單資料
export interface ApprovalFormData {
  projectId: string
  action: 'approve' | 'reject'
  totalNFTs: number  // NFT 總數量
  nftPrice: number  // NFT 單價（ETH）
  farmerAddress: string  // 農夫地址
  investorShare: number  // 投資人分潤百分比 (0-100)
  interestRate: number  // 利率百分比
  premiumRate: number  // 溢價率百分比
  reviewNote?: string  // 審核備註
}

// 鏈上專案查詢資料
export interface OnChainProjectData extends ProjectOnChainData {
  contractAddress: string
  deployedAt?: string
  deployer?: string
}

