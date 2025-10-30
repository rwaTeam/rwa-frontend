<script setup lang="ts">
import Card from '~/components/ui/card/Card.vue'

interface ProjectAboutProps {
  description: string
  farmStory: string
  scale: string
  method: string
  targetMarket: string
  farmImage?: string
}

const props = defineProps<ProjectAboutProps>()
</script>

<template>
  <section class="space-y-6">
    <h2 class="text-secondary">
      專案介紹
    </h2>
    
    <Card class="p-6">
      <h3 class="mb-4 text-secondary">
        專案背景
      </h3>
      <p class="text-secondary/80 mb-4 leading-relaxed">
        {{ description }}
      </p>
      
      <div class="space-y-3">
        <div class="flex items-start">
          <span class="text-sm text-secondary/60 min-w-[100px]">種植規模：</span>
          <span class="text-secondary">{{ scale }}</span>
        </div>
        <div class="flex items-start">
          <span class="text-sm text-secondary/60 min-w-[100px]">種植方法：</span>
          <span class="text-secondary">{{ method }}</span>
        </div>
        <div class="flex items-start">
          <span class="text-sm text-secondary/60 min-w-[100px]">目標市場：</span>
          <span class="text-secondary">{{ targetMarket }}</span>
        </div>
      </div>
    </Card>
    
    <Card class="p-6 bg-primary/5 border-primary/20">
      <h4 class="mb-3 text-secondary">
        農夫故事
      </h4>
      <p class="text-secondary/80 leading-relaxed">
        {{ farmStory }}
      </p>
    </Card>
  </section>
</template>

