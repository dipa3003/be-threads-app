import { v2 as cloudinary } from "cloudinary";

export default new (class CloudinaryConfig {
    upload() {
        cloudinary.config({
            cloud_name: "ddkwrue2q",
            api_key: "252898562531645",
            api_secret: "xG15q34WSL7eUsYEYqzs_x6kvuA",
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
