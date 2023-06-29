<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	let validationError = writable('');
	let email: string = '';
	let password: string = '';
	let formSubmitted: boolean = false;
	let emailConfirmed: boolean = false;

	function isValidEmail(email: string) {
		const regex = /^\S+@\S+\.\S+$/;
		return regex.test(email);
	}

	async function signIn() {
		formSubmitted = true;

		if (!isValidEmail(email)) {
			validationError.set('Please enter a valid email.');
			return;
		}

		if (password.length < 6) {
			validationError.set('Password must be at least 6 characters');
			return;
		}

		if (!/[A-Z]/.test(password) || !/\d/.test(password)) {
			validationError.set('Password must contain at least one uppercase letter and one number');
			return;
		}

		const { data, error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password
		});

		console.log('User Created At:', data?.user?.confirmed_at);
		console.log('%cUser Creation Error: ' + error?.message, 'color: red');

		if (error) {
			validationError.set(error.message);
			return;
		}
		
		formSubmitted = false;
		validationError.set('');

		if (!error && data) {
			const user = data.user;
			if(user.email_confirmed_at !== null){
				emailConfirmed = true;
			}

			if (user.confirmed_at) {
				goto('/user/' + user.id);
			}
		}
	}
</script>

<div class="flex justify-center items-center h-screen bg-transparent">
	<div class="card w-96 h-auto bg-white rounded-lg p-8 shadow-lg text-black max-w-lg mx-auto">
		<div class="card-body flex flex-col items-center">
			<h2 class="card-title text-3xl">Welcome back!</h2>
			<input
				type="text"
				placeholder="Email"
				class="input input-bordered input-primary w-full max-w-sm text-white"
			/>
			<input
				type="password"
				placeholder="Password"
				class="input input-bordered input-primary w-full max-w-sm text-white"
			/>
			<div class="h-4" />
			<!-- This is the spacer div -->
			<button class="btn btn-outline btn-primary" on:click={signIn}>Sign In</button>
			<p class="text-red-500">{$validationError}</p>
		</div>
	</div>
</div>
