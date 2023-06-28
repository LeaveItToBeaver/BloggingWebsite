<script lang="ts">
	import { onDestroy } from 'svelte';

	type Particle = {
		x: number;
		y: number;
		size: number;
		speedX: number;
		speedY: number;
		color: string;
	};

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let particles: Particle[] = [];

	const colors = [
		'#f94144',
		'#f3722c',
		'#f8961e',
		'#f9844a',
		'#f9c74f',
		'#90be6d',
		'#43aa8b',
		'#577590'
	];

	let animationId: number;

	function canvasClick(e: MouseEvent) {
		const size = Math.random() * 5 + 1;
		const speed = Math.random() * 3 - 1.5; // a little bit of upward force
		for (let i = 0; i < 30; i++) {
			particles.push({
				x: e.clientX,
				y: e.clientY,
				size,
				speedX: Math.random() * speed,
				speedY: Math.random() * speed,
				color: colors[Math.floor(Math.random() * colors.length)]
			});
		}
	}

	function animateParticles() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		particles.forEach((particle, i) => {
			particle.x += particle.speedX;
			particle.y += particle.speedY;
			particle.size -= 0.05;

			if (particle.size <= 0.1) {
				particles.splice(i, 1);
			} else {
				ctx.fillStyle = particle.color;
				ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
			}
		});
		animationId = requestAnimationFrame(animateParticles);
	}

	onDestroy(() => {
		if (typeof cancelAnimationFrame !== 'undefined') {
			cancelAnimationFrame(animationId);
		}
	});

	// This function runs once the div and canvas have been mounted to the DOM
	function afterUpdate() {
		ctx = canvas.getContext('2d');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		window.addEventListener('resize', () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		});
		animationId = requestAnimationFrame(animateParticles);
	}
</script>

<div
	on:click={canvasClick}
	style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none;"
>
	<canvas
		bind:this={canvas}
		style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
	/>
</div>

<svelte:window on:resize={afterUpdate} on:load={afterUpdate} />
