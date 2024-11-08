package xyz.lebkuchenfm.domain.commands.processors

import io.github.oshai.kotlinlogging.KotlinLogging
import xyz.lebkuchenfm.domain.commands.CommandParameters
import xyz.lebkuchenfm.domain.commands.CommandProcessor
import xyz.lebkuchenfm.domain.commands.CommandProcessorRegistry
import xyz.lebkuchenfm.domain.commands.model.Command
import xyz.lebkuchenfm.domain.commands.model.CommandProcessingResult
import java.util.concurrent.ConcurrentHashMap

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
        return commandName?.let { resultByCommand[it] } ?: generalHelpResult
    }

    private val uniqueCommands: List<CommandProcessor> by lazy {
        commandsRegistry.getCommandsKeys()
            .filter { it == commandsRegistry.getProcessorByKey(it)?.key }
            .mapNotNull { commandsRegistry.getProcessorByKey(it) }
            .sortedBy { it.key }
    }

    private val resultByCommand = LazyMap<String, CommandProcessingResult> { commandName ->
        getHelpForCommand(commandName)
    }

    private val generalHelpResult: CommandProcessingResult by lazy {
        getGeneralHelp()
    }

    private fun getGeneralHelp(): CommandProcessingResult {
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

    private fun getHelpForCommand(commandName: String): CommandProcessingResult {
        val command = commandsRegistry.getProcessorByKey(commandName)
            ?: return error("No such command: $commandName", logger)

        val exampleText = command.exampleUsages.joinToString("\n") { usage -> "  $commandPrompt $commandName $usage" }

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

    private fun getCommandWithParamsLine(definition: CommandProcessor): String {
        val key = definition.key
        val parameters = definition.parameters

        val paramsText = parameters.parameters.joinToString(parameters.delimiter ?: "") { param ->
            val joinedParams = param.names.joinToString(" | ")
            when (param.required) {
                true -> "<$joinedParams>"
                false -> "[$joinedParams]"
            }
        }

        return "$key $paramsText"
    }

    private fun getCommandHelpLine(definition: CommandProcessor): String {
        val key = definition.key
        val shortKey = definition.shortKey
        val shortKeyFragment = shortKey?.let { " ($it)" } ?: ""
        return "${key}$shortKeyFragment"
    }

    private class LazyMap<K, V>(
        private val compute: (K) -> V,
    ) {
        private val map = ConcurrentHashMap<K, V>()

        operator fun get(key: K): V? = map.getOrPut(key) { compute(key) }
    }
}
