package xyz.deseteral.lebkuchenfm.domain

import spock.lang.Shared
import spock.lang.Specification
import spock.lang.Unroll

class CommandTest extends Specification {
    @Shared
    def testCommand = new TestCommand()

    @Unroll
    def 'should #desc'() {
        when:
        def result = new Command(key, []).matchProcessor(testCommand)

        then:
        result == matches

        where:
        desc                                   | key         || matches
        'match command processor by key'       | 'test'      || true
        'match command processor by short key' | 't'         || true
        'not match command processor'          | 'something' || false
    }

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
}
