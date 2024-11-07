package xyz.lebkuchenfm.domain.commands.processors

import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.commands.CommandParameters
import xyz.lebkuchenfm.domain.commands.CommandProcessor
import xyz.lebkuchenfm.domain.commands.CommandProcessorRegistry
import xyz.lebkuchenfm.domain.commands.model.Command
import xyz.lebkuchenfm.domain.commands.model.CommandProcessingResult

private val logger = KotlinLogging.logger {}

class HelpCommandProcessor(private val commandPrompt: String) :
    CommandProcessor(
        key = "help",
        shortKey = null,
        helpMessage = "Displays available commands and examples of their usage.",
        exampleUsages = listOf("", "song-random"),
        parameters = CommandParameters(
            parameters = listOf(
                CommandParameters.OptionalCommandParameter("command-name"),
            ),
        ),
    ) {

    private lateinit var commandsRegistry: CommandProcessorRegistry

    fun setCommandRegistry(registry: CommandProcessorRegistry) {
        this.commandsRegistry = registry
    }

    override suspend fun execute(command: Command): CommandProcessingResult {
        val commandName = command.rawArgs
        return commandName?.let { helpWithCommand(it) }
            ?: helpWithoutCommand()
    }

    private fun helpWithCommand(commandName: String): CommandProcessingResult {
        val command = commandsRegistry.getProcessorByKey(commandName)
            ?: return error("No such command: $commandName", logger)

        val exampleText = command.exampleUsages
            .map { usage -> "  $commandPrompt $commandName $usage" }
            .joinToString("\n")

        return CommandProcessingResult.fromMultilineMarkdown(
            "```",
            this.getCommandWithParamsLine(command),
            "",
            "> ${command.helpMessage}",
            "",
            "Examples:",
            exampleText,
            "```",
        )
    }

    private fun helpWithoutCommand(): CommandProcessingResult {
        val uniqueCommands = getUniqueCommands()
        val groups = mutableMapOf<String, MutableList<String>>()

        uniqueCommands.forEach { command ->
            val groupKey = command.key.split("-").first()
            if (!groups.containsKey(groupKey)) groups[groupKey] = mutableListOf()
            val helpLine = "  ${getCommandHelpLine(command)}"
            groups[groupKey]?.add(helpLine)
        }

        val groupsText = groups.values.joinToString("\n\n") { it.joinToString("\n") }

        return CommandProcessingResult.fromMultilineMarkdown(
            "```",
            "LebkuchenFM",
            "",
            "For command specific information use `$commandPrompt help <command name>`",
            "",
            "Commands:",
            groupsText,
            "```",
        )
    }

    private fun getCommandWithParamsLine(definition: CommandProcessor): String {
        val key = definition.key
        val parameters = definition.parameters

        val paramsText = parameters.parameters
            .map { param ->
                val joinedParams = param.names.joinToString(" | ")
                when (param.required) {
                    true -> "<$joinedParams>"
                    false -> "[$joinedParams]"
                }
            }.joinToString { parameters.delimiter ?: "" }

        return "$key $paramsText"
    }

    private fun getCommandHelpLine(definition: CommandProcessor): String {
        val key = definition.key
        val shortKey = definition.shortKey
        val shortKeyFragment = shortKey?.let { " ($it)" } ?: ""
        return "${key}$shortKeyFragment"
    }

    private fun getUniqueCommands(): List<CommandProcessor> {
        return commandsRegistry.getRegistry().keys
            .filter { it == commandsRegistry.getProcessorByKey(it)?.key }
            .mapNotNull { commandsRegistry.getProcessorByKey(it) }
            .sortedBy { it.key }
    }
}
