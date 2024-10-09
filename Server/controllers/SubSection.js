const SubSection = require('../models/SubSection');
const Section = require('../models/Section');
const {uploadImageToCloudinary} = require('../utils/imageUploader');

exports.createSubSection = async (req , res) => {

    try{
        // fetch data
        const {sectionId ,title , description } = req.body;

        // extract videofile
        const video = req.files.video

        // velidation
        if(!sectionId || !title  || !description || !video){
            return res.status(400).json({
                success:false,
                message : "Please fill all the fields" 
            })
        }
        console.log(video)

        // upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(
            video, 
            process.env.FOLDER_NAME
        )
        console.log(uploadDetails)

        // create subsection
        const SubSectionDetails = await SubSection.create({
            title:title,
            timeDuration:`${uploadDetails.duration}`,
            description:description,
            videoUrl:uploadDetails.secure_url,
        })

        // update section using subsection objectid
        const updatedSection = await Section.findByIdAndUpdate(
            {_id:sectionId},
            { $push:{
                subSection:SubSectionDetails._id,
            } },
            {new:true},
        ).populate("subSection")

        // return res
        return res.status(200).json({
            success:true,
            message:"Subsection created successfully",
            data:updatedSection,
        })
    }
    catch(error){
        console.log("error creating new subsection",error);
        return res.status(500).json({
            success:false,
            message:"SubSection not created yet , try again",
            error:error.message,
        })
    }
}
// HW create these first and then create profile 
// Update subSection
exports.updateSubSection = async (req, res) =>{
    try{
        // get data
        const {title,subSectionId ,description, sectionId} = req.body;
        const subSection = await SubSection.findById(subSectionId)

        // data velidation
        if(!subSection){
            return res.status(400).json({
                success:false,
                message: "SubSection not found" ,
            });
        }

        if(title !== undefined){
            subSection.title = title
        }

        if(description !== undefined){
            subSection.description = description
        }

        if(req.files && req.files.video !== undefined){
            const video = req.files.video
            const uploadDetails = await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME
            )
            subSection.videoUrl = uploadDetails.secure_url
            subSection.timeDuration = `${uploadDetails.duration}`
        }
        await subSection.save()

        const updatedSection = await Section.findById(sectionId).populate("subSection")

        // return res
        return res.status(200).json({
            success:true,
            message:"Subsection updated successfully",
            data:updatedSection,
        });
    }
    catch(error){
        console.log( error);
        return res.status(500).json({
            success:false,
            message:"Internal server error",
        });
    };
};

// delete SubSection
exports.deleteSubSection = async (req, res) =>{
    try{
        // get id
        const {subSectionId, sectionId} = req.body
        await Section.findByIdAndUpdate(
            {_id:sectionId},
            {
                $pull:{
                    subSection:subSectionId,
                },
            }
        ) 
        // delete using findbyidand delete
        const subSection = await SubSection.findByIdAndDelete({_id:subSectionId})
        
        if(!subSection){
            return res.status(404).json({
                success:false,
                message:"Subsection not found",
            })
        }

        const updatedSection = await Section.findById(sectionId).populate("subSection")

        // return res
        return res.status(200).json({
            success:true,
            data:updatedSection,
            message:"Subsection deleted successfully",
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal server error",
        });
    };
};
