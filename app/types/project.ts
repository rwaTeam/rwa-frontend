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

