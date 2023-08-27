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
			const { data: userProfile, error: userError} = await supabase
			.from('User')
			.select('id')
			.eq('id', data.user.id)
			.limit(1);

			if(userError){
				validationError.set(userError.message);
				return;
			}

			if (userProfile && userProfile.length > 0) {
				//go to users page
			} else {
				goto('/user-information');
			}
		}
	}

	async function resetPassword() {
		goto('/reset-password');
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
				<a href="/sign-up" class="btn btn-outline btn-primary">Sign Up</a>
			</div>
			<button class="btn btn-outline btn-warning" on:click={resetPassword}>Reset Password</button>
			<p class="text-red-500">{$validationError}</p>
		</div>
	</div>
</div>
