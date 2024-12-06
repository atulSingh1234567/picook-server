import { Photo } from "../models/photo.models.js";
import { User } from "../models/user.models.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utility/cloudinary.js";

const extractDimensionsFromUrl = (url) => {
    const heightMatch = url.match(/h_(\d+)/); // Matches `h_` followed by digits
    const widthMatch = url.match(/w_(\d+)/);  // Matches `w_` followed by digits

    const height = heightMatch ? parseInt(heightMatch[1], 10) : null;
    const width = widthMatch ? parseInt(widthMatch[1], 10) : null;

    return { height, width };
};

export const postPhoto = async (req, res) => {
    try {
        const { title, description, userId } = req.body
        const localFilePath = req.file.path;
        const uploadYourPhoto = await uploadOnCloudinary(localFilePath)
        const { transformed,publicId } = uploadYourPhoto
        const {height , width} = extractDimensionsFromUrl(transformed);
        console.log(height, width , "in postphoto function")
        const photo = await Photo.create({
            photoURL: transformed,
            title,
            description,
            height,
            width,
            owner: userId,
            cloudinaryPublicId:publicId
        })


        return res.status(200).json({
            message: "Pin successfully created",
            photo
        })
    } catch (error) {
        return res.status(500).json({
            message: "Photo Can not be uploaded"
        })
    }
}

export const setProfilePicture = async (req, res) => {
    try {
        const localfilepath = req.file.path;
        const userId = req.body.userId;
        const url = req.body.publicId;

        if(url){
            await deleteFromCloudinary(url)
        }
        
        const uploadYourPhoto = await uploadOnCloudinary(localfilepath);

        const {transformed,publicId} = uploadYourPhoto;

        await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    avatar: transformed,
                    avatarCloudinaryPublicId: publicId
                }
            },
            {
                new: true
            }
        )

        const user = await User.findById(userId).select("-password")
        return res.status(200).json({ message: 'Profile photo has been edited', user })
    }
    catch (error) {
        return res.status(500).json({ message: "Profile photo has been edited" })
    }
}

export const fetchPhotos = async (req, res) => {
    try {
        const userId = req.body.userId;
        const photos = await Photo.find({ owner: userId });
        return res.status(201).send(photos)
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" })
    }
}

export const savePhoto = async (req, res) => {
    try {
        const { userId, photoId } = req.body;
        if (!userId || !photoId) {
            return res.status(400).json({ message: "User ID and Photo ID are required" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { viewedPhoto: photoId } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "Photo added to viewedPhoto" });

    } catch (error) {
        console.error("Error adding photo to viewedPhoto:", error);
        res.status(500).json({ message: "Internal server error" });
    }


}


export const dbPhotos = async (req, res) => {
    try {
        const allPhotos = await Photo.find();
        return res.status(201).json({
            photo: allPhotos
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong'
        })
    }
}

export const sendSavedPhoto = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId)
        const photos = await Promise.all(
            user.viewedPhoto.map(async (id) => {
                return await Photo.findById(id);
            })
        );

        return res.status(201).json({ photos })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}


export const deleteYourPin = async (req,res)=>{
    try {
        const {cloudinaryPublicId,_id,owner} = req.body
        console.log(_id, "photoId at deleteYourPin function")
        const user = req.user
        if(user._id == owner){
            const {result} = await deleteFromCloudinary(cloudinaryPublicId)
            if(result == 'ok'){
                const response = await Photo.deleteOne({_id})
                return res.status(200).json({
                    message: 'photo deleted',
                    response
                })
            }
            else{
                return res.status(404).json({
                    message: "Not found"
                })
            }
            
        } else {
            return res.status(401).json({
                message: "You can not delete this photo"
            })
        }

    } catch (error) {
        return res.status(500).json(
            {
                message: "Internal server error"
            }
        )
    }
}