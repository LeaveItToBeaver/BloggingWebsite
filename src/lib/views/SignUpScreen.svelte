<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import Textbox from '$lib/components/userlogin/AuthTextBox.svelte';
	import Button from '$lib/components/userlogin/AuthButton.svelte';
	import { writable } from 'svelte/store';

	let validationError = writable('');
	let email: string = '';
	let password: string = '';
	let secondPassword: string = '';
	let formSubmitted: boolean = false;

	function isValidEmail(email: string) {
		const regex = /^\S+@\S+\.\S+$/;
		return regex.test(email);
	}

	async function signUp() {
		formSubmitted = true;

		if (!isValidEmail) {
			validationError.set('Please enter a valid email.');
			return;
		}

		if (password !== secondPassword) {
			validationError.set('Passwords do not match');
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

		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: password
		});

		console.log('User Created At:', data.session?.user.confirmed_at);
		console.log('%cUser Creation Error: ' + error?.cause, 'color: red');

		if (error) {
			validationError.set(error.message);
			return;
		}

		formSubmitted = false;
		validationError.set('');
	}
</script>

<div class="flex w-full h-screen bg-transparent justify-center items-center text-white">
	<div
		class="flex flex-col bg-white rounded-lg p-8 shadow-lg text-black max-w-lg mx-auto items-center"
	>
		<h2 class="text-2xl font-bold mb-6 text-center">Hey, Nice to meet you!</h2>
		<Textbox bind:value={email} placeholder="Email" on:input={() => (formSubmitted = false)} />
		<Textbox
			bind:value={password}
			placeholder="Password"
			password={true}
			cssClass={password !== secondPassword && password && secondPassword && formSubmitted
				? 'passwordMismatch'
				: ''}
		/>
		<Textbox
			bind:value={secondPassword}
			placeholder="Confirm Password"
			password={true}
			cssClass={password !== secondPassword && password && secondPassword && formSubmitted
				? 'passwordMismatch'
				: ''}
		/>
		<Button label="Sign Up" on:click={signUp} />
		<p class="text-red-500">{$validationError}</p>
	</div>
</div>
