<template>
  <div class="min-h-screen flex items-center justify-center bg-muted">
    <div class="max-w-md mx-auto px-6 text-center">
      <div class="mb-8">
        <h1 class="text-6xl font-bold text-foreground mb-4">
          {{ error.statusCode }}
        </h1>
        <h2 class="text-2xl font-medium text-foreground/80 mb-2">
          {{ error.statusCode === 404 ? 'Page Not Found' : 'An Error Occurred' }}
        </h2>
        <p class="text-foreground/60">
          {{ error.message }}
        </p>
      </div>
      
      <div class="flex gap-4 justify-center">
        <button
          @click="handleError"
          class="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl transition-colors"
        >
          Go Home
        </button>
        <button
          v-if="error.statusCode !== 404"
          @click="clearError({ redirect: '/' })"
          class="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-xl transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ErrorProps {
  error: {
    statusCode: number
    message: string
  }
}

const props = defineProps<ErrorProps>()

const handleError = () => clearError({ redirect: '/' })
</script>

