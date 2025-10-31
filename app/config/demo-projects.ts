import type { ApiProject } from '~/types/project'

/**
 * Demo 專案數據（備用）
 * 當 API 無法連接時使用
 */
export const DEMO_PROJECTS: ApiProject[] = [
  {
    "_id": "demo001",
    "title": "台南頂級芒果莊園",
    "imageURL": "https://images.unsplash.com/photo-1724144861106-bbb33df2f50a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMGZhcm0lMjBhZXJpYWx8ZW58MXx8fHwxNzYxNzYwMDMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "region": "台灣台南",
    "annual_yield_rate": "5%",
    "contract_address": "0xbAdF2c3B802B139A89D259e9F62255e92FdB477B",
    "description": "高品質出口級愛文芒果農場，擁有經過驗證的永續農業實踐和機構級保險保障。此專案提供代幣化方式存取未來收益流，並以透明的鏈上結算機制運作。",
    "total_nft": 1500,
    "nft_price": 1000,
    "insurance_company": "A保險有限公司",
    "status": "開放中",
    "crop_name": "愛文芒果"
  },
  {
    "_id": "demo002",
    "title": "花蓮紅藜生態種植計畫",
    "imageURL": "https://images.unsplash.com/photo-1749483432710-707b46a32b25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWl3YW4lMjBhZ3JpY3VsdHVyZSUyMGZpZWxkfGVufDF8fHx8MTc2MTc2MDAzM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    "region": "花蓮壽豐",
    "annual_yield_rate": "6%",
    "contract_address": "",
    "description": "推廣原住民族友善紅藜作物，支持地方永續農業。",
    "total_nft": 1000,
    "nft_price": 2000,
    "insurance_company": "A保險有限公司",
    "status": "即將推出",
    "crop_name": "紅藜"
  },
  {
    "_id": "demo003",
    "title": "嘉義高山茶葉契作專案",
    "imageURL": "https://images.unsplash.com/photo-1714588419509-3a9b5b1b959e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZmFybSUyMGFlcmlhbCUyMHZpZXd8ZW58MXx8fHwxNzYxNzYwMDM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    "region": "嘉義阿里山",
    "annual_yield_rate": "7%",
    "contract_address": "",
    "description": "契作高山茶園，以環保方式維護土壤與生態。",
    "total_nft": 800,
    "nft_price": 3000,
    "insurance_company": "B保險有限公司",
    "status": "即將推出",
    "crop_name": "高山茶"
  }
]

