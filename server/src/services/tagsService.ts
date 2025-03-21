import mongoose from "mongoose";
import Tags from "../models/tags";

const MAX_TAG_LENGTH = 20;

const addTags = async (workspaceId: string, tags: string[]) => {
    const setValues = new Set(
        tags.map((tag) => {
            if (tag.length > MAX_TAG_LENGTH) tag = tag.slice(0, MAX_TAG_LENGTH);
            return tag.trim().toLowerCase();
        })
    ).values();

    const filteredTags = Array.from(setValues);

    const newTags = await Tags.findOneAndUpdate(
        { workspaceId: new mongoose.Types.ObjectId(workspaceId) },
        { $addToSet: { tags: { $each: filteredTags } } }, // Prevents duplicates
        { upsert: true, new: true } // Creates new document if it doesn't exist
    );
    return newTags;
};

const deleteTags = async (workspaceId: string) => {
    return Tags.findOneAndDelete({
        workspaceId: new mongoose.Types.ObjectId(workspaceId),
    });
};

const getTags = async (workspaceId: string) => {
    const tags = await Tags.findOne({
        workspaceId: new mongoose.Types.ObjectId(workspaceId),
    });
    return tags;
};

const tagsService = { addTags, getTags, deleteTags };
export default tagsService;
