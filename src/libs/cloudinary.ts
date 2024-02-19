import { v2 as cloudinary } from "cloudinary";

export default new (class CloudinaryConfig {
    upload() {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_NAME,
            api_secret: process.env.API_SECRET,
        });
    }

    async destination(image: string) {
        try {
            const cloudinaryResponse = await cloudinary.uploader.upload(`src/uploads/${image}`);
            return cloudinaryResponse.secure_url;
        } catch (error) {
            console.log(error);
        }
    }

    async delete(image: string) {
        try {
            const splitImageName = image.split("/");
            let img_public_id = splitImageName[splitImageName.length - 1];
            img_public_id = img_public_id.slice(0, -4);
            await cloudinary.uploader.destroy(img_public_id);
        } catch (error) {
            throw error;
        }
    }
})();
