package xyz.lebkuchenfm.domain.commands

import xyz.lebkuchenfm.domain.auth.Scope
import xyz.lebkuchenfm.domain.commands.model.Command
import xyz.lebkuchenfm.domain.commands.model.CommandProcessingResult
import kotlin.test.Test
import kotlin.test.assertEquals

class CommandScopesEnforcementTest {

    private val parser = TextCommandParser()

    private fun makeProcessor(requiredScopes: Set<Scope>): CommandProcessor {
        return object : CommandProcessor(
            key = "test-cmd",
            shortKey = null,
            helpMessage = "Test command.",
            exampleUsages = emptyList(),
            parameters = CommandParameters(parameters = emptyList()),
            requiredScopes = requiredScopes,
        ) {
            override suspend fun execute(command: Command, context: ExecutionContext): CommandProcessingResult {
                return CommandProcessingResult.fromMarkdown("executed")
            }
        }
    }

    private fun makeExecutor(processor: CommandProcessor): CommandExecutorService {
        val registry = CommandProcessorRegistry(listOf(processor))
        return CommandExecutorService(parser, registry)
    }

    @Test
    fun `command with required scope executes when user has that scope`() {
        // given
        val processor = makeProcessor(requiredScopes = setOf(Scope.PLAYER_QUEUE))
        val executor = makeExecutor(processor)
        val context = ExecutionContext(
            username = "alice",
            grantedScopes = setOf(Scope.PLAYER_QUEUE),
            commandPrompt = null,
        )

        // when
        val result = kotlinx.coroutines.runBlocking {
            executor.executeFromText("test-cmd", context)
        }

        // then
        assertEquals("executed", result.message.markdown)
    }

    @Test
    fun `command with required scope returns error when user lacks that scope`() {
        // given
        val processor = makeProcessor(requiredScopes = setOf(Scope.PLAYER_QUEUE))
        val executor = makeExecutor(processor)
        val context = ExecutionContext(
            username = "alice",
            grantedScopes = emptySet(),
            commandPrompt = null,
        )

        // when
        val result = kotlinx.coroutines.runBlocking {
            executor.executeFromText("test-cmd", context)
        }

        // then
        assertEquals("You don't have permission to use this command.", result.message.markdown)
    }

    @Test
    fun `command without required scopes always executes regardless of granted scopes`() {
        // given
        val processor = makeProcessor(requiredScopes = emptySet())
        val executor = makeExecutor(processor)
        val context = ExecutionContext(
            username = "alice",
            grantedScopes = emptySet(),
            commandPrompt = null,
        )

        // when
        val result = kotlinx.coroutines.runBlocking {
            executor.executeFromText("test-cmd", context)
        }

        // then
        assertEquals("executed", result.message.markdown)
    }
}
