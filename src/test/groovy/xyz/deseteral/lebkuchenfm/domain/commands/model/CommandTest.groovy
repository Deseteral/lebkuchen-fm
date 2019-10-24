package xyz.deseteral.lebkuchenfm.domain.commands.model

import spock.lang.Shared
import spock.lang.Specification
import spock.lang.Unroll
import xyz.deseteral.lebkuchenfm.domain.commands.CommandProcessor
import xyz.deseteral.lebkuchenfm.domain.commands.model.Command
import xyz.deseteral.lebkuchenfm.domain.commands.model.CommandKt
import xyz.deseteral.lebkuchenfm.domain.commands.model.CommandProcessingResponse

class CommandTest extends Specification {
    @Shared
    def testCommand = new TestCommand()

    @Unroll
    def 'should #desc'() {
        given:
        def command = new Command(key, '')

        when:
        def result = CommandKt.matchProcessor(command, testCommand)

        then:
        result == matches

        where:
        desc                                   | key         || matches
        'match command processor by key'       | 'test'      || true
        'match command processor by short key' | 't'         || true
        'not match command processor'          | 'something' || false
    }

    @Unroll
    def 'should get args from "#rawArgs" by "#delimiter" delimiter'() {
        given:
        def command = new Command('key', rawArgs)

        when:
        def args = command.getArgsByDelimiter(delimiter)

        then:
        args == expectedArgs

        where:
        rawArgs                                  | delimiter || expectedArgs
        'some args list'                         | ' '       || ['some', 'args', 'list']
        'some|args|list'                         | '|'       || ['some', 'args', 'list']
        '  some    args with    whitespaces    ' | ' '       || ['some', 'args', 'with', 'whitespaces']
        ''                                       | ' '       || []
        ' '                                      | '|'       || [' ']
    }

    class TestCommand implements CommandProcessor {
        @Override
        CommandProcessingResponse process(Command command) {
            return new CommandProcessingResponse('TestCommand')
        }

        @Override
        String getKey() {
            return 'test'
        }

        @Override
        String getShortKey() {
            return 't'
        }

        @Override
        String getHelpMessage() {
            return 'this is a test command'
        }
    }
}
