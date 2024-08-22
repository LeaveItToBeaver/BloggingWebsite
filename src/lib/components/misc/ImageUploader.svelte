<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import Cropper from 'cropperjs';
	import 'cropperjs/dist/cropper.css';
	import { supabase } from '$lib/supabaseClient';

	let cropper: Cropper;
	export let profileImageUrl = ''; 
	let imageUrl: string = '';

	async function uploadImage(event: Event) {
		const inputElement = event.target as HTMLInputElement;
		const file = inputElement.files?.[0];
		const currentUser = await supabase.auth.getUser();
		const userID = currentUser.data.user?.id;

		if (!file || !userID) return;

		// Generate unique ID for the image
		const uniqueImageID = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
		const filePath = `${userID}/profile_images/${uniqueImageID}.jpg`;

		// Create a URL for the selected image file
		imageUrl = URL.createObjectURL(file);
	}

	// Initialize the cropper once the image URL is set and the image is rendered
	afterUpdate(() => {
		if (imageUrl && document.getElementById('image')) {
			if (cropper) {
				cropper.destroy(); // Destroy previous instance
			}
			const imageElement = document.getElementById('image') as HTMLImageElement;
			cropper = new Cropper(imageElement, {
				aspectRatio: 1,
				viewMode: 1,
				dragMode: 'move',
				cropBoxMovable: true,
				cropBoxResizable: false,
				guides: false,
				background: false,
				minContainerHeight: 400,
				minContainerWidth: 400
			});
		}
	});

	async function cropAndUploadImage() {
    if (!cropper) return;

    // Get the cropped canvas
    const canvas = cropper.getCroppedCanvas({
        width: 300,
        height: 300,
        fillColor: '#fff',
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
    });

    // Convert the canvas to a Blob and upload it to Supabase
    canvas.toBlob(async (blob) => {
        if (blob) {
            const userID = (await supabase.auth.getUser()).data.user?.id;
            const uniqueImageID = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const filePath = `${userID}/profile_images/${uniqueImageID}.jpg`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, blob);

            if (uploadError) {
                console.error('Upload failed:', uploadError);
            } else {
                // Fetch the public URL from Supabase Storage
                const { data: { publicUrl } } = supabase
                    .storage
                    .from('avatars')
                    .getPublicUrl(filePath);

				console.log('Public images URL: ', publicUrl);

                if (publicUrl) {
                    profileImageUrl = publicUrl; // Use the full URL
                    console.log('Uploaded image path:', profileImageUrl);

                    // Update user profile in the database with the new image URL
                    const { error: updateError } = await supabase
                        .from('Users')  // Ensure this is the correct table name
                        .update({ profile_image_url: profileImageUrl })
                        .eq('id', userID);

                    if (updateError) {
                        console.error('Failed to update user profile:', updateError);
                    } else {
                        console.log('User profile updated successfully');
                    }
                }
            }
        }
    }, 'image/jpeg');
}
</script>

<div>
	<input type="file" accept="image/*" on:change={uploadImage} />

	{#if imageUrl}
		<div>
			<!-- svelte-ignore a11y-img-redundant-alt -->
			<img id="image" src={imageUrl} alt="Selected image for cropping" />
		</div>
		<button on:click={cropAndUploadImage}>Crop & Upload</button>
	{/if}
</div>

<style>
	/* Add styles for the image cropper and buttons */
</style>
