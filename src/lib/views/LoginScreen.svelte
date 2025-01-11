<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import { userStore } from '$lib/stores/UserStore';

	let validationError = writable('');
	let email: string = '';
	let password: string = '';

	async function signIn() {
		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email: email,
				password: password
			});

			if (error) {
				validationError.set(error.message);
				return;
			}

			if (data && data.user) {
				await userStore.setUser(data.user); // This will also fetch the profile image

				let { data: userProfile, error: userError } = await supabase
					.from('Users')
					.select('id, username, first_name, last_name')
					.eq('id', data.user.id)
					.single();

				if (userError && userError.code == 'PGRST116') {
					await supabase.from('Users').insert([{ id: data.user.id }]);
					goto('/user-information');
					return;
				}

				if (!userProfile?.username || !userProfile?.first_name || !userProfile?.last_name) {
					goto('/user-information');
				} else {
					goto(`/${userProfile.username}`);
				}
			}
		} catch (error) {
			console.error('Sign in error:', error);
			validationError.set('An unexpected error occurred');
		}
	}

	async function resetPassword() {
		goto('/reset-password');
	}
</script>

<div class="flex justify-center items-center h-screen bg-transparent">
	<div class="card w-96 h-auto bg-white rounded-lg p-8 shadow-lg text-black max-w-lg mx-auto">
		<div class="card-body flex flex-col items-center">
			<h2 class="card-title text-3xl">Login</h2>
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
