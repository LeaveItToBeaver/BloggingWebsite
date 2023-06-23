<script lang="ts">
  import { onMount } from 'svelte';

  let particles = [];

  onMount(() => {
    function createParticle(x, y, color) {
      const particle = {
        x,
        y,
        color,
        size: Math.floor(Math.random() * 30 + 8),
        destinationX: (Math.random() - 0.5) * 300,
        destinationY: (Math.random() - 0.5) * 300,
        rotation: Math.random() * 520,
        delay: Math.random() * 200,
        opacity: 1
      };

      particles = [...particles, particle];

      setTimeout(() => {
        particle.opacity = 0;
      }, 0);

      setTimeout(() => {
        particles = particles.filter(p => p !== particle);
      }, 500 + particle.delay);
    }

    document.addEventListener('click', function (event) {
      for (let i = 0; i < 30; i++) {
        createParticle(event.clientX, event.clientY, getRandomColor());
      }
    });
  });

  function getRandomColor() {
    const colors = ['#f94144', '#f3722c', '#f8961e', '#f9844a', '#f9c74f', '#90be6d', '#43aa8b', '#577590'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
</script>

<style>
  .particle {
    position: absolute;
    border-radius: 50%;
    transition: transform 500ms linear, opacity 500ms;
  }
</style>

{#each particles as particle, i (particle.x + particle.y + i)}
  <div
    class="particle"
    style="
      background-color: {particle.color};
      left: {particle.x - particle.size / 2}px;
      top: {particle.y - particle.size / 2}px;
      width: {particle.size}px;
      height: {particle.size}px;
      transform: translate({particle.destinationX}px, {particle.destinationY}px) rotate({particle.rotation}deg);
      opacity: {particle.opacity};
      transition-delay: {particle.delay}ms;
    "
    key={i}
  ></div>
{/each}
