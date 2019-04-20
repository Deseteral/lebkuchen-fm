package xyz.deseteral.lebkuchenfm.services.commands

import spock.lang.Specification
import spock.lang.Unroll
import xyz.deseteral.lebkuchenfm.domain.Command
import xyz.deseteral.lebkuchenfm.domain.CommandProcessingResponse

class TestCommand implements CommandProcessor {
    @Override
    CommandProcessingResponse process(List<String> args) {
        return new CommandProcessingResponse('TestCommand')
    }

    @Override
    String getKey() {
        return 'test'
    }

    @Override
    Optional<String> getShortKey() {
        return Optional.of('t')
    }

    @Override
    String getHelpMessage() {
        return 'this is a test command'
    }
}

class TestCommandWithArgs implements CommandProcessor {
    @Override
    CommandProcessingResponse process(List<String> args) {
        return new CommandProcessingResponse('TestCommandWithArgs [' + args.join(',') + ']')
    }

    @Override
    String getKey() {
        return 'testWithArgs'
    }

    @Override
    Optional<String> getShortKey() {
        return Optional.of('twa')
    }

    @Override
    String getHelpMessage() {
        return 'this is a test command with args'
    }
}

@Unroll
class RootCommandProcessorTest extends Specification {
    def 'should resolve #title'() {
        given:
        def testCommand = new TestCommand()
        def testCommandWithArgs = new TestCommandWithArgs()
        def rootProcessor = new RootCommandProcessor([testCommand, testCommandWithArgs])

        when:
        def processingResponse = rootProcessor.process(new Command(key, args))

        then:
        processingResponse.response == response

        where:
        title                             | key            | args             || response
        'command'                         | 'test'         | []               || 'TestCommand'
        'command with short key'          | 't'            | []               || 'TestCommand'
        'command with args'               | 'testWithArgs' | ['some', 'args'] || 'TestCommandWithArgs [some,args]'
        'command with short key and args' | 'twa'          | ['some', 'args'] || 'TestCommandWithArgs [some,args]'
        'not existing command'            | 'notExisting'  | []               || 'Komenda nie istnieje.'
    }
}
