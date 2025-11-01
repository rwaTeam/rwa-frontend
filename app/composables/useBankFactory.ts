import { ethers } from 'ethers'
import { CONTRACT_CONFIG } from '~/config/contract'
import BankFactoryABI from '~/config/BankFactory_ABI.json'

/**
 * BankFactory 合約操作 Composable
 * 提供與 BankFactory 合約交互的功能
 */
export function useBankFactory() {
  const web3Store = useWeb3Store()

  /**
   * 獲取 BankFactory 合約實例
   * @param needsSigner 是否需要 signer（寫入操作需要）
   */
  const getBankFactoryContract = (needsSigner = false) => {
    if (!web3Store.provider) {
      throw new Error('請先連接錢包')
    }

    const signerOrProvider = needsSigner ? web3Store.signer : web3Store.provider
    
    return new ethers.Contract(
      CONTRACT_CONFIG.BANK_FACTORY_ADDRESS,
      BankFactoryABI,
      signerOrProvider
    )
  }

  /**
   * 獲取所有已創建的專案合約地址
   * @returns 專案合約地址數組
   */
  const getAllProjects = async (): Promise<string[]> => {
    try {
      const contract = getBankFactoryContract(false)
      const projects = await contract.getAllProjects()
      console.log('[BankFactory] 獲取到專案列表:', projects)
      return projects
    } catch (error) {
      console.error('[BankFactory] 獲取專案列表失敗:', error)
      throw error
    }
  }

  /**
   * 獲取指定索引的專案地址
   * @param index 專案索引
   * @returns 專案合約地址
   */
  const getProjectByIndex = async (index: number): Promise<string> => {
    try {
      const contract = getBankFactoryContract(false)
      const projectAddress = await contract.allProjects(index)
      console.log(`[BankFactory] 索引 ${index} 的專案地址:`, projectAddress)
      return projectAddress
    } catch (error) {
      console.error('[BankFactory] 獲取專案地址失敗:', error)
      throw error
    }
  }

  /**
   * 創建新專案（管理員功能）
   * 注意：這通常由後端調用，前端僅用於測試
   */
  const createProject = async (params: {
    name: string
    symbol: string
    farmer: string
    totalNFTs: number
    nftPrice: string // ETH 金額（字符串）
    buildCost: string
    annualIncome: string
    investorShare: number
    interestRate: number
    premiumRate: number
  }) => {
    try {
      console.log('[BankFactory] 準備創建專案:', params)
      
      const contract = getBankFactoryContract(true)
      
      // 轉換 TWDT 金額（decimals = 6）
      const nftPriceWei = ethers.parseUnits(params.nftPrice, 6)
      const buildCostWei = ethers.parseUnits(params.buildCost, 6)
      const annualIncomeWei = ethers.parseUnits(params.annualIncome, 6)
      
      console.log('[BankFactory] 轉換後的金額:', {
        nftPriceWei: nftPriceWei.toString(),
        buildCostWei: buildCostWei.toString(),
        annualIncomeWei: annualIncomeWei.toString(),
      })
      
      const tx = await contract.createProject(
        params.name,
        params.symbol,
        params.farmer,
        params.totalNFTs,
        nftPriceWei,
        buildCostWei,
        annualIncomeWei,
        params.investorShare,
        params.interestRate,
        params.premiumRate
      )
      
      console.log('[BankFactory] 交易已發送:', tx.hash)
      const receipt = await tx.wait()
      console.log('[BankFactory] 交易已確認:', receipt)
      
      // 嘗試從事件中獲取新創建的專案地址
      let projectAddress = null
      if (receipt.logs && receipt.logs.length > 0) {
        const iface = new ethers.Interface(BankFactoryABI)
        for (const log of receipt.logs) {
          try {
            const parsed = iface.parseLog(log)
            if (parsed && parsed.name === 'ProjectCreated') {
              projectAddress = parsed.args.projectAddress
              console.log('[BankFactory] 新專案地址:', projectAddress)
              break
            }
          } catch (e) {
            // 忽略無法解析的日誌
          }
        }
      }
      
      return {
        receipt,
        projectAddress,
        txHash: tx.hash,
      }
    } catch (error) {
      console.error('[BankFactory] 創建專案失敗:', error)
      throw error
    }
  }

  /**
   * 存入資金到 BankFactory（使用 TWDT token）
   * 注意：需要先授權 TWDT 給 BankFactory 合約
   * @param amount TWDT 金額（字符串）
   */
  const depositFunds = async (amount: string) => {
    try {
      console.log('[BankFactory] 準備存款:', amount, 'TWDT')
      
      const contract = getBankFactoryContract(true)
      
      // TWDT decimals 是 6
      const amountWithDecimals = ethers.parseUnits(amount, 6)
      
      const tx = await contract.depositFunds(amountWithDecimals)
      console.log('[BankFactory] 存款交易已發送:', tx.hash)
      
      const receipt = await tx.wait()
      console.log('[BankFactory] 存款已確認:', receipt)
      
      return receipt
    } catch (error) {
      console.error('[BankFactory] 存款失敗:', error)
      throw error
    }
  }

  /**
   * 查詢 BankFactory 的 TWDT 餘額
   */
  const getFactoryBalance = async (): Promise<string> => {
    try {
      const contract = getBankFactoryContract(false)
      const balance = await contract.getFactoryBalance()
      
      // TWDT decimals 是 6
      const formattedBalance = ethers.formatUnits(balance, 6)
      console.log('[BankFactory] 工廠餘額:', formattedBalance, 'TWDT')
      
      return formattedBalance
    } catch (error) {
      console.error('[BankFactory] 獲取工廠餘額失敗:', error)
      return '0'
    }
  }

  /**
   * 獲取 TWDT 代幣地址
   */
  const getPaymentToken = async (): Promise<string> => {
    try {
      const contract = getBankFactoryContract(false)
      const tokenAddress = await contract.paymentToken()
      console.log('[BankFactory] TWDT 代幣地址:', tokenAddress)
      return tokenAddress
    } catch (error) {
      console.error('[BankFactory] 獲取代幣地址失敗:', error)
      throw error
    }
  }

  /**
   * 設置專案狀態（僅 owner）
   * @param projectAddress 專案合約地址
   * @param newStatus 新狀態（1=正常, 2=僅提領, 3=全面停止）
   */
  const setProjectStatus = async (projectAddress: string, newStatus: number) => {
    try {
      console.log('[BankFactory] 設置專案狀態:', { projectAddress, newStatus })
      
      const contract = getBankFactoryContract(true)
      const tx = await contract.setProjectStatus(projectAddress, newStatus)
      
      console.log('[BankFactory] 交易已發送:', tx.hash)
      const receipt = await tx.wait()
      console.log('[BankFactory] 狀態更新已確認:', receipt)
      
      return receipt
    } catch (error) {
      console.error('[BankFactory] 設置狀態失敗:', error)
      throw error
    }
  }

  /**
   * 獲取 BankFactory 合約地址
   */
  const getBankFactoryAddress = (): string => {
    return CONTRACT_CONFIG.BANK_FACTORY_ADDRESS
  }

  return {
    getBankFactoryContract,
    getAllProjects,
    getProjectByIndex,
    createProject,
    depositFunds,
    getFactoryBalance,
    getPaymentToken,
    setProjectStatus,
    getBankFactoryAddress,
  }
}

