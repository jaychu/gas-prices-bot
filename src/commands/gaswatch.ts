import {
    Discord,
    Slash
} from "discordx";
import {
    CommandInteraction
} from "discord.js";

import {
    addGasWatcher,
    removeGasWatcher
} from "../helpers/functions.js";

@Discord()
abstract class AppDiscord {
    @Slash({ description: "Add yourself to be part of the Gas Watcher Notification Group", name: "add-gas-watcher" })
    add(
        interaction: CommandInteraction
    ) {
        console.log("Add Gas Watcher Triggered!");
        addGasWatcher(interaction);
    }

    @Slash({ description: "Remove yourself from the Gas Watcher Notification Group", name: "remove-gas-watcher" })
    remove(
        interaction: CommandInteraction
    ) {
        console.log("Remove Gas Watcher Triggered!")
        removeGasWatcher(interaction);
    }
}