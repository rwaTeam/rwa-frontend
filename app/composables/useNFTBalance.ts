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
   * 查詢用戶在特定合約中的完整資料（NFT 數量、待領收益、Token IDs）
   * @param contractAddress NFT 合約地址
   * @param userAddress 用戶錢包地址
   * @returns 用戶資料物件或 null
   */
  const getUserProfileData = async (
    contractAddress: string,
    userAddress: string
  ): Promise<{ nftCount: number; unclaimedRewards: string; tokenIds: bigint[] } | null> => {
    try {
      if (!contractAddress || !userAddress || contractAddress === '待分配' || contractAddress === '') {
        console.log(`[User Profile] 跳過無效地址: contract=${contractAddress}, user=${userAddress}`)
        return null
      }

      console.log(`[User Profile] 查詢合約 ${contractAddress} 的用戶資料，用戶: ${userAddress}`)
      
      const provider = getProvider()
      const contract = new ethers.Contract(
        contractAddress,
        SafeHarvestNFT_ABI,
        provider
      ) as any

      // 調用智能合約的 getUserProfile 方法
      const [nftCount, unclaimedRewards, tokenIds] = await contract.getUserProfile(userAddress)
      
      console.log(`[User Profile] 原始 unclaimedRewards: ${unclaimedRewards.toString()}`)
      
      // 查詢 TWDT 代幣的 decimals
      let tokenDecimals = 6 // TWDT 默認值為 6
      try {
        const paymentTokenAddress = await contract.paymentToken()
        const tokenContract = new ethers.Contract(
          paymentTokenAddress,
          ['function decimals() view returns (uint8)'],
          provider
        ) as any
        tokenDecimals = await tokenContract.decimals()
        console.log(`[User Profile] ✓ TWDT decimals: ${tokenDecimals}`)
      } catch (error: any) {
        console.warn('[User Profile] ✗ 無法查詢 TWDT decimals，使用默認值 6')
      }
      
      const result = {
        nftCount: Number(nftCount),
        unclaimedRewards: ethers.formatUnits(unclaimedRewards, tokenDecimals),
        tokenIds: tokenIds.map((id: any) => BigInt(id.toString()))
      }
      
      console.log(`[User Profile] 合約 ${contractAddress} 返回用戶資料:`, result)
      return result
    } catch (error: any) {
      console.error(`[User Profile Error] 查詢用戶資料失敗 (${contractAddress}):`, error)
      console.error(`[User Profile Error] 錯誤詳情:`, error.message)
      return null
    }
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
      const profile = await getUserProfileData(contractAddress, userAddress)
      return profile ? profile.nftCount : 0
    } catch (error: any) {
      console.error(`[NFT Balance Error] 查詢 NFT 餘額失敗 (${contractAddress}):`, error)
      return 0
    }
  }

  /**
   * 批量查詢多個專案的 NFT 持有數量和待領收益
   * @param projects 專案列表
   * @param userAddress 用戶錢包地址
   * @returns 包含 NFT 餘額和待領收益的專案列表（只返回持有數量 > 0 的專案）
   */
  const batchGetNFTBalances = async (
    projects: ApiProject[],
    userAddress: string
  ): Promise<Array<ApiProject & { nftBalance: number; unclaimedRewards: string }>> => {
    if (!userAddress) {
      console.log('[Batch NFT] 沒有用戶地址')
      return []
    }

    console.log(`[Batch NFT v2.0] 🔄 開始批量查詢，總專案數: ${projects.length}, 使用 decimals: 6`)
    
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

    // 並行查詢所有專案的用戶資料（NFT 餘額 + 待領收益）
    const profilePromises = projectsWithContract.map((project) => {
      console.log(`[Batch NFT] 📞 正在調用 getUserProfileData，合約: ${project.contract_address}`)
      return getUserProfileData(project.contract_address, userAddress)
        .then((profile) => {
          console.log(`[Batch NFT] ✅ getUserProfileData 返回:`, profile)
          return { project, profile }
        })
        .catch((error) => {
          console.error(`[Batch NFT Error] 查詢專案 ${project._id} (${project.title}) 失敗:`, error)
          return { project, profile: null }
        })
    })

    const results = await Promise.all(profilePromises)

    console.log('[Batch NFT] 查詢結果:', results.map(r => ({
      title: r.project.title,
      address: r.project.contract_address,
      nftCount: r.profile?.nftCount || 0,
      unclaimedRewards: r.profile?.unclaimedRewards || '0'
    })))

    // 只返回持有數量 > 0 的專案
    const withBalance = results
      .filter((result) => result.profile && result.profile.nftCount > 0)
      .map((result) => ({
        ...result.project,
        nftBalance: result.profile!.nftCount,
        unclaimedRewards: result.profile!.unclaimedRewards,
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
        console.log('[OnChain] 跳過無效的合約地址')
        return null
      }

      console.log(`[OnChain] 開始查詢合約: ${contractAddress}`)

      const provider = getProvider()
      const contract = new ethers.Contract(
        contractAddress,
        SafeHarvestNFT_ABI,
        provider
      ) as any

      // 先檢查合約是否存在（檢查合約代碼）
      const code = await provider.getCode(contractAddress)
      if (code === '0x' || code === '0x0') {
        console.warn(`[OnChain] 合約地址 ${contractAddress} 上沒有部署合約`)
        return null
      }

      console.log(`[OnChain] 合約存在，開始調用函數`)

      // 分別嘗試調用函數，提供更詳細的錯誤信息
      let projectData1, projectData2, name, symbol

      try {
        projectData1 = await contract.getProjectData1()
        console.log('[OnChain] ✓ getProjectData1 成功')
      } catch (error: any) {
        console.error('[OnChain] ✗ getProjectData1 失敗:', error.message)
        throw new Error(`getProjectData1 調用失敗: ${error.message}`)
      }

      try {
        projectData2 = await contract.getProjectData2()
        console.log('[OnChain] ✓ getProjectData2 成功')
      } catch (error: any) {
        console.error('[OnChain] ✗ getProjectData2 失敗:', error.message)
        throw new Error(`getProjectData2 調用失敗: ${error.message}`)
      }

      try {
        name = await contract.name()
        console.log('[OnChain] ✓ name 成功:', name)
      } catch (error: any) {
        console.warn('[OnChain] ✗ name 失敗，使用默認值')
        name = 'Unknown'
      }

      try {
        symbol = await contract.symbol()
        console.log('[OnChain] ✓ symbol 成功:', symbol)
      } catch (error: any) {
        console.warn('[OnChain] ✗ symbol 失敗，使用默認值')
        symbol = 'NFT'
      }
      
      // 解構 getProjectData1 返回的數據
      const [
        currentStatus,
        projectOwner,
        projectFarmer,
        nftTotalSupply,
        nftMintedCount,
        nftPricePerUnit,
        projectBuildCost,
        projectAnnualIncome,
        projectInvestorShare,
        projectInterestRate,
        projectPremiumRate,
      ] = projectData1

      // 解構 getProjectData2 返回的數據
      const [
        projectCurrentYear,
        projectCumulativePrincipal,
        projectRemainingPrincipal,
        projectBuybackPrice,
        projectBuybackActive,
        projectPaymentToken,
        projectFactory,
      ] = projectData2

      // 查詢 TWDT 代幣的 decimals
      let tokenDecimals = 6 // TWDT 默認值為 6
      try {
        const tokenContract = new ethers.Contract(
          projectPaymentToken,
          ['function decimals() view returns (uint8)'],
          provider
        ) as any
        tokenDecimals = await tokenContract.decimals()
        console.log(`[OnChain] ✓ TWDT decimals: ${tokenDecimals}`)
      } catch (error: any) {
        console.warn('[OnChain] ✗ 無法查詢 TWDT decimals，使用默認值 6')
      }

      const result = {
        // 基本資訊
        name,
        symbol,
        status: Number(currentStatus),
        owner: projectOwner,
        farmer: projectFarmer,
        
        // NFT 資訊
        totalNFTs: Number(nftTotalSupply),
        mintedNFTs: Number(nftMintedCount),
        totalSupply: Number(nftMintedCount), // 已鑄造數量
        nftPrice: ethers.formatUnits(nftPricePerUnit, tokenDecimals),
        
        // 金融參數
        buildCost: ethers.formatUnits(projectBuildCost, tokenDecimals),
        annualIncome: ethers.formatUnits(projectAnnualIncome, tokenDecimals),
        investorShare: Number(projectInvestorShare),
        interestRate: Number(projectInterestRate),
        premiumRate: Number(projectPremiumRate),
        
        // 收益狀態
        currentYear: Number(projectCurrentYear),
        cumulativePrincipal: ethers.formatUnits(projectCumulativePrincipal, tokenDecimals),
        remainingPrincipal: ethers.formatUnits(projectRemainingPrincipal, tokenDecimals),
        buybackPrice: ethers.formatUnits(projectBuybackPrice, tokenDecimals),
        buybackActive: projectBuybackActive,
        
        // 合約資訊
        paymentToken: projectPaymentToken,
        factory: projectFactory,
        tokenDecimals: Number(tokenDecimals), // 返回 decimals 供其他地方使用
        
        // 計算專案進度（已鑄造 / 總數量）
        progress: Number(nftTotalSupply) > 0 ? (Number(nftMintedCount) / Number(nftTotalSupply)) * 100 : 0,
      }

      console.log('[OnChain] 數據查詢成功:', result)
      return result
    } catch (error: any) {
      console.error(`[OnChain Error] 查詢專案鏈上數據失敗 (${contractAddress}):`, error)
      console.error(`[OnChain Error] 錯誤類型: ${error.code || 'unknown'}`)
      console.error(`[OnChain Error] 錯誤信息: ${error.message}`)
      
      // 如果是合約不存在或版本不匹配的錯誤，提供友好提示
      if (error.message.includes('missing revert data') || error.message.includes('CALL_EXCEPTION')) {
        console.warn(`[OnChain] 合約可能尚未部署或版本不匹配，請確認合約地址: ${contractAddress}`)
      }
      
      return null
    }
  }

  /**
   * 查詢用戶在特定專案中的可提領收益
   * @param contractAddress NFT 合約地址
   * @param userAddress 用戶錢包地址
   * @returns 可提領收益金額（TWDT）
   */
  const getClaimableReward = async (
    contractAddress: string,
    userAddress: string
  ): Promise<string> => {
    try {
      const profile = await getUserProfileData(contractAddress, userAddress)
      return profile ? profile.unclaimedRewards : '0'
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
      ) as any

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
    getUserProfileData,
    getNFTBalance,
    batchGetNFTBalances,
    getProjectOnChainData,
    getClaimableReward,
    claimProjectReward,
  }
}

