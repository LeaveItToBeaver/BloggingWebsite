<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';

	let validationError = writable('');
	let email: string = '';
	let password: string = '';

	async function signIn() {
		const { data, error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password
		});

		if (error) {
			validationError.set(error.message);
			return;
		}
		
		if (data && data.user) {
			goto('/user/' + data.user.id);
		}
	}

	async function resetPassword() {
		goto('/resetpassword')
	}
</script>


<div class="flex justify-center items-center h-screen bg-transparent">
	<div class="card w-96 h-auto bg-white rounded-lg p-8 shadow-lg text-black max-w-lg mx-auto">
		<div class="card-body flex flex-col items-center">
			<h2 class="card-title text-3xl">Welcome back!</h2>
			<input
				bind:value={email}
				type="text"
				placeholder="Email"
				class="input input-bordered input-primary w-full max-w-sm text-white"
			/>
			<input
				bind:value={password}
				type="password"
				placeholder="Password"
				class="input input-bordered input-primary w-full max-w-sm text-white"
			/>
			<div class="h-4" />

			<div class="flex flex-row min-w-full justify-around">
				<button class="btn btn-outline btn-primary" on:click={signIn}>Sign In</button>
				<a href="/signup" class="btn btn-outline btn-primary">Sign Up</a>
			</div>
			<button class="btn btn-outline btn-warning" on:click={resetPassword}>Reset Password</button>
			<p class="text-red-500">{$validationError}</p>
		</div>
	</div>
</div>
