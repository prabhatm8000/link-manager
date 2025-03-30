type Operation = "create" | "update" | "delete" | string;
type Entity = "user" | "workspace" | "people" | "link" | string;
type Status = "success" | "fail";
type MsgBuilder5000Options = {
    operation: Operation;
    performedOn: Entity;
    status: Status;
    msg?: string;
};

const messages: Record<Status, Record<Operation, Record<Entity, string[]>>> = {
    success: {
        create: {
            user: [
                "Boom! {entity} '{name}' has emerged!",
                "A fresh soul '{name}' has joined the digital realm!",
                "A new challenger, '{name}', appears!",
            ],
            workspace: [
                "A legendary {entity} '{name}' has been forged!",
                "Behold! A new hub of creativity: '{name}'!",
                "A fortress of productivity '{name}' is now online!",
            ],
            people: [
                "Another hero '{name}' joins the ranks!",
                "The team grows stronger with '{name}'!",
                "A new ally, '{name}', steps into the fray!",
            ],
            link: [
                "A bridge to greatness '{name}' has been established!",
                "Connection secured! '{name}' is live!",
                "A new path '{name}' has been forged!",
            ],
            other: [
                "Something epic '{name}' has been created!",
                "New possibilities have been unlocked: '{name}'!",
                "A creation worthy of legends: '{name}'!",
            ],
        },
        update: {
            user: [
                "User '{name}' leveled up! Changes applied.",
                "User '{name}' stats updated. They are stronger now!",
                "A fresh look! '{name}' has been upgraded!",
            ],
            workspace: [
                "Workspace '{name}' upgraded to its final form!",
                "Enhancements applied! '{name}' reborn!",
                "Workspace '{name}' has been optimized for greatness!",
            ],
            people: [
                "People '{name}' have evolved into a better version!",
                "A transformation has taken place for '{name}'!",
                "Improved connections, stronger bonds with '{name}'!",
            ],
            link: [
                "The link '{name}' has been reforged with greater power!",
                "Connection reinforced! '{name}' is now stronger.",
                "A new and improved link '{name}' is now active!",
            ],
            other: [
                "A successful transformation took place for '{name}'!",
                "Something just got better. Keep going, '{name}'!",
                "A refinement of epic proportions: '{name}'!",
            ],
        },
        delete: {
            user: [
                "User '{name}' obliterated! No traces remain.",
                "Poof! '{name}' has vanished into the void.",
                "User '{name}' eliminated. Nothing but digital dust remains.",
            ],
            workspace: [
                "Workspace '{name}' annihilated! It's gone for good.",
                "A great collapse! '{name}' is no more.",
                "Workspace '{name}' erased from existence!",
            ],
            people: [
                "'{name}' has left the ranks, but their legend remains!",
                "Gone but not forgotten: '{name}'!",
                "One less in the ranks, '{name}' will be missed!",
            ],
            link: [
                "The link '{name}' has been severed. No way back!",
                "Connection lost! '{name}' is history.",
                "The link '{name}' was snapped out of existence!",
            ],
            other: [
                "Vanished! '{name}' no longer exists.",
                "Gone, erased, wiped from reality: '{name}'!",
                "Obliterated beyond recovery: '{name}'!",
            ],
        },
    },
    fail: {
        create: {
            user: [
                "Oops! '{name}' refused to be born.",
                "User creation failed! The void rejected '{name}'.",
                "A ghost user? '{name}' is nowhere to be found!",
            ],
            workspace: [
                "The workspace '{name}' collapsed before it even began!",
                "Workspace creation failed—blueprints burned!",
                "The workspace '{name}' crumbled before it could rise.",
            ],
            people: [
                "Alas! '{name}' did not join the cause.",
                "People rejected the call to action: '{name}'!",
                "A lonely void remains… '{name}' did not join.",
            ],
            link: [
                "The link '{name}' failed to materialize into existence.",
                "Connection lost before '{name}' even formed.",
                "Link '{name}' creation attempt unsuccessful.",
            ],
            other: [
                "Failed to create '{name}'... Something went terribly wrong.",
                "Creation error! '{name}' did not make it.",
                "The process stopped mid-way. '{name}' is incomplete.",
            ],
        },
        update: {
            user: [
                "Uh-oh! '{name}' resisted the change.",
                "User update failed! '{name}' remains unchanged.",
                "No upgrade today for '{name}'! Try again.",
            ],
            workspace: [
                "Workspace '{name}' update failed—glitches detected!",
                "Workspace '{name}' resisted transformation!",
                "Upgrade attempt failed for '{name}'. Back to square one!",
            ],
            people: [
                "People '{name}' did not accept the transformation.",
                "Resistance detected! No changes made to '{name}'.",
                "Update rejected for '{name}'. They remain the same!",
            ],
            link: [
                "The link '{name}' refused to evolve. Try again?",
                "The link '{name}' is stuck in time!",
                "No upgrades for '{name}' today!",
            ],
            other: [
                "Update attempt unsuccessful for '{name}'. No changes made.",
                "The transformation didn't take place for '{name}'!",
                "Error in upgrading '{name}'. Retry?",
            ],
        },
        delete: {
            user: [
                "Nice try! But '{name}' clings to life.",
                "User deletion failed! '{name}' won't go down so easily.",
                "A stubborn entity '{name}' refuses to be erased!",
            ],
            workspace: [
                "The workspace '{name}' refused to be erased.",
                "Workspace deletion blocked! '{name}' is still standing.",
                "Workspace '{name}' elimination attempt failed!",
            ],
            people: [
                "'{name}' is not ready to say goodbye.",
                "Someone's holding on tight! '{name}' can't be deleted.",
                "Deletion denied! '{name}' remains.",
            ],
            link: [
                "The link '{name}' is stubborn—it won't go away.",
                "Severing failed! '{name}' endures.",
                "The link '{name}' refuses to fade!",
            ],
            other: [
                "Deletion failed. '{name}' refuses to disappear.",
                "The void rejected this deletion request for '{name}'!",
                "Error in vanishing '{name}'. Try again!",
            ],
        },
    },
};

function getRandomMsg(
    status: Status,
    operation: Operation,
    entity: Entity,
    name: string
): string {
    const opts = messages[status][operation][entity];
    const randomIndex = Math.floor(Math.random() * opts.length);
    return opts[randomIndex]
        .replace("{name}", name)
        .replace("{entity}", entity);
}

/**
 * Builds a response message based on the operation, performedOn, and status
 * @param options
 * @returns
 */
function MsgBuilder5000(options: MsgBuilder5000Options): string {
    const { operation, performedOn, status, msg } = options;
    if (msg) {
        return msg;
    }
    return getRandomMsg(status, operation, performedOn, performedOn);
}

export default MsgBuilder5000;
