<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import account_circle from '../../icons/account_circle.svg';

	let validationError = writable('');
	let fName = '';
	let lName = '';
	let enteredUserName = '';
	let globalUserID = '';
	let blogName = '';
	let profileImageUrl = account_circle; // Default image

	async function isUsernameTaken(username: string, currentUserID: string) {
		const { data, error } = await supabase
			.from('Users')
			.select('username')
			.eq('username', username)
			.limit(1);

		if(data && data.length > 0) {
			const { data, error } = await supabase
				.from('Users')
				.select('username, id')
				.eq('username', username)
				.single();
			if (error) throw error;
			return data.id != currentUserID;
		}
	}

	async function submitInfo() {
		try {
			const currentUser = supabase.auth.getUser();
			const userID = (await currentUser).data.user?.id;
			userID == null ? null : globalUserID = userID;
			const userNameExists = await isUsernameTaken(enteredUserName, globalUserID);

			if (!currentUser) {
				validationError.set('User is not authenticated. Check your email.');
				return;
			}

			if (userNameExists) {
				validationError.set('Username already exsists.');
				return;
			}
		
			const { data: existingProfile, error: profileError } = await supabase
				.from('Users')
				.select('id')
				.eq('id', userID)
				.limit(1);

			if (profileError) throw profileError;
			if (existingProfile && existingProfile.length > 0) {
				console.log("Updating first name to " 
				 + fName 
				 + ", last name to " 
				 + lName
				 + " and username to: " 
				 + enteredUserName)

				const { data, error } = await supabase
					.from('Users')
					.update({
						username: enteredUserName,
						first_name: fName,
						last_name: lName
					})
					.eq('id', userID)
					.select('id');

				console.log('Data Updated successfully: ', data);
				if (error) {
					console.log('Error updating data: ', error);
				}

				goto(`/${enteredUserName}`);
			} else {
				const { data, error } = await supabase
					.from('Users')
					.insert([
						{
							id: userID,
							username: enteredUserName,
							first_name: fName,
							last_name: lName
						}
					])
					.select();

				console.log('Data Inserted successfully: ', data);
				goto(`/${enteredUserName}`);

				if (error) {
					console.log('Error updating data: ', error);
				}
			}
		} catch (e) {
			console.error(e);
			validationError.set('An error occurred. Please try in a little bit.');
		}
	}
	async function loadUserInfo() {
		const currentUser = supabase.auth.getUser();
		const userID = (await currentUser).data.user?.id;
		const { data, error } = await supabase
			.from('Users')
			.select('username, first_name, last_name, profile_image_url, blog_name')
			.eq('id', userID)
			.single();

		if (data) {
			enteredUserName = data.username;
			fName = data.first_name;
			lName = data.last_name;
			profileImageUrl = data.profile_image_url;
			blogName = data.blog_name;
		}
		if (error) {
			console.log(error.message);
		}
	}

	async function uploadImage(event: Event) {
		const inputElement = event.target as HTMLInputElement;
		const file = inputElement.files?.[0];
		const currentUser = supabase.auth.getUser();
		const userID = (await currentUser).data.user?.id;

		if (!file) return;
		const filePath = `${userID}/profile_images/${file.name}`;
		let { error: uploadError } = await supabase
			.storage
			.from('avatars')
			.upload(filePath, file);

		if (uploadError) {
			console.error(uploadError);
		} else {
			profileImageUrl = filePath; // Update the URL in your state
		}
	}

	loadUserInfo();
</script>

<div class="flex flex-col items-center justify-center h-screen">
    <div class="card bg-white w-4/5 max-w-2xl mx-auto my-4 flex flex-row items-center" style="height: fit-content; max-height: 50%">
        <div class="flex flex-col justify-center items-center w-1/4 h-full my-3 mx-2">
			<img src={account_circle} alt="User Photo" class="user-photo rounded-full mb-3" style="width: 70%; height: auto; max-height: 70%;" aria-hidden="true">
            <div>
                <h2 class="text-lg font-semibold text-center">{fName} {lName}</h2>
            </div>
        </div>
        <div class="flex flex-col justify-center w-3/4 h-full my-3 mx-2">
            <h3 class="text-xl font-semibold mb-2 text-center">{blogName}</h3>
            <div class="bio text-sm text-center">
                <!-- <p>{bio}</p> -->
            </div>
        </div>
    </div>
</div>
