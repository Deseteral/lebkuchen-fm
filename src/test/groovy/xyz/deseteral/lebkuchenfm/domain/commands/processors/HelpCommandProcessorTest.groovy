package xyz.deseteral.lebkuchenfm.domain.commands.processors

import org.jetbrains.annotations.NotNull
import spock.lang.Specification
import xyz.deseteral.lebkuchenfm.domain.commands.CommandProcessor
import xyz.deseteral.lebkuchenfm.domain.commands.model.Command
import xyz.deseteral.lebkuchenfm.domain.commands.model.CommandProcessingResponse

class FakeTestCommandProcessor implements CommandProcessor {
    private String key
    private String shortKey
    private String helpMessage

    FakeTestCommandProcessor(key, shortKey, helpMessage) {
        this.key = key
        this.shortKey = shortKey
        this.helpMessage = helpMessage
    }

    @Override
    String getKey() {
        return this.key
    }

    @Override
    String getShortKey() {
        return this.shortKey
    }

    @Override
    String getHelpMessage() {
        return this.helpMessage
    }

    @Override
    CommandProcessingResponse process(@NotNull Command command) {
        return null
    }
}

class HelpCommandProcessorTest extends Specification {
    def 'should display help message for all commands'() {
        given:
        def commandProcessors = [
            new FakeTestCommandProcessor('a-key', 'k', 'A message'),
            new FakeTestCommandProcessor('c-key', null, 'C message'),
            new FakeTestCommandProcessor('b-key', 'b', 'B message'),
        ]
        def processor = new HelpCommandProcessor(commandProcessors)

        when:
        def processingResponse = processor.process(new Command('help', ''))

        then:
        processingResponse.response == """Lista komend:
                                         |- a-key [k]: A message
                                         |- b-key [b]: B message
                                         |- c-key: C message
                                         |- help: Pokazuje tę wiadomość ;)""".stripMargin()
    }
}
