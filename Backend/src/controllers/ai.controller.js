import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { generateAIResponse } from "../utils/aiResponse.js"

const aiChat = asyncHandler(async (req, res) => {
    const { history = [] } = req.body

    if (!Array.isArray(history)) {
        throw new ApiError(400, "History must be an array")
    }

    const aiReply = await generateAIResponse(history)
    console.log(aiReply)

    if (!aiReply) {
        throw new ApiError(500, "Failed to generate AI response")
    }

    return res.status(200).json(
        new ApiResponse(200, aiReply, "AI response generated successfully")
    )
})

export {
  aiChat 
}
