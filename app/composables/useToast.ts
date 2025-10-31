/**
 * Toast 通知 Composable
 * 提供簡單的通知提示功能
 */

interface ToastOptions {
  title?: string
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

export function useToast() {
  /**
   * 顯示通知
   */
  const show = (options: ToastOptions) => {
    const { message, type = 'info', duration = 3000 } = options

    // 在實際應用中，可以整合更完整的 Toast 組件庫
    // 例如：vue-toastification 或自定義 Toast 組件
    
    // 目前使用簡單的 console 輸出和 alert
    console.log(`[${type.toUpperCase()}] ${message}`)
    
    // 可以在這裡觸發自定義事件或使用狀態管理
    if (typeof window !== 'undefined') {
      // 簡單的視覺回饋
      if (type === 'error') {
        console.error(message)
      } else if (type === 'success') {
        console.info(message)
      }
    }
  }

  const success = (message: string, title?: string) => {
    show({ message, title, type: 'success' })
  }

  const error = (message: string, title?: string) => {
    show({ message, title, type: 'error' })
  }

  const warning = (message: string, title?: string) => {
    show({ message, title, type: 'warning' })
  }

  const info = (message: string, title?: string) => {
    show({ message, title, type: 'info' })
  }

  return {
    show,
    success,
    error,
    warning,
    info,
  }
}

