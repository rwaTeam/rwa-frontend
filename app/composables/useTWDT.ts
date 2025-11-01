import { ethers } from 'ethers'
import { CONTRACT_CONFIG } from '~/config/contract'
import TWDT_ABI from '~/config/TWDT_ABI.json'

/**
 * TWDT 代幣操作 Composable
 * 提供與 TWDT ERC20 代幣合約交互的功能
 */
export function useTWDT() {
  const web3Store = useWeb3Store()

  /**
   * 獲取 TWDT 合約實例
   * @param needsSigner 是否需要 signer（寫入操作需要）
   */
  const getTWDTContract = (needsSigner = false) => {
    if (!web3Store.provider) {
      throw new Error('請先連接錢包')
    }

    const signerOrProvider = needsSigner ? web3Store.signer : web3Store.provider
    
    return new ethers.Contract(
      CONTRACT_CONFIG.TWDT_TOKEN_ADDRESS,
      TWDT_ABI,
      signerOrProvider
    )
  }

  /**
   * 獲取 TWDT 餘額
   * @param address 要查詢的地址
   * @returns TWDT 餘額（格式化後的字符串）
   */
  const getBalance = async (address: string): Promise<string> => {
    try {
      const contract = getTWDTContract(false)
      const balance = await contract.balanceOf(address)
      const decimals = await contract.decimals()
      
      const formattedBalance = ethers.formatUnits(balance, decimals)
      console.log(`[TWDT] 地址 ${address} 的餘額:`, formattedBalance)
      
      return formattedBalance
    } catch (error) {
      console.error('[TWDT] 獲取餘額失敗:', error)
      return '0'
    }
  }

  /**
   * 獲取當前連接錢包的 TWDT 餘額
   * @returns TWDT 餘額（格式化後的字符串）
   */
  const getMyBalance = async (): Promise<string> => {
    if (!web3Store.account) {
      throw new Error('請先連接錢包')
    }
    return getBalance(web3Store.account)
  }

  /**
   * 轉移 TWDT 代幣
   * @param recipient 接收地址
   * @param amount TWDT 金額（字符串）
   */
  const transfer = async (recipient: string, amount: string) => {
    try {
      console.log('[TWDT] 準備轉帳:', { recipient, amount })
      
      const contract = getTWDTContract(true)
      const decimals = await contract.decimals()
      const amountWei = ethers.parseUnits(amount, decimals)
      
      const tx = await contract.transfer(recipient, amountWei)
      console.log('[TWDT] 轉帳交易已發送:', tx.hash)
      
      const receipt = await tx.wait()
      console.log('[TWDT] 轉帳已確認:', receipt)
      
      return receipt
    } catch (error) {
      console.error('[TWDT] 轉帳失敗:', error)
      throw error
    }
  }

  /**
   * 授權 TWDT 給其他合約使用
   * @param spender 被授權的合約或地址
   * @param amount TWDT 金額（字符串）
   */
  const approve = async (spender: string, amount: string) => {
    try {
      console.log('[TWDT] 準備授權:', { spender, amount })
      
      const contract = getTWDTContract(true)
      const decimals = await contract.decimals()
      const amountWei = ethers.parseUnits(amount, decimals)
      
      const tx = await contract.approve(spender, amountWei)
      console.log('[TWDT] 授權交易已發送:', tx.hash)
      
      const receipt = await tx.wait()
      console.log('[TWDT] 授權已確認:', receipt)
      
      return receipt
    } catch (error) {
      console.error('[TWDT] 授權失敗:', error)
      throw error
    }
  }

  /**
   * 檢查授權額度
   * @param owner 代幣擁有者地址
   * @param spender 被授權的合約或地址
   * @returns 授權額度（格式化後的字符串）
   */
  const getAllowance = async (owner: string, spender: string): Promise<string> => {
    try {
      const contract = getTWDTContract(false)
      const allowance = await contract.allowance(owner, spender)
      const decimals = await contract.decimals()
      
      const formattedAllowance = ethers.formatUnits(allowance, decimals)
      console.log(`[TWDT] ${owner} 授權給 ${spender} 的額度:`, formattedAllowance)
      
      return formattedAllowance
    } catch (error) {
      console.error('[TWDT] 獲取授權額度失敗:', error)
      return '0'
    }
  }

  /**
   * 獲取 TWDT 總供應量
   * @returns 總供應量（格式化後的字符串）
   */
  const getTotalSupply = async (): Promise<string> => {
    try {
      const contract = getTWDTContract(false)
      const totalSupply = await contract.totalSupply()
      const decimals = await contract.decimals()
      
      const formattedSupply = ethers.formatUnits(totalSupply, decimals)
      console.log('[TWDT] 總供應量:', formattedSupply)
      
      return formattedSupply
    } catch (error) {
      console.error('[TWDT] 獲取總供應量失敗:', error)
      return '0'
    }
  }

  /**
   * 獲取 TWDT 代幣資訊
   * @returns 代幣名稱、符號和精度
   */
  const getTokenInfo = async () => {
    try {
      const contract = getTWDTContract(false)
      
      const [name, symbol, decimals] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
      ])
      
      console.log('[TWDT] 代幣資訊:', { name, symbol, decimals })
      
      return { name, symbol, decimals }
    } catch (error) {
      console.error('[TWDT] 獲取代幣資訊失敗:', error)
      return { name: 'Unknown', symbol: 'TWDT', decimals: 18 }
    }
  }

  /**
   * 獲取 TWDT 合約地址
   */
  const getTWDTAddress = (): string => {
    return CONTRACT_CONFIG.TWDT_TOKEN_ADDRESS
  }

  return {
    getTWDTContract,
    getBalance,
    getMyBalance,
    transfer,
    approve,
    getAllowance,
    getTotalSupply,
    getTokenInfo,
    getTWDTAddress,
  }
}

