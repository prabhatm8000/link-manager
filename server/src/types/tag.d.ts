export interface ITags extends mongoose.Document {
    tags: string[];
    workspaceId: mongoose.Types.ObjectId;
    id: string;
}

export interface ITagsService {
    /**
     * Add the set of tags in the links to the workspace
     * @param workspaceId 
     * @param tags 
     * @returns 
     */
    addTags: (workspaceId: string, tags: string[]) => Promise<ITags>;

    /**
     * get all the tags in the workspace
     * @param workspaceId 
     * @returns 
     */
    getTags: (workspaceId: string) => Promise<ITags | null>;

    /**
     * delete all the tags in the workspace
     * @param workspaceId 
     * @returns 
     */
    deleteTags: (workspaceId: string) => Promise<void>;

    /**
     * search the tags in the workspace [for auto complete]
     * @param workspaceId 
     * @param q 
     * @returns 
     */
    searchTags: (workspaceId: string, q: string) => Promise<ITags[]>;
}
