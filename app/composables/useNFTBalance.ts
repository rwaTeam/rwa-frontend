import { ethers } from 'ethers'
import type { ApiProject } from '~/types/project'
import SafeHarvestNFT_ABI from '~/config/SafeHarvestNFT_ABI.json'

/**
 * NFT 餘額查詢和提領 Composable
 * 用於查詢投資人在各個專案中持有的 NFT 數量和可提領收益
 */
export function useNFTBalance() {
  /**
   * 獲取 Provider（用於讀取合約資料）
   */
  const getProvider = () => {
    // 如果瀏覽器環境且有 MetaMask，優先使用 BrowserProvider
    if (typeof window !== 'undefined' && window.ethereum) {
      return new ethers.BrowserProvider(window.ethereum)
    }
    
    // 否則使用 JsonRpcProvider
    const rpcUrl = 'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
    return new ethers.JsonRpcProvider(rpcUrl)
  }

  /**
   * 查詢用戶在特定合約中持有的 NFT 數量
   * @param contractAddress NFT 合約地址
   * @param userAddress 用戶錢包地址
   * @returns NFT 持有數量
   */
  const getNFTBalance = async (
    contractAddress: string,
    userAddress: string
  ): Promise<number> => {
    try {
      if (!contractAddress || !userAddress || contractAddress === '待分配' || contractAddress === '') {
        console.log(`[NFT Balance] 跳過無效地址: contract=${contractAddress}, user=${userAddress}`)
        return 0
      }

      console.log(`[NFT Balance] 查詢合約 ${contractAddress} 的餘額，用戶: ${userAddress}`)
      
      const provider = getProvider()
      const contract = new ethers.Contract(
        contractAddress,
        SafeHarvestNFT_ABI,
        provider
      )

      const balance = await contract.balanceOf(userAddress)
      const balanceNumber = Number(balance)
      
      console.log(`[NFT Balance] 合約 ${contractAddress} 返回餘額: ${balanceNumber}`)
      
      return balanceNumber
    } catch (error: any) {
      console.error(`[NFT Balance Error] 查詢 NFT 餘額失敗 (${contractAddress}):`, error)
      console.error(`[NFT Balance Error] 錯誤詳情:`, error.message)
      return 0
    }
  }

  /**
   * 批量查詢多個專案的 NFT 持有數量
   * @param projects 專案列表
   * @param userAddress 用戶錢包地址
   * @returns 包含 NFT 餘額的專案列表（只返回持有數量 > 0 的專案）
   */
  const batchGetNFTBalances = async (
    projects: ApiProject[],
    userAddress: string
  ): Promise<Array<ApiProject & { nftBalance: number }>> => {
    if (!userAddress) {
      console.log('[Batch NFT] 沒有用戶地址')
      return []
    }

    console.log(`[Batch NFT] 開始批量查詢，總專案數: ${projects.length}`)
    
    // 顯示所有專案的合約地址狀態
    console.log(`[Batch NFT] 所有專案的合約地址狀態:`)
    projects.forEach((p, index) => {
      console.log(`  ${index + 1}. ${p.title}:`, {
        address: p.contract_address,
        isEmpty: !p.contract_address,
        isWaiting: p.contract_address === '待分配',
        status: p.status
      })
    })

    // 過濾出有合約地址的專案
    const projectsWithContract = projects.filter(
      (p) => p.contract_address && p.contract_address !== '待分配' && p.contract_address !== ''
    )

    console.log(`[Batch NFT] 有合約地址的專案數: ${projectsWithContract.length}`)
    if (projectsWithContract.length > 0) {
      console.log(`[Batch NFT] 合約地址列表:`, projectsWithContract.map(p => ({
        title: p.title,
        address: p.contract_address
      })))
    } else {
      console.warn(`[Batch NFT] ⚠️ 所有專案都沒有有效的合約地址！`)
    }

    // 並行查詢所有專案的 NFT 餘額
    const balancePromises = projectsWithContract.map((project) =>
      getNFTBalance(project.contract_address, userAddress)
        .then((balance) => ({ project, balance }))
        .catch((error) => {
          console.error(`[Batch NFT Error] 查詢專案 ${project._id} (${project.title}) 失敗:`, error)
          return { project, balance: 0 }
        })
    )

    const results = await Promise.all(balancePromises)

    console.log('[Batch NFT] 查詢結果:', results.map(r => ({
      title: r.project.title,
      address: r.project.contract_address,
      balance: r.balance
    })))

    // 只返回持有數量 > 0 的專案
    const withBalance = results
      .filter((result) => result.balance > 0)
      .map((result) => ({
        ...result.project,
        nftBalance: result.balance,
      }))

    console.log(`[Batch NFT] 持有 NFT 的專案數: ${withBalance.length}`)

    return withBalance
  }

  /**
   * 查詢專案的鏈上數據
   * @param contractAddress NFT 合約地址
   * @returns 專案鏈上數據
   */
  const getProjectOnChainData = async (contractAddress: string) => {
    try {
      if (!contractAddress || contractAddress === '待分配' || contractAddress === '') {
        return null
      }

      const provider = getProvider()
      const contract = new ethers.Contract(
        contractAddress,
        SafeHarvestNFT_ABI,
        provider
      )

      const projectData = await contract.getProjectData()
      
      // 解構返回的數據
      const [
        name,
        symbol,
        farmer,
        totalNFTs,
        nftPrice,
        totalSupply,
        buildCost,
        annualIncome,
        investorShare,
        interestRate,
        premiumRate,
        status,
      ] = projectData

      return {
        name,
        symbol,
        farmer,
        totalNFTs: Number(totalNFTs),
        nftPrice: ethers.formatEther(nftPrice),
        totalSupply: Number(totalSupply),
        buildCost: ethers.formatEther(buildCost),
        annualIncome: ethers.formatEther(annualIncome),
        investorShare: Number(investorShare),
        interestRate: Number(interestRate),
        premiumRate: Number(premiumRate),
        status: Number(status),
        // 計算專案進度（已鑄造 / 總數量）
        progress: totalNFTs > 0 ? (Number(totalSupply) / Number(totalNFTs)) * 100 : 0,
      }
    } catch (error) {
      console.error(`查詢專案鏈上數據失敗 (${contractAddress}):`, error)
      return null
    }
  }

  /**
   * 查詢用戶在特定專案中的可提領收益
   * @param contractAddress NFT 合約地址
   * @param userAddress 用戶錢包地址
   * @returns 可提領收益金額（ETH）
   */
  const getClaimableReward = async (
    contractAddress: string,
    userAddress: string
  ): Promise<string> => {
    try {
      if (!contractAddress || !userAddress || contractAddress === '待分配' || contractAddress === '') {
        return '0'
      }

      const provider = getProvider()
      const contract = new ethers.Contract(
        contractAddress,
        SafeHarvestNFT_ABI,
        provider
      )

      const reward = await contract.getClaimableReward(userAddress)
      return ethers.formatEther(reward)
    } catch (error) {
      console.error(`查詢可提領收益失敗 (${contractAddress}):`, error)
      return '0'
    }
  }

  /**
   * 提領專案收益
   * @param contractAddress NFT 合約地址
   * @returns 交易結果
   */
  const claimProjectReward = async (contractAddress: string) => {
    try {
      if (!contractAddress || contractAddress === '待分配' || contractAddress === '') {
        throw new Error('無效的合約地址')
      }

      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('請先安裝 MetaMask')
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      
      const contract = new ethers.Contract(
        contractAddress,
        SafeHarvestNFT_ABI,
        signer
      )

      // 調用 claimReward 方法
      const tx = await contract.claimReward()
      
      // 等待交易確認
      const receipt = await tx.wait()

      return {
        success: true,
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
      }
    } catch (error: any) {
      console.error(`提領收益失敗 (${contractAddress}):`, error)
      
      let errorMessage = '提領失敗，請重試'
      
      // 解析常見錯誤
      if (error.message) {
        if (error.message.includes('user rejected')) {
          errorMessage = '用戶取消交易'
        } else if (error.message.includes('insufficient funds')) {
          errorMessage = '餘額不足以支付 Gas 費用'
        } else if (error.message.includes('No claimable reward')) {
          errorMessage = '目前沒有可提領的收益'
        }
      }

      throw new Error(errorMessage)
    }
  }

  return {
    getNFTBalance,
    batchGetNFTBalances,
    getProjectOnChainData,
    getClaimableReward,
    claimProjectReward,
  }
}

