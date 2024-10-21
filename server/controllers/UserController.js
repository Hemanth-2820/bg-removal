import { Webhook } from "svix"
import userModel from "../models/userModel.js";

//api controller function to manage clerk user with databse
// http://localhost:4000/api/user/webhooks

const clerkWebhooks = async (req,res) => {
    try {
        // create a svix instance with clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        await whook.verify(JSON.stringify(req.body),{
            "svix-id":req.headers["svix-id"],
            "svix-timestamp":req.headers["svix-timestamp"],
            "svix-signature":req.headers["svix-signature"],
        })

        // get the data,type object from the request body
        const {data, type} = req.body;

        switch (type) {
          case "user.created": {
            const userData = {
                clerkId:data.id,
                email:data.email_addresses[0].email_address,
                firstName:data.first_name,
                lastName:data.last_name,
                photo:data.image_url,
                
            }
            await userModel.create(userData)
            res.json({})
            

            break;
          }

          case "user.updated": {
             const userData = {
               email: data.email_addresses[0].email_address,
               firstName: data.first_name,
               lastName: data.last_name,
               photo: data.image_url,
             };
             await userModel.findOneAndUpdate({clerkId:data.id},userData)
             res.json({})
            break;
          }

          case "user.deleted": {
            await userModel.findOneAndDelete({clerkId:data.id})
            res.json({})

            break;
          }

          default:
            break;
        }


    } catch (error) {
       console.log(error.message);
       res.json({success:false,message:error.message})
        
    }
}



// api controller function to get user aviable credits data 


const UserCredits = async (req,res) => {
    try {
        const {clerkId} = req.body;
        const userData = await userModel.findOne({clerkId})
        console.log("fetcher user data:", userData)
        // if(!user){
        //     return res.json({success:false,message:"User not found"})
        // }
        res.json({success:true,credits:userData.credits})

    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
        
    }
}

export {clerkWebhooks,UserCredits}