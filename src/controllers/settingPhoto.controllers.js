import { Photo } from "../models/photo.models.js";

export const postPhoto = async (req , res)=>{
    try {
        const {photoURL , description, title} = req.body;
        console.log(photoURL, title)
        const photo = await Photo.create({
            photoURL,
            title,
            description
        })
    
        res.send(photo)
    } catch (error) {
        console.log(error)
    }
}