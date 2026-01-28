export async function uploadImageToCloudinary(imageUri: string): Promise<string> {
    // ✅ Replace these with your actual Cloudinary credentials
    const CLOUDINARY_CLOUD_NAME = "dbucyiloh";
    const CLOUDINARY_UPLOAD_PRESET = "drox_uploads";

    const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

    console.log("📤 Starting upload to Cloudinary...");
    console.log("Image URI:", imageUri);
    console.log("Cloudinary URL:", CLOUDINARY_URL);

    try {
        // Create FormData
        const formData = new FormData();

        // Get file info
        const filename = imageUri.split('/').pop() || 'image.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        console.log("File info:", { filename, type });

        // Append image file
        formData.append('file', {
            uri: imageUri,
            type: type,
            name: filename,
        } as any);

        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        console.log("Making request to Cloudinary...");

        // Upload to Cloudinary
        const response = await fetch(CLOUDINARY_URL, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Cloudinary error response:', errorText);

            try {
                const errorData = JSON.parse(errorText);
                throw new Error(`Cloudinary error: ${errorData.error?.message || 'Upload failed'}`);
            } catch {
                throw new Error(`Cloudinary error: ${response.status} ${response.statusText}`);
            }
        }

        const data = await response.json();
        console.log("Cloudinary response:", data);

        if (data.secure_url) {
            console.log("✅ Upload successful!");
            return data.secure_url;
        } else {
            throw new Error('No secure_url in Cloudinary response');
        }
    } catch (error: any) {
        console.error('❌ Image upload error:', error);
        throw error;
    }
}

export async function uploadMultipleImages(imageUris: string[]): Promise<string[]> {
    console.log(`📤 Uploading ${imageUris.length} images...`);

    const uploadPromises = imageUris.map((uri, index) => {
        console.log(`Starting upload for image ${index + 1}`);
        return uploadImageToCloudinary(uri);
    });

    return Promise.all(uploadPromises);
}