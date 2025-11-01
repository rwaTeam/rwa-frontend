<template>
  <div class="min-h-screen bg-white">
    <Hero />
    <ProblemVision />
    <HowItWorks />
    <ValueProposition />
    <Insurance />
    <FeaturedAssets />
    <About />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Hero from '~/components/home/Hero.vue'
import ProblemVision from '~/components/home/ProblemVision.vue'
import HowItWorks from '~/components/home/HowItWorks.vue'
import ValueProposition from '~/components/home/ValueProposition.vue'
import Insurance from '~/components/home/Insurance.vue'
import FeaturedAssets from '~/components/home/FeaturedAssets.vue'
import About from '~/components/home/About.vue'
import Footer from '~/components/home/Footer.vue'

useHead({
  title: '首頁 | GreenFi Labs'
})
</script>

