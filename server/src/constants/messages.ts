const statusMessages = {
    error: {
        link: {
            create: "The link failed to materialize.",
            update: "Stuck in time! No changes made.",
            delete: "The link is stubborn—it won't go away.",
            other: "Attempt unsuccessful.",
        },
        workspace: {
            create: "Creation failed—blueprints burned!",
            update: "Upgrade attempt failed. Back to square one!",
            delete: "Elimination attempt failed!",
            other: "Attempt unsuccessful.",
        },
        user: {
            create: "Creation failed! The void rejected it.",
            update: "Uh-oh! Resisted the change.",
            delete: "Nice try! But they cling to life.",
            other: "Attempt unsuccessful.",
        },
        people: {
            create: "Alas! They did not join the cause.",
            update: "Resistance detected! No changes made.",
            delete: "A lonely void remains… No new allies.",
            other: "Attempt unsuccessful.",
        },
        other: {
            create: "Creation error! Did not make it.",
            update: "The transformation didn't take place!",
            delete: "Error in vanishing. Try again!",
            other: "Attempt unsuccessful.",
        },
    },

    success: {
        link: {
            create: "A bridge to greatness has been established!",
            update: "The link has been reforged with greater power!",
            delete: "Poof! Vanished into the void.",
            other: "Attempt successful.",
        },
        workspace: {
            create: "A fortress of productivity is now online!",
            update: "Enhancements applied! Reborn!",
            delete: "The workspace was deleted successfully.",
            other: "Attempt successful.",
        },
        user: {
            create: "A fresh soul has joined the digital realm!",
            update: "User leveled up! Changes applied.",
            delete: "Eliminated. Nothing but digital dust remains.",
            other: "Attempt successful.",
        },
        people: {
            create: "A new ally steps into the fray!",
            update: "They have evolved into a better version!",
            delete: "The people were deleted successfully.",
            other: "Attempt successful.",
        },
        other: {
            create: "Something epic has been created!",
            update: "A refinement of epic proportions!",
            delete: "Obliterated beyond recovery!",
            other: "Attempt successful.",
        },
    },
};

class StatusMessagesMark4 {
    entity: keyof (typeof statusMessages)["success"];

    constructor(entity: keyof (typeof statusMessages)["success"]) {
        this.entity = entity;
    }

    getMessage = (
        description: string,
        type: "success" | "error",
        operation: "update" | "create" | "delete" | "other"
    ) => {
        const title = statusMessages[type][this.entity][operation];
        return { title, description };
    };
}

export default StatusMessagesMark4;
